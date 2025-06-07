class ProviderA {
  async send(email) {
    // Simulate success or failure
    if (Math.random() < 0.8) {
      return "Sent by A";
    } else {
      throw new Error("ProviderA failed");
    }
  }
}

module.exports = ProviderA;
