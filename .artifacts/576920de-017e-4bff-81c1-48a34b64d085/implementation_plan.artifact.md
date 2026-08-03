# Implementation Plan - Fix Hardcoded Dashboard Data

This plan aims to replace hardcoded/dummy values like "Batch 67" and "Campus RBC" in the Student Dashboard with real data from the database.

## User Review Required

> [!NOTE]
> - **Batch Info**: Will now be pulled directly from the student's assigned `Batch` entity.
> - **Campus Info**: Since the `Department` model currently lacks a `campus` field, I will provide a way to dynamically pass it from the backend, allowing future expansion to multiple campuses.

## Proposed Changes

### 1. Backend Implementation

#### [MODIFY] [StudentSummaryResponse.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/dto/StudentSummaryResponse.java)
- Add `batch` (String) field.
- Ensure `campus` is consistent in its usage.

#### [MODIFY] [DashboardServiceImpl.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/DashboardServiceImpl.java)
- Populate `.batch()` using `student.getBatch().getBatchNumber()`.
- Populate `.campus()` dynamically (e.g., from a config or default to "Main Campus" instead of "RBC" if not specific).

### 2. Frontend Implementation

#### [MODIFY] [Dashboard.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/student/Dashboard.jsx)
- Update the UI to use `summary.batch` and `summary.campus` instead of hardcoded strings or local storage fallbacks.

## Verification Plan

### Manual Verification
1. Login as a **Student** who belongs to a different batch (e.g., Batch 68).
2. Verify that the Dashboard now correctly displays **Batch 68**.
3. Verify that the **Campus** name matches the backend response.
