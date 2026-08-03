# Implementation Plan - Secure Admin Password Reset

This plan introduces a secure way for administrators and registrars to reset passwords for students and faculty members. The system ensures privacy by not showing existing passwords and enforcing a password change upon next login.

## User Review Required

> [!IMPORTANT]
> - **Privacy**: Administrators will NOT be able to see the current password.
> - **Security**: Resetting a password will generate a random temporary password and force the user to change it when they next log in.
> - **Visibility**: The temporary password will be shown to the administrator ONLY ONCE immediately after the reset.

## Proposed Changes

### 1. Backend Implementation

#### [NEW] [PasswordResetResponse.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/dto/auth/PasswordResetResponse.java)
- DTO to return the new temporary password: `{ "temporaryPassword": "..." }`.

#### [MODIFY] [StudentResponse.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/dto/StudentResponse.java) & [FacultyResponse.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/dto/FacultyResponse.java)
- Add `userId` field to identify the underlying auth account.

#### [MODIFY] [StudentServiceImpl.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/StudentServiceImpl.java) & [FacultyServiceImpl.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/FacultyServiceImpl.java)
- Update `mapToResponse` to include the `userId` from the `User` entity.

#### [MODIFY] [AuthService.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/AuthService.java) & [Impl](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/AuthServiceImpl.java)
- Add `resetUserPassword(UUID userId)` method.
- Generate a 10-char random password using `PasswordGeneratorService`.
- Update user's `passwordHash` and set `mustChangePassword = true`.

#### [MODIFY] [AuthController.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/controller/AuthController.java)
- Add `POST /api/auth/reset-password/{userId}` endpoint.
- Restricted to `ADMIN` and `REGISTRAR`.

### 2. Frontend Implementation

#### [MODIFY] [authApi.js](file:///E:/Project/DBMS/uams/frontend/src/api/authApi.js)
- Add `resetUserPassword(userId)` function.

#### [MODIFY] [StudentDetail.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/admin/StudentDetail.jsx) & [FacultyDetail.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/admin/FacultyDetail.jsx)
- Add a **"Reset Password"** button with a key/shield icon.
- Show a confirmation modal before proceeding.
- On success, show the temporary password in a high-visibility modal with a "Copy" button.

## Verification Plan

### Manual Verification
1. Login as **Admin**.
2. Go to **Student List** -> Select a Student.
3. Click **Reset Password** -> Confirm.
4. Note the temporary password (e.g., `xyz123`).
5. Logout and try to login as that **Student** using their email and `xyz123`.
6. Verify that the system **automatically redirects** the student to the "Change Password" page.
7. Verify the student cannot navigate anywhere else until they change their password.
8. Change the password and verify the student can then access their dashboard.
9. Repeat for a **Faculty** member.
