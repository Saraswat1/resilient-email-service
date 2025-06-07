const express = require("express");
const EmailService = require("./services/EmailService");

const app = express();
const port = 3000;
const emailService = new EmailService();

app.use(express.json());

// Root route (optional)
app.get("/", (req, res) => {
  res.send("✅ Email Service is running. Use /send and /status endpoints.");
});

app.post("/send", async (req, res) => {
  const { to, subject, body } = req.body;
  try {
    const result = await emailService.send({ to, subject, body });
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.get("/status", (req, res) => {
  res.json(emailService.getStatus());
});

app.listen(port, () => {
  console.log(`🚀 Email service running at http://localhost:${port}`);
});
