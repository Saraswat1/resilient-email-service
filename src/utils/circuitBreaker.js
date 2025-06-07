class CircuitBreaker {
  constructor(threshold, timeout) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failures = 0;
    this.open = false;
  }

  fail() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.open = true;
      setTimeout(() => {
        this.reset();
      }, this.timeout);
    }
  }

  isOpen() {
    return this.open;
  }

  reset() {
    this.failures = 0;
    this.open = false;
  }
}

module.exports = CircuitBreaker;
