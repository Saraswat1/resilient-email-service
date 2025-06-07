# Resilient Email Service

A robust email sending service implemented in **JavaScript (Node.js)** featuring:

- Retry mechanism with exponential backoff
- Fallback between two mock email providers
- Idempotency to prevent duplicate sends
- Basic rate limiting
- Status tracking of email attempts
- Bonus: Circuit breaker pattern, simple logging, and a queue system

---

## Features

- **Retry Logic:** Automatically retries sending failed emails with exponential backoff.
- **Fallback:** Switches to a secondary provider if the primary provider fails.
- **Idempotency:** Uses unique message IDs to avoid sending duplicate emails.
- **Rate Limiting:** Limits the number of emails sent per minute.
- **Status Tracking:** Tracks the status of each email send attempt.
- **Bonus Features:** Circuit breaker for providers, logging, and queue management.

---

## Assumptions

- This project uses **mock email providers** to simulate email sending; no real emails are sent.
- The service listens on port `3000` locally and uses `process.env.PORT` in cloud deployments.
- Rate limiting is per minute and global for all emails combined.
- Idempotency is based on a client-supplied `messageId` or generated UUID per request.
- Logging outputs to the console.
- No database is used; status and queue data are stored in-memory (reset on server restart).
- Intended for demonstration and learning purposes, not production-ready.

---

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- Git (optional, for cloning repo)

##Cloud Deployment
This service is deployed and accessible at:

https://resilient-email-service-j4ff.onrender.com


### Clone the repository

```bash
git clone https://github.com/Saraswat1/resilient-email-service.git
cd resilient-email-service
