# Implementation Plan - Department Management Enhancements

This plan addresses the issue where the "Head of Department" field becomes blank during editing, adds a data refresh feature, and enables navigation from the department list to faculty details.

## User Review Required

> [!NOTE]
> - **Navigation**: Clicking on the Head of Department's name will redirect to the Faculty Detail page.
> - **Form Persistence**: Drodown selections will be stabilized by ensuring metadata is fully loaded before the form is rendered.

## Proposed Changes

### 1. Backend Implementation

#### [MODIFY] [DepartmentResponse.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/dto/DepartmentResponse.java)
- Add `private UUID headFacultyId;` field.

#### [MODIFY] [DepartmentServiceImpl.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/DepartmentServiceImpl.java)
- Populate `headFacultyId` in the `mapToResponse` method.

### 2. Frontend Implementation

#### [MODIFY] [DepartmentList.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/admin/DepartmentList.jsx)
- Add a **Refresh (Sync)** button in the header.
- Wrap the `headFacultyName` in a `Link` component pointing to `/portal/faculty/${dept.headFacultyId}`.
- Apply a subtle dimmer effect and progress bar during background refreshes (matching Student/Faculty lists).

#### [MODIFY] [DepartmentForm.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/admin/DepartmentForm.jsx)
- Implement `metaLoading` guard to wait for the faculty list before showing the dropdown.
- Use the `values` prop in `useForm` to ensure data from the `department` prop is applied correctly once available.
- Add a unique `key` to the `select` element to force a re-sync with the form state after metadata loads.

## Verification Plan

### Manual Verification
1. Login as **Admin**.
2. Go to **Departments**.
3. Click the **Refresh** button and verify the background sync works without flickering.
4. Click on a **Head of Department's name** and verify it navigates to the correct Faculty Detail page.
5. Click **Edit** on a department.
6. Verify that the **Head of Department** dropdown correctly shows the current head and does not reset to blank.
7. Change the head and save, then verify the change is reflected.
