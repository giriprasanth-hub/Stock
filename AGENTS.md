# Instructions for AI Agents in SmartStock

Welcome, agent. This is the guidelines document for SmartStock, an Intelligent Stock Reservation & Order Confirmation System. Please read and follow these rules strictly.

## Project Purpose
To provide a secure, concurrent, and highly tested reservation and order confirmation system for stock management.

## Architecture
We use a clean layered architecture:
`Controller -> DTO -> Service -> Repository -> Entity -> MySQL`

- Do not expose JPA entities directly from APIs. Always use Request/Response DTOs.
- Keep controllers thin. Keep all business and validation logic in the Service layer.

## Coding & API Conventions
- Use standard Java camelCase and Spring naming conventions.
- HTTP status codes must match the operation outcome:
  - `200 OK` or `201 Created` for success.
  - `400 Bad Request` for validation errors.
  - `401 Unauthorized` for authentication failures.
  - `403 Forbidden` for role authorization issues.
  - `404 Not Found` for missing entities.
  - `409 Conflict` for business rule violations (e.g. stock deficit).
- Return custom, structured error payloads containing timestamp, status code, error type, message, and path. Never leak Java stack traces to clients.

## Security Requirements
- Spring Security with JWT token-based authentication.
- Never store passwords in plain text. Always use BCrypt password hashing.
- Environment variables must be used for secrets. Never commit JWT secrets or database passwords.

## Database Rules
- Keep all state-changing operations strictly `@Transactional`.
- Use **Pessimistic Locking** (`PESSIMISTIC_WRITE`) on `Product` stock updates to prevent race conditions.
- Ensure SKU, Email, and Reservation Code are unique in the database.

## How to Run & Test
- **Backend:** Run using Maven: `mvn spring-boot:run` in `backend/` directory.
- **Frontend:** Run Vite: `npm run dev` in `frontend/` directory.
- **E2E Tests:** Run `npx playwright test` in workspace root.

## Rules AI Agents MUST NOT Violate
- **NEVER** expose secrets or hardcode passwords/tokens.
- **NEVER** bypass failing tests. If a test fails, figure out why and fix the implementation. Do not edit/disable tests just to make them pass.
- **ALWAYS** preserve business rules (e.g. negative stock prevention, active products only, idempotency of cancellations/confirmations).
- **ALWAYS** run relevant tests after changes.
