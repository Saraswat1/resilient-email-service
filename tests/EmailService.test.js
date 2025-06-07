const EmailService = require("../src/services/EmailService");

describe("EmailService", () => {
  let service;

  beforeEach(() => {
    service = new EmailService();
  });

  afterEach(() => {
    clearInterval(service.queue?.interval);
  });

  test("Avoid duplicate emails", async () => {
    const email = { to: "test@example.com", subject: "Test", body: "Hello" };
    await service.send(email);
    const result = await service.send(email);
    expect(result).toBe("Duplicate");
  });
});
