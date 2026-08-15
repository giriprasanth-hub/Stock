# SmartStock — Terminal Commands & Execution Evidence

## 1. Navigate to the SmartStock Backend

```powershell
cd D:\giri\Downloads\Stock\backend
```

## 2. Run the ReservationService Test Suite

```powershell
& "C:\Users\girip\.vscode\extensions\oracle.oracle-java-26.0.1\nbcode\java\maven\bin\mvn.cmd" -Dtest=ReservationServiceTest test
```

Initial result:

```text
Tests run: 12
Failures: 0
Errors: 0
Skipped: 0

BUILD SUCCESS
```

## 3. Run Reservation Tests After Adding Expiration Tests

```powershell
& "C:\Users\girip\.vscode\extensions\oracle.oracle-java-26.0.1\nbcode\java\maven\bin\mvn.cmd" -Dtest=ReservationServiceTest test
```

The test run initially exposed that the required `expireReservations()` method was missing.

After implementation and correction, the expiration tests passed.

## 4. Run the Reservation Regression Suite

```powershell
& "C:\Users\girip\.vscode\extensions\oracle.oracle-java-26.0.1\nbcode\java\maven\bin\mvn.cmd" -Dtest=ReservationServiceTest test
```

Final result:

```text
Tests run: 17
Failures: 0
Errors: 0
Skipped: 0

BUILD SUCCESS
```

## 5. Run the Targeted AI Change-Loop Test

Target test:

```text
shouldRejectConfirmationForUnsupportedReservationStatus
```

Command:

```powershell
& "C:\Users\girip\.vscode\extensions\oracle.oracle-java-26.0.1\nbcode\java\maven\bin\mvn.cmd" -Dtest=ReservationServiceTest#shouldRejectConfirmationForUnsupportedReservationStatus test
```

## 6. RED Test — Initial Failure

The targeted test initially failed with:

```text
Expected:
BusinessRuleViolationException

Actual:
ResourceNotFoundException
```

Root cause:

```text
User not found: user@test.com
```

The mock setup was then corrected.

## 7. RED Test — Second Failure

After correcting the user mock, the test exposed:

```text
Expected:
BusinessRuleViolationException

Actual:
NullPointerException
```

Root cause:

```text
Reservation.getExpiresAt() returned null
```

The required expiration value was then added to the test setup.

## 8. RED Test — Third Failure

The flow progressed further and exposed another missing mock value:

```text
Reservation.getItems() returned null
```

The test setup was expanded accordingly.

## 9. Validation-Order Correction

The confirmation flow was corrected so that an unsupported or `null`
reservation status is rejected before confirmation continues.

Expected behavior:

```text
Unsupported / null status
        ↓
BusinessRuleViolationException
        ↓
No CONFIRMED state mutation
        ↓
No repository save
```

## 10. Targeted GREEN Test

Command:

```powershell
& "C:\Users\girip\.vscode\extensions\oracle.oracle-java-26.0.1\nbcode\java\maven\bin\mvn.cmd" -Dtest=ReservationServiceTest#shouldRejectConfirmationForUnsupportedReservationStatus test
```

Final result:

```text
Tests run: 1
Failures: 0
Errors: 0
Skipped: 0

BUILD SUCCESS
```

> [ADD TARGETED GREEN TEST SCREENSHOT HERE]

## 11. Run the Complete ReservationService Regression Suite

Command:

```powershell
& "C:\Users\girip\.vscode\extensions\oracle.oracle-java-26.0.1\nbcode\java\maven\bin\mvn.cmd" -Dtest=ReservationServiceTest test
```

Final result:

```text
Tests run: 17
Failures: 0
Errors: 0
Skipped: 0

BUILD SUCCESS
```

> [ADD 17/17 GREEN TEST SCREENSHOT HERE]

## 12. Run the Full Maven Test Suite

Command:

```powershell
& "C:\Users\girip\.vscode\extensions\oracle.oracle-java-26.0.1\nbcode\java\maven\bin\mvn.cmd" test
```

Final result:

```text
Tests run: 17
Failures: 0
Errors: 0
Skipped: 0

BUILD SUCCESS
```

> [ADD FINAL `mvn test` SCREENSHOT HERE]

## 13. Start the Spring Boot Application

Command:

```powershell
& "C:\Users\girip\.vscode\extensions\oracle.oracle-java-26.0.1\nbcode\java\maven\bin\mvn.cmd" spring-boot:run
```

The application successfully initialized the Spring Boot context and
established the MySQL connection.

One run reported:

```text
Web server failed to start.
Port 8080 was already in use.
```

This was a local port conflict and not a compilation or database failure.

## 14. Check the API Server

Command:

```powershell
Invoke-WebRequest http://localhost:8080
```

Observed response:

```text
403 Forbidden
```

The server was responding, while the root endpoint was protected by the
application's security configuration.

The actual application APIs were tested separately and confirmed working.

## 15. Check Git Status

From the repository root:

```powershell
cd D:\giri\Downloads\Stock
```

Then:

```powershell
git status
```

This was used to identify modified project files during development.

## 16. Review All Code Changes

```powershell
git diff
```

## 17. Review ReservationService Changes

```powershell
git diff -- src/main/java/com/smartstock/service/ReservationService.java
```

## 18. Review ReservationServiceTest Changes

```powershell
git diff -- src/test/java/com/smartstock/service/ReservationServiceTest.java
```

For a larger diff:

```powershell
git diff --unified=100 -- src/test/java/com/smartstock/service/ReservationServiceTest.java
```

> [ADD CODE DIFF SCREENSHOT HERE]

## 19. Check Final Git State

```powershell
git status
```

Final state:

```text
On branch main
Your branch is ahead of 'origin/main' by 1 commit.

nothing to commit, working tree clean
```

## 20. View Git Commit History

```powershell
git log --oneline -5
```

Final commit history:

```text
36017c9 Add SmartStock project documentation
7ea0a03 Add reservation validation and expiration tests
5909587 baseline: 16 reservation tests passing
1bb9703 Initial SmartStock application
```

> [ADD GIT LOG / COMMIT SCREENSHOT HERE]

## 21. Repository Structure Evidence

From the repository root:

```powershell
cd D:\giri\Downloads\Stock
tree /F
```

Backend structure:

```powershell
tree backend /F
```

Frontend structure:

```powershell
tree frontend /F
```

> [ADD REPOSITORY STRUCTURE SCREENSHOT HERE]

## 22. Environment Variables

The application uses environment variables for database and JWT
configuration.

Example local configuration:

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/smartstock_db"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="<your-local-password>"
$env:JWT_SECRET="<your-JWT-secret>"
```

> IMPORTANT: Never include the actual database password or JWT secret in
> screenshots, README files, Git commits, or public repositories.

# 23. Evidence Timeline

```text
[AI Prompt]
      ↓
[AI Suggestion]
      ↓
[Test / Code Change]
      ↓
[RED Test]
      ↓
[Root-Cause Analysis]
      ↓
[Correction]
      ↓
[Targeted GREEN — 1/1]
      ↓
[Reservation Regression — 17/17]
      ↓
[Full Maven Suite — 17/17]
      ↓
[Git Diff Review]
      ↓
[Git Status]
      ↓
[Git Commit]
```

# 24. Important Evidence Screenshots

| Evidence | Command / Source |
|---|---|
| AI Prompt | Actual AI conversation |
| RED Failure | Targeted reservation test |
| Code Correction | `git diff` |
| Targeted GREEN | `ReservationServiceTest#shouldRejectConfirmationForUnsupportedReservationStatus` |
| Regression GREEN | `ReservationServiceTest` — 17/17 |
| Final GREEN | `mvn test` — 17/17 |
| Architecture | SmartStock architecture diagram |
| API Flow | SmartStock API flow diagram |
| Repository Structure | `tree /F` |
| Business Rules | Reservation tests + implementation |
| Git Evidence | `git status` / `git log --oneline -5` |

# 25. Final Validation Summary

The final SmartStock validation completed successfully.

```text
Targeted Test
Tests run: 1
Failures: 0
Errors: 0
Skipped: 0
BUILD SUCCESS
```

```text
ReservationServiceTest
Tests run: 17
Failures: 0
Errors: 0
Skipped: 0
BUILD SUCCESS
```

```text
Full Maven Test Suite
Tests run: 17
Failures: 0
Errors: 0
Skipped: 0
BUILD SUCCESS
```

The final Git working tree was clean and the validated changes were committed
to the repository.
