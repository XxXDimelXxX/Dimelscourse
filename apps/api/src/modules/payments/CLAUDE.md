# Payments Module

Checkout and webhook flow. Currently uses a mock payment gateway.

## Flow

1. `POST /payments/checkout` — Creates pending payment record
2. `POST /webhooks/payments` — Processes webhook: updates payment status, calls `EnrollmentService.grantAccess()` on success

## Entity

**PaymentEntity** — Fields: type (one-time/subscription), status (pending/success/failed), amountUsd, transactionId (unique), accessGranted flag. Idempotent: won't double-grant access.

## Important Notes

- Payment gateway is fully mocked (`provider: "demo-gateway"`).
- No webhook signature verification — needs real provider integration for production.
- Uses `EnrollmentService` for access grants (do not duplicate enrollment logic here).
