# Implementation Plan - Fix Form Selection Persistence

This plan fixes the issue where dropdown selections (Program, Batch, Advisor) are lost or reset to blank when editing a student's profile.

## User Review Required

> [!NOTE]
> - **Form Loading State**: The form will now show a small spinner or wait to render until programs and faculties are loaded. This prevents the dropdowns from defaulting to "Select" before options are available.
> - **Dynamic Batch Loading**: When editing, the system will automatically fetch the batches for the student's program and set the correct selection once the data arrives.

## Proposed Changes

### 1. Frontend Enhancements

#### [MODIFY] [StudentForm.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/admin/StudentForm.jsx)
- **Remove Duplicate Fields**: Fix the bug where `advisorId` was registered twice in the form logic.
- **Loading Guards**: Add a local `metaLoading` state. Don't render selection options until metadata is ready.
- **Force Re-render**: Use unique `key` props (e.g., `key={programs.length}`) on select elements so they re-sync with `react-hook-form` once the data is loaded.
- **Batch Sync**: Ensure that when `batches` are fetched, the `batchId` is re-applied to the form to ensure it matches one of the new options.
- **Status Sync**: Fix the `status` field mapping to ensure it correctly shows "ACTIVE", "DROPPED", etc.

## Verification Plan

### Manual Verification
1. Login as **Admin**.
2. Go to **Student Details** -> Click **Edit Profile**.
3. Verify that the **Program**, **Batch**, and **Advisor** fields correctly show the student's current values.
4. Change the **Program**.
5. Verify that the **Batch** list updates and the previous selection is cleared (since it belongs to a different program).
6. Change the **Advisor**.
7. Save and verify that all selections are correctly persisted in the database and reflected in the details view.
