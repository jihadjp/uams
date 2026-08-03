# Implementation Plan - Editable Convocation Application

This plan introduces an "Edit" feature for Convocation Applications, allowing students to correct mistakes (like gown size or guest count) before their application is processed by the university.

## User Review Required

> [!IMPORTANT]
> - **Editing Lock**: Students will only be able to edit their application while the status is `PENDING`. Once the status changes to `VERIFIED`, `APPROVED`, or `REJECTED`, the application is locked to ensure data consistency for logistics (e.g., gown procurement).

## Proposed Changes

### 1. Backend Implementation

#### [MODIFY] [ConvocationService.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/ConvocationService.java) & [Impl](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/ConvocationServiceImpl.java)
- Add `updateApplication(UUID id, ConvocationApplicationRequest request)` method.
- Add logic to throw an error if a student tries to edit a non-`PENDING` application.

#### [MODIFY] [ConvocationController.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/controller/ConvocationController.java)
- Add `PUT /api/convocation/{id}` endpoint for students.

### 2. Frontend Implementation

#### [MODIFY] [convocationApi.js](file:///E:/Project/DBMS/uams/frontend/src/api/convocationApi.js)
- Add `updateConvocationApplication(id, data)` function.

#### [MODIFY] [ConvocationApplication.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/student/ConvocationApplication.jsx)
- Add an **Edit (Pencil icon)** button in the "My Application" table, visible only for `PENDING` rows.
- Implement logic to load the application data back into the form for editing.
- Toggle between "Submit" and "Update" mode in the UI.

## Verification Plan

### Manual Verification
1. Login as a **Student**.
2. Submit a Convocation Application.
3. Go to "My Application" and click the **Edit** icon.
4. Change the gown size and guest count.
5. Save changes and verify the table updates correctly.
6. Login as an **Admin**, change the status to **VERIFIED**.
7. Login as a **Student** and verify that the **Edit** button is now hidden/disabled.
