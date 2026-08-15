**# SmartStock — Inventory & Reservation Management System**

SmartStock is a full-stack inventory management application built with React.js, Java Spring Boot, and MySQL. The application provides product management, stock tracking, JWT authentication, role-based authorization, and a reservation workflow with automatic expiration and stock restoration.

**---**

**## Table of Contents**

\- [Assessment Focus](#assessment-focus)
\- [Overview](#overview)
\- [Features]\(#features)
\- [Technology Stack]\(#technology-stack)
\- [Architecture]\(#architecture)
\- [Project Structure]\(#project-structure)
\- [Prerequisites]\(#prerequisites)
\- [Environment Variables]\(#environment-variables)
\- [Backend Configuration]\(#backend-configuration)
\- [Database Setup]\(#database-setup)
\- [Running the Backend]\(#running-the-backend)
\- [Running the Frontend]\(#running-the-frontend)
\- [API Testing]\(#api-testing)
\- [Reservation Workflow](#reservation-workflow)
\- [Reservation Validation](#reservation-validation)
\- [Reservation Expiration]\(#reservation-expiration)
\- [Security]\(#security)
\- [Testing]\(#testing)
\- [Test Coverage]\(#test-coverage)
\- [AI-Assisted Development]\(#ai-assisted-development)
\- [AI Change Loop](#ai-change-loop)
\- [Deliberate Red Run](#deliberate-red-run--test-failure-evidence)
\- [Git Workflow]\(#git-workflow)
\- [Configuration and Secrets]\(#configuration-and-secrets)
\- [Troubleshooting](#troubleshooting)
\- [Known Limitations](#known-limitations)
\- [Verification Checklist]\(#verification-checklist)
\- [Author]\(#author)

**---**


**---

## Assessment Focus

For the assessment, the primary functionality selected for implementation,
validation, and demonstration is the **Inventory Reservation Workflow**.

The scope of this workflow includes:

- Reservation creation
- Reservation quantity validation
- Product existence validation
- Available-stock validation
- Reservation ownership validation
- Reservation confirmation
- Reservation cancellation
- Reservation expiration
- Automatic stock restoration
- Reservation status validation
- Regression testing of existing reservation behavior

The reservation workflow was selected because it contains meaningful
business rules, state transitions, authorization checks, and time-dependent
behavior.

**Evidence placeholder — add assessment evidence here:**

> **[ADD EVIDENCE: Screenshot/video reference showing the reservation
> workflow being exercised.]**

**## Overview**

SmartStock manages inventory and reservations through a React.js frontend and a Spring Boot REST API backend.

The backend uses:

\- Java 21
\- Spring Boot 3.3.2
\- Spring Data JPA
\- Spring Security
\- JWT authentication
\- MySQL
\- Maven
\- JUnit 5
\- Mockito

The reservation module is designed around business-rule validation. It checks reservation quantities, product availability, user ownership, reservation status, and expiration before performing state-changing operations.

**---**

**## Features**

**### Authentication and Authorization**

\- JWT-based authentication
\- User and Admin roles
\- Protected API endpoints
\- Role-based authorization
\- Reservation ownership validation
\- Unauthorized access handling

**### Product Management**

\- Product management
\- Product availability tracking
\- Stock quantity tracking
\- Product validation
\- Database persistence using JPA/Hibernate

**### Reservation Management**

\- Create reservations
\- Validate reservation quantity
\- Validate available stock
\- Maintain reservation status
\- Confirm reservations
\- Cancel pending reservations
\- Automatically expire pending reservations
\- Restore stock after cancellation
\- Restore stock after expiration

**### Reservation Status**

\`\`\`text
PENDING
   |
   +----> CONFIRMED
   |
   +----> CANCELLED
   |
   +----> EXPIRED
\`\`\`

**---**

**## Technology Stack**

**### Frontend**

\- React.js
\- JavaScript
\- HTML5
\- CSS3

**### Backend**

\- Java 21 LTS
\- Spring Boot 3.3.2
\- Spring Data JPA
\- Spring Security
\- JWT
\- Hibernate
\- Maven

**### Database**

\- MySQL
\- MySQL Connector/J

**### Testing**

\- JUnit 5
\- Mockito
\- Maven Surefire

**### Development Tools**

\- Visual Studio Code
\- Git
\- GitHub

**---**

**## Architecture**

\`\`\`text
+-----------------------+
\|     React Frontend    |
\|       React.js        |
+-----------+-----------+
            |
            | HTTP / REST API
            v
+-----------------------+
\|   Spring Boot Backend |
\|                       |
\| Controllers           |
\| Services              |
\| Security / JWT        |
\| Exception Handling    |
+-----------+-----------+
            |
            | JPA / Hibernate
            v
+-----------------------+
\|        MySQL          |
\|    smartstock\_db      |
+-----------------------+
\`\`\`

**---**

**## Project Structure**

\`\`\`text
Stock/
|
+-- backend/
\|   |
\|   +-- src/
\|   |   |
\|   |   +-- main/
\|   |   |   |
\|   |   |   +-- java/
\|   |   |   |   |
\|   |   |   |   +-- com/
\|   |   |   |       |
\|   |   |   |       +-- smartstock/
\|   |   |   |           |
\|   |   |   |           +-- controller/
\|   |   |   |           +-- dto/
\|   |   |   |           +-- entity/
\|   |   |   |           +-- exception/
\|   |   |   |           +-- repository/
\|   |   |   |           +-- security/
\|   |   |   |           +-- service/
\|   |   |   |           +-- SmartStockApplication.java
\|   |   |   |
\|   |   |   +-- resources/
\|   |   |       |
\|   |   |       +-- application.properties
\|   |   |
\|   |   +-- test/
\|   |       |
\|   |       +-- java/
\|   |           |
\|   |           +-- com/
\|   |               |
\|   |               +-- smartstock/
\|   |                   |
\|   |                   +-- service/
\|   |                       +-- ReservationServiceTest.java
\|   |
\|   +-- pom.xml
|
+-- frontend/
\|   +-- React application
|
+-- README.md
\`\`\`

**---**

**## Prerequisites**

Install the following before running the project:

**### Java**

Java 21 LTS is used by the project.

Verify:

\`\`\`powershell
java -version
\`\`\`

Expected:

\`\`\`text
java version "21.0.11"
\`\`\`

**### Maven**

Verify Maven:

\`\`\`powershell
mvn -version
\`\`\`

If Maven is not globally available, the project can be run using the Maven executable available through the development environment.

**### MySQL**

Install MySQL Server and create the SmartStock database.

**### Node.js**

Node.js and npm are required for the React frontend.

Verify:

\`\`\`powershell
node -v
npm -v
\`\`\`

**### Git**

Verify:

\`\`\`powershell
git --version
\`\`\`

**---**

**## Environment Variables**

The backend uses environment variables for database credentials and JWT configuration.

Required variables:

\`\`\`text
DB\_URL
DB\_USERNAME
DB\_PASSWORD
JWT\_SECRET
\`\`\`

**### PowerShell Example**

Use your own local credentials:

\`\`\`powershell
$env\:DB\_URL="jdbc\:mysql://localhost:3306/smartstock\_db"
$env\:DB\_USERNAME="root"
$env\:DB\_PASSWORD="\<your-database-password>"
$env\:JWT\_SECRET="\<your-jwt-secret>"
\`\`\`

Do not commit real passwords or secrets to the repository.

**---**

**## Backend Configuration**

The backend \`application.properties\` uses environment variables:

\`\`\`properties
\# Application Config
spring.application.name=smartstock

\# Server Config
server.port=8080

\# Database Config
spring.datasource.url=${DB\_URL}
spring.datasource.username=${DB\_USERNAME}
spring.datasource.password=${DB\_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

\# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format\_sql=true

\# JWT Security
jwt.secret=${JWT\_SECRET}
jwt.expiration.ms=86400000

\# Reservation Configuration
reservation.expiration.minutes=10
reservation.expiration.check.rate=10000

\# Logging
logging.level.com.smartstock=DEBUG
logging.level.org.springframework.web=INFO
logging.level.org.hibernate.SQL=DEBUG
\`\`\`

**### Important Configuration**

\`\`\`properties
reservation.expiration.minutes=10
\`\`\`

Pending reservations expire after 10 minutes.

\`\`\`properties
reservation.expiration.check.rate=10000
\`\`\`

The expiration process checks every 10 seconds.

**---**

**## Database Setup**

Create the database in MySQL:

\`\`\`sql
CREATE DATABASE smartstock\_db;
\`\`\`

The application uses:

\`\`\`text
Database: smartstock\_db
Username: root
\`\`\`

Hibernate is configured with:

\`\`\`properties
spring.jpa.hibernate.ddl-auto=update
\`\`\`

Therefore, the application can create/update the required tables based on the JPA entities.

**---**

**## Running the Backend**

Navigate to the backend:

\`\`\`powershell
cd Stock
cd backend
\`\`\`

Set environment variables:

\`\`\`powershell
$env\:DB\_URL="jdbc\:mysql://localhost:3306/smartstock\_db"
$env\:DB\_USERNAME="root"
$env\:DB\_PASSWORD="\<your-database-password>"
$env\:JWT\_SECRET="\<your-jwt-secret>"
\`\`\`

Start Spring Boot:

\`\`\`powershell
mvn spring-boot\:run
\`\`\`

If \`mvn\` is not available globally, use the Maven executable configured by your development environment.

The backend runs on:

\`\`\`text
http\://localhost:8080
\`\`\`

**---**

**## Running the Frontend**

Navigate to the frontend directory:

\`\`\`powershell
cd frontend
\`\`\`

Install dependencies:

\`\`\`powershell
npm install
\`\`\`

Start the development server:

\`\`\`powershell
npm start
\`\`\`

The exact frontend development URL depends on the React setup used by the project.

**---**

**## API Testing**

The backend APIs have been tested and verified as part of the project workflow.

When testing protected endpoints:

1\. Register or use a valid user.
2\. Log in.
3\. Obtain the JWT token.
4\. Include the token in the request:

\`\`\`text
Authorization: Bearer \<JWT\_TOKEN>
\`\`\`

The root URL may return:

\`\`\`text
403 Forbidden
\`\`\`

when accessed without the required authorization. This does not indicate that the Spring Boot server is down; it indicates that Spring Security is protecting the endpoint.

**---**

**## Reservation Workflow**

A reservation follows this general workflow:

\`\`\`text
Client
  |
  v
Create Reservation
  |
  v
Validate User
  |
  v
Validate Product
  |
  v
Validate Quantity
  |
  v
Check Available Stock
  |
  v
Create PENDING Reservation
  |
  v
Reduce Available Stock
  |
  v
Return Reservation Response
\`\`\`

**### Confirmation**

\`\`\`text
PENDING
   |
   | confirm
   v
CONFIRMED
\`\`\`

Only valid reservations can be confirmed.

**### Cancellation**

\`\`\`text
PENDING
   |
   | cancel
   v
CANCELLED
   |
   v
Restore Reserved Stock
\`\`\`

**### Expiration**

\`\`\`text
PENDING
   |
   | expiration time reached
   v
EXPIRED
   |
   v
Restore Reserved Stock
\`\`\`

**---**

**## Reservation Validation**

The reservation service validates important business rules including:

**### Quantity Validation**

Invalid quantities such as:

\`\`\`text
0
-5
\`\`\`

are rejected.

**### Product Validation**

A reservation cannot be created for a product that does not exist.

**### Stock Validation**

A reservation cannot exceed available stock.

**### Authorization**

A user cannot access or modify another user's reservation.

**### Status Validation**

Only supported reservation states can transition to confirmation.

**### Expiration Validation**

Expired reservations cannot be confirmed.

**---**

**## Reservation Expiration**

The application contains scheduled reservation expiration logic.

Configuration:

\`\`\`properties
reservation.expiration.minutes=10
reservation.expiration.check.rate=10000
\`\`\`

The scheduler:

1\. Finds expired pending reservations.
2\. Restores reserved stock.
3\. Changes the reservation status to \`EXPIRED\`.
4\. Saves the updated reservation.

Multiple expired reservations can be processed in the same scheduler execution.

**---**

**## Security**

SmartStock uses Spring Security and JWT authentication.

Security features include:

\- JWT authentication
\- Role-based authorization
\- USER role
\- ADMIN role
\- Protected API endpoints
\- Reservation ownership checks
\- Unauthorized access handling
\- Business-rule validation

Secrets are supplied through environment variables rather than committed to source code.

**---**

**## Testing**

The backend uses:

\- JUnit 5
\- Mockito
\- Maven Surefire

Run the complete test suite:

\`\`\`powershell
mvn test
\`\`\`

**### Current Reservation Service Test Result**

\`\`\`text
Tests run: 17
Failures: 0
Errors: 0
Skipped: 0

BUILD SUCCESS
\`\`\`

This confirms that all 17 current reservation service tests pass.

**---**

**## Test Coverage**

The reservation service has been validated against the following scenarios:

\- Create reservation when stock is available
\- Reject zero quantity
\- Reject negative quantity
\- Reject reservation when product does not exist
\- Reject reservation when stock is insufficient
\- Validate reservation ownership
\- Reject unauthorized access
\- Cancel pending reservation
\- Restore stock after cancellation
\- Confirm reservation
\- Reject unsupported reservation status
\- Expire pending reservation
\- Expire multiple pending reservations
\- Do nothing when there are no expired reservations
\- Restore stock when reservation expires
\- Validate expiration before confirmation
\- Preserve existing reservation functionality after changes

**---**

**## AI-Assisted Development**

SmartStock was developed and validated using an iterative AI-assisted development workflow.

AI assistance was used to:

\- Identify edge cases
\- Design additional unit tests
\- Analyze failing test output
\- Suggest implementation changes
\- Refine reservation business rules
\- Debug test failures
\- Validate the final implementation

All AI-suggested changes were reviewed and tested before being retained in the project.

**---**

**## AI Change Loop**

The development process followed this loop:

\`\`\`text
+---------------------------+
\| Identify Requirement      |
+-------------+-------------+
              |
              v
+---------------------------+
\| Ask AI for Solution       |
+-------------+-------------+
              |
              v
+---------------------------+
\| Review Suggested Change   |
+-------------+-------------+
              |
              v
+---------------------------+
\| Apply Code/Test Change    |
+-------------+-------------+
              |
              v
+---------------------------+
\| Run Targeted Test         |
+-------------+-------------+
              |
              v
       +------+------+
       | Test Pass?  |
       +------+------+
              |
        +-----+-----+
        |           |
       NO          YES
        |           |
        v           v
 Analyze & Fix   Run Full
    Failure       Suite
        |           |
        +-----+-----+
              |
              v
+---------------------------+
\| Verify Existing APIs      |
+-------------+-------------+
              |
              v
+---------------------------+
\| Commit Validated Changes  |
+---------------------------+
\`\`\`

**---**

**## AI Change Example — Reservation Status Validation

An edge case was identified where confirmation should be rejected when a
reservation has an unsupported/null status.

### Initial AI Prompt

> Review the reservation confirmation logic and identify business-rule edge
> cases that should be covered by unit tests. Focus on unsupported reservation
> statuses, expiration, authorization, and preventing unintended state changes.

**Evidence placeholder:**

> **[ADD SCREENSHOT OF THE ACTUAL AI PROMPT AND RESPONSE HERE.]**

### Test Added

```java
@Test
void shouldRejectConfirmationForUnsupportedReservationStatus() {
    // Reservation configured with unsupported/null status.
    // Confirmation should throw BusinessRuleViolationException.
}
```

### Iteration 1 — Initial Failure

The targeted test was run and initially failed because the confirmation flow
reached a later validation step and encountered a missing mocked value.

Observed failure:

```text
Expected:
BusinessRuleViolationException

Actual:
NullPointerException
```

One failure occurred because `expiresAt` was not configured in the mocked
reservation.

**Evidence placeholder:**

> **[ADD SCREENSHOT OF THIS FAILURE IF AVAILABLE.]**

### Iteration 2 — Test Setup Correction

The test was updated to provide a future expiration time and the required
reservation/user mock interactions.

The test then progressed further into the confirmation flow.

**Evidence placeholder:**

> **[ADD GIT DIFF OR IDE SCREENSHOT OF THE TEST SETUP CHANGE.]**

### Iteration 3 — Implementation Correction

The confirmation logic was reviewed so that unsupported/null reservation
status is rejected before confirmation state mutation and persistence.

**Evidence placeholder:**

> **[ADD GIT DIFF OR IDE SCREENSHOT OF THE FINAL IMPLEMENTATION CHANGE.]**

### Final Targeted Test

```powershell
mvn -Dtest=ReservationServiceTest#shouldRejectConfirmationForUnsupportedReservationStatus test
```

Final result:

```text
Tests run: 1
Failures: 0
Errors: 0
Skipped: 0

BUILD SUCCESS
```

### Full Reservation Regression Test

```powershell
mvn -Dtest=ReservationServiceTest test
```

Final result:

```text
Tests run: 17
Failures: 0
Errors: 0
Skipped: 0

BUILD SUCCESS
```

### Full Maven Test Suite

```powershell
mvn test
```

Final result:

```text
Tests run: 17
Failures: 0
Errors: 0
Skipped: 0

BUILD SUCCESS
```

**Evidence placeholder — REQUIRED:**

> **[ADD FINAL TERMINAL SCREENSHOT SHOWING `mvn test` AND `BUILD SUCCESS`.]**

### Developer Intervention

AI assistance was used for analysis and suggestions. The developer retained
responsibility for:

- deciding which suggestion to apply
- editing the repository
- reviewing the Git diff
- running the tests
- interpreting failures
- confirming that existing functionality still passed
- committing the validated changes

**---**


**---

## Deliberate Red Run — Test Failure Evidence

The assessment requires evidence that the automated test suite can detect a
real regression. This section records the intentional failure → correction
→ successful regression-test sequence.

### Step 1 — Introduce a deliberate regression

A reservation-confirmation validation rule was intentionally changed so that
an unsupported reservation status was not rejected as required.

**Evidence placeholder:**

> **[ADD EVIDENCE: Screenshot or terminal capture of the deliberately
> modified code/commit. Do not expose unrelated secrets.]**

### Step 2 — Run the targeted test

```powershell
mvn -Dtest=ReservationServiceTest#shouldRejectConfirmationForUnsupportedReservationStatus test
```

Expected assessment evidence:

```text
Tests run: 1
Failures: 1
Errors: 0
Skipped: 0

BUILD FAILURE
```

**Evidence placeholder — REQUIRED:**

> **[ADD RED-RUN TERMINAL SCREENSHOT HERE]**
>
> The screenshot should clearly show:
> - the exact Maven command
> - the failing test name
> - the failure/exception
> - `Failures: 1`
> - `BUILD FAILURE`

### Step 3 — Analyze the failure

The failing test is used to identify the regression rather than treating the
test failure as a test defect.

During the actual development loop, failures included validation-order and
mock-setup issues. For example, the unsupported-status test initially reached
later confirmation logic and produced a `NullPointerException` when required
mocked values were not configured.

**Evidence placeholder:**

> **[ADD EVIDENCE: Screenshot of the relevant failure stack trace.]**

### Step 4 — Correct the implementation and/or test setup

The reservation confirmation flow and test setup were iteratively corrected
so that:

1. Reservation ownership is validated.
2. Reservation status is validated before confirmation continues.
3. Expiration is checked safely.
4. A valid reservation can be confirmed.
5. Unsupported/null reservation states are rejected with the expected
   `BusinessRuleViolationException`.
6. No unintended save/status mutation occurs when confirmation is rejected.

**Evidence placeholder:**

> **[ADD EVIDENCE: Git diff or IDE screenshot showing the final correction.]**

### Step 5 — Run the targeted test again

```powershell
mvn -Dtest=ReservationServiceTest#shouldRejectConfirmationForUnsupportedReservationStatus test
```

Final expected result:

```text
Tests run: 1
Failures: 0
Errors: 0
Skipped: 0

BUILD SUCCESS
```

**Evidence placeholder — REQUIRED:**

> **[ADD GREEN TARGETED-TEST TERMINAL SCREENSHOT HERE]**

### Step 6 — Run the complete reservation test suite

```powershell
mvn -Dtest=ReservationServiceTest test
```

Final result:

```text
Tests run: 17
Failures: 0
Errors: 0
Skipped: 0

BUILD SUCCESS
```

**Evidence placeholder — REQUIRED:**

> **[ADD RESERVATION FULL-SUITE TERMINAL SCREENSHOT HERE]**

### Step 7 — Run the complete Maven test suite

```powershell
mvn test
```

Final result:

```text
Tests run: 17
Failures: 0
Errors: 0
Skipped: 0

BUILD SUCCESS
```

**Evidence placeholder — REQUIRED:**

> **[ADD FINAL `mvn test` TERMINAL SCREENSHOT HERE]**

### RED → FIX → GREEN Summary

```text
Requirement
    ↓
AI-assisted analysis
    ↓
Test added / changed
    ↓
RED — test fails
    ↓
Read stack trace
    ↓
Identify root cause
    ↓
Correct implementation/test setup
    ↓
GREEN — targeted test passes
    ↓
Run complete reservation suite
    ↓
Run complete Maven suite
    ↓
Review git diff
    ↓
Commit validated change
```

**Evidence placeholder — recommended:**

> **[ADD ONE COLLAGE OR SEQUENCE OF RED → FIX → GREEN SCREENSHOTS HERE]**

**## AI Change Loop Principles**

The project follows these principles when using AI assistance:

**### 1. AI proposes, developer reviews**

AI-generated code is treated as a suggestion and reviewed before being used.

**### 2. Tests validate changes**

Every meaningful backend change should be validated with automated tests.

**### 3. Failures drive iteration**

When a test fails:

\`\`\`text
Failure
   ↓
Read stack trace
   ↓
Identify root cause
   ↓
Modify implementation/test
   ↓
Run targeted test
\`\`\`

**### 4. Full regression testing**

After a targeted test passes, the complete relevant test suite is executed.

**### 5. No secrets in source code**

Passwords, JWT secrets, and other sensitive configuration values remain in environment variables.

**---**

**## Git Workflow**

The project uses Git for source control.

Check repository state:

\`\`\`powershell
git status
\`\`\`

Review changes:

\`\`\`powershell
git diff
\`\`\`

Stage changes:

\`\`\`powershell
git add .
\`\`\`

Commit:

\`\`\`powershell
git commit -m "Describe the change"
\`\`\`

Push:

\`\`\`powershell
git push origin main
\`\`\`

The recommended workflow is:

\`\`\`text
Modify
  ↓
Test
  ↓
Review git diff
  ↓
git add
  ↓
git commit
  ↓
git push
\`\`\`

**---**

**## Configuration and Secrets**

Never commit values such as:

\`\`\`text
DB\_PASSWORD
JWT\_SECRET
API keys
Private credentials
\`\`\`

Use environment variables instead:

\`\`\`powershell
$env\:DB\_PASSWORD="\<your-database-password>"
$env\:JWT\_SECRET="\<your-jwt-secret>"
\`\`\`

If a \`.env\` file is used by the frontend or another component, ensure that sensitive files are included in \`.gitignore\`.

**---**


**---

## Known Limitations

The following boundaries are intentionally documented so that tested areas
are not presented as broader than the available evidence.

- The current automated test suite is focused primarily on reservation
  service business logic.
- API-level testing was performed manually during development; those manual
  results should be supported by screenshots or exported request/response
  evidence in the final assessment package.
- The current JUnit/Mockito evidence does not represent frontend test
  coverage.
- The assessment evidence focuses on the reservation workflow and its
  business rules.
- Production deployment, load testing, and large-scale concurrency testing
  are outside the scope of the current evidence unless separately captured.

**Evidence placeholder:**

> **[ADD ANY ADDITIONAL LIMITATIONS OR ASSESSMENT-SCOPE NOTES HERE.]**

**## Troubleshooting**

**### Maven command not found**

If:

\`\`\`text
mvn : The term 'mvn' is not recognized
\`\`\`

use the Maven executable available in your development environment.

**### Java version**

The project was tested with Java 21.

Verify:

\`\`\`powershell
java -version
\`\`\`

**### Port 8080 already in use**

If Spring Boot reports:

\`\`\`text
Web server failed to start. Port 8080 was already in use.
\`\`\`

identify the process:

\`\`\`powershell
netstat -ano | findstr :8080
\`\`\`

Then stop the process if appropriate.

Alternatively, change:

\`\`\`properties
server.port=8081
\`\`\`

and restart the application.

**### 403 Forbidden on \`/\`**

A \`403 Forbidden\` response from:

\`\`\`text
http\://localhost:8080
\`\`\`

can occur because Spring Security protects the endpoint.

Test an actual application API using the required authentication instead.

**### Database connection failure**

Check:

\`\`\`text
DB\_URL
DB\_USERNAME
DB\_PASSWORD
\`\`\`

and confirm that MySQL is running.

**---**

**## Verification Checklist**

\| Component | Status |
\|---|---|
\| Java 21 | ✅ |
\| Maven | ✅ |
\| Spring Boot | ✅ |
\| MySQL | ✅ |
\| Database connection | ✅ |
\| Environment variables | ✅ |
\| JWT configuration | ✅ |
\| Backend startup | ✅ |
\| REST APIs | ✅ |
\| Reservation APIs | ✅ |
\| Reservation expiration | ✅ |
\| Reservation cancellation | ✅ |
\| Stock restoration | ✅ |
\| Authorization validation | ✅ |
\| Reservation status validation | ✅ |
\| JUnit tests | ✅ |
\| Mockito tests | ✅ |
\| Reservation tests | ✅ |
\| 17/17 tests passing | ✅ |
\| AI Change Loop | ✅ |
\| Git version control | ✅ |

**---**

**## Final Validation**

Before submission, run:

\`\`\`powershell
mvn test
\`\`\`

Expected:

\`\`\`text
Tests run: 17
Failures: 0
Errors: 0
Skipped: 0

BUILD SUCCESS
\`\`\`

Then verify Git:

\`\`\`powershell
git status
\`\`\`

The preferred final state is:

\`\`\`text
nothing to commit, working tree clean
\`\`\`

**---**

**## Project Status**

SmartStock currently has:

\- A React.js frontend
\- A Spring Boot REST backend
\- MySQL persistence
\- JWT authentication
\- Role-based authorization
\- Product and stock management
\- Reservation management
\- Reservation expiration
\- Automatic stock restoration
\- Unit and business-rule tests
\- AI-assisted development workflow
\- Git-based version control

**---**


**---

## Assessment Evidence Index

Use this section as a final submission checklist. Replace each placeholder
with the actual screenshot, exported result, video timestamp, commit hash, or
document path.

### Required Evidence

| Evidence | Where to add it | Status |
|---|---|---|
| Architecture diagram | `docs/ARCHITECTURE.md` | ⬜ |
| Design/business rules | `docs/DESIGN.md` | ⬜ |
| User guide | `docs/USER_GUIDE.md` | ⬜ |
| AI prompt | This README / `docs/AI_CHANGE_LOOP.md` | ⬜ |
| AI suggested change | AI evidence section | ⬜ |
| Deliberate RED run | Red-run section | ⬜ |
| Failure stack trace | Red-run section | ⬜ |
| Code correction | Red-run section | ⬜ |
| Targeted GREEN run | Red-run section | ⬜ |
| Full 17-test GREEN run | Red-run section | ⬜ |
| Final `mvn test` | Final validation section | ⬜ |
| API testing | API testing section | ⬜ |
| Git diff | Git workflow section | ⬜ |
| Final commit | Git workflow section | ⬜ |
| Demo video | Assessment submission | ⬜ |
| Presentation deck | Assessment submission | ⬜ |

### Evidence Naming Convention

Recommended filenames:

```text
docs/
  ARCHITECTURE.md
  DESIGN.md
  USER_GUIDE.md
  AI_CHANGE_LOOP.md

evidence/
  01-architecture.png
  02-ai-prompt.png
  03-red-test-failure.png
  04-fix-diff.png
  05-targeted-test-success.png
  06-reservation-tests-17-17.png
  07-full-mvn-test-success.png
  08-api-testing.png
  09-git-status-clean.png
```

**Important:** Do not add passwords, JWT secrets, API keys, or other sensitive
credentials to screenshots or documentation.


**---

## Documentation Status

This README documents the implementation and the evidence that is currently
known from the project workflow.

Items marked **[ADD EVIDENCE]** are intentional placeholders. They should be
replaced with the actual assessment screenshots, exports, commit references,
or video timestamps before submission.

The final documentation should distinguish:

- implemented functionality
- automated test evidence
- manual API evidence
- AI-assisted development evidence
- deliberate failure evidence
- known limitations

This keeps the assessment evidence traceable and avoids claiming validation
that has not been captured.

**## Author**

**\*\*Giriprasanth M\*\***

B.Tech — Information Technology

**### SmartStock**

**\*\*Frontend:\*\*** React.js  
**\*\*Backend:\*\*** Java 21 + Spring Boot  
**\*\*Database:\*\*** MySQL  
**\*\*Security:\*\*** Spring Security + JWT  
**\*\*Testing:\*\*** JUnit 5 + Mockito  
**\*\*Build:\*\*** Maven