class ProviderB {
  async send(email) {
    // Simulate success or failure
    if (Math.random() < 0.9) {
      return "Sent by B";
    } else {
      throw new Error("ProviderB failed");
    }
  }
}

module.exports = ProviderB;
