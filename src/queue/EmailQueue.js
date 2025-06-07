class EmailQueue {
  constructor(service) {
    this.service = service;
    this.queue = [];
    this.interval = setInterval(this.process.bind(this), 5000);
  }

  enqueue(email) {
    this.queue.push(email);
  }

  async process() {
    if (this.queue.length > 0 && this.service.sentCount < this.service.rateLimit) {
      const email = this.queue.shift();
      await this.service.send(email);
    }
  }
}

module.exports = EmailQueue;