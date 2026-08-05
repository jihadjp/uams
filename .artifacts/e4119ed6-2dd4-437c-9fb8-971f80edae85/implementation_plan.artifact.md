# Implementation Plan - Resolve Fee Access and Security Exception Handling

The goal is to allow Faculty/Advisors to access student fee records and ensure that any security violations return a proper `403 Forbidden` status instead of a `500 Internal Server Error`.

## User Review Required

> [!IMPORTANT]
> The role name used in the system is `FACULTY`. In the frontend, these users act as Advisors. I will grant access to the `FACULTY` role to satisfy the requirement for "ADVISOR" access.

## Proposed Changes

### Backend Enhancements

#### [MODIFY] [FeeController.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/controller/FeeController.java)
- Update `@PreAuthorize` on `/student/{studentId}` to include the `FACULTY` role.
- Update `@PreAuthorize` on the main `GET /api/fees` (which also handles `?studentId=...`) to include the `FACULTY` role.

#### [MODIFY] [GlobalExceptionHandler.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/exception/GlobalExceptionHandler.java)
- Add an `@ExceptionHandler` for `org.springframework.security.access.AccessDeniedException`.
- Ensure it returns `HttpStatus.FORBIDDEN (403)` with a clear "Access Denied" message.

#### [MODIFY] [SecurityConfig.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/security/SecurityConfig.java)
- (Optional but recommended) Add an `accessDeniedHandler` to the `SecurityFilterChain` for cases where the exception is thrown before reaching the controller (though the `GlobalExceptionHandler` usually covers method-level security).

---

## Verification Plan

### Manual Verification
1.  **Faculty Access**: Log in as a Faculty member. Try to access `GET /api/fees/student/{id}`. Verify it returns `200 OK`.
2.  **Forbidden Access**: Log in as a Student. Try to access an Admin-only endpoint (e.g., `POST /api/fees`). Verify it returns `403 Forbidden` with a JSON error body instead of a `500`.
3.  **Advisor Registration UI**: Navigate to the Advisor Registration page in the frontend and verify the fee summary loads without errors.
