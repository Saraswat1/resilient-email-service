const ProviderA = require("./providers/ProviderA");
const ProviderB = require("./providers/ProviderB");
const { log } = require("../utils/logger");
const CircuitBreaker = require("../utils/circuitBreaker");

class EmailService {
  constructor() {
    this.providers = [new ProviderA(), new ProviderB()];
    this.statusMap = {};
    this.sentEmails = new Set(); // For idempotency
    this.rateLimit = { max: 5, window: 10000, count: 0 }; // 5 per 10s
    this.queue = { emails: [], interval: null };
    this.breaker = new CircuitBreaker(3, 10000);

    this.queue.interval = setInterval(() => {
      if (this.queue.emails.length > 0 && this._canSend()) {
        const email = this.queue.emails.shift();
        this.send(email);
      }
    }, 2000);
  }

  async send(email) {
    const key = `${email.to}-${email.subject}`;
    if (this.sentEmails.has(key)) return "Duplicate";
    if (!this._canSend()) {
      this.queue.emails.push(email);
      return "Rate limited - queued";
    }

    this._incrementRate();

    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      try {
        if (this.breaker.isOpen()) throw new Error("Circuit breaker open");

        await this._retry(() => provider.send(email), 3);
        this.sentEmails.add(key);
        this.statusMap[key] = `Sent via Provider ${i + 1}`;
        log(`Email sent via Provider ${i + 1}`);
        return `Provider${i + 1}: Success`;
      } catch (err) {
        log(`Provider ${i + 1} failed: ${err.message}`);
        this.breaker.fail();
        continue;
      }
    }

    this.statusMap[key] = "All providers failed";
    return "All providers failed";
  }

  getStatus() {
    return this.statusMap;
  }

  async _retry(fn, retries) {
    let delay = 500;
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2;
      }
    }
  }

  _canSend() {
    return this.rateLimit.count < this.rateLimit.max;
  }

  _incrementRate() {
    this.rateLimit.count++;
    setTimeout(() => this.rateLimit.count--, this.rateLimit.window);
  }
}

module.exports = EmailService;
