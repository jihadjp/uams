# Implementation Plan - Financial Aid & Scholarship System

This plan outlines the implementation of a comprehensive Financial Aid, Circular, and Scholarship Management system. It will allow the university to publish aid opportunities, students to apply for them, and track their active waivers.

## User Review Required

> [!IMPORTANT]
> - **Types of Aid**: The system will support both Fixed Amount and Percentage-based waivers (e.g., 50% tuition waiver).
> - **Verification Workflow**: Applications will go through a multi-stage review: `PENDING` -> `REVIEWING` -> `APPROVED` or `REJECTED`.
> - **Waiver Persistence**: Once an application is approved, the waiver record is created and will be visible in the "Scholarship & Waiver" dashboard.

## Proposed Changes

### 1. Database & Schema

#### [MODIFY] [university_academic_management_schema.sql](file:///E:/Project/DBMS/uams/backend/university_academic_management_schema.sql)
- **Table: `financial_aid_circulars`**: Stores published opportunities (Title, description, criteria, deadline, amount/percent).
- **Table: `financial_aid_applications`**: Tracks student applications (student_id, circular_id, justification, status, attached_docs placeholder).

### 2. Backend Implementation

#### [NEW] [Financial Aid Models & Enums](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/model/)
- `FinancialAidCircular.java`: Entity for aid postings.
- `FinancialAidApplication.java`: Entity for tracking student requests.
- `ApplicationStatus.java` (Enum): PENDING, REVIEWING, APPROVED, REJECTED.

#### [NEW] [Financial Aid DTOs](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/dto/)
- `FinancialAidCircularResponse`: Detailed circular info.
- `FinancialAidApplicationRequest`: For student submission.
- `FinancialAidApplicationResponse`: Status tracking for students.

#### [NEW] [Financial Aid API Infrastructure](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/)
- `FinancialAidRepository.java` & `FinancialAidApplicationRepository.java`.
- `FinancialAidService.java` & `ServiceImpl.java`.
- `FinancialAidController.java`: Endpoints for students and admins.

### 3. Frontend Implementation

#### [NEW] [financialAidApi.js](file:///E:/Project/DBMS/uams/frontend/src/api/financialAidApi.js)
- API wrapper for circulars and applications.

#### [NEW] [FinancialAidCircular.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/student/FinancialAidCircular.jsx)
- A professional list view of all active circulars with "Apply Now" buttons.
- High-fidelity cards showing deadline, criteria, and benefits.

#### [NEW] [FinancialAidApplication.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/student/FinancialAidApplication.jsx)
- A formal application form where students can select a circular, provide justification, and state their financial background.

#### [NEW] [ScholarshipWaiver.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/student/ScholarshipWaiver.jsx)
- A dashboard showing:
    - **Active Waivers**: Current semester benefits.
    - **Application History**: List of past applications with their statuses.

#### [NEW] [FinancialAidManagement.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/admin/FinancialAidManagement.jsx)
- Admin portal to create circulars and review/approve student applications.

#### [MODIFY] [App.jsx](file:///E:/Project/DBMS/uams/frontend/src/App.jsx)
- Register routes for all new pages.

## Verification Plan

### Manual Verification
1. Login as **Admin**.
2. Create a new "Financial Aid Circular" for "Summer 2026 Need-based Scholarship".
3. Login as **Student**.
4. View the circular in the **Financial Aid Circular** page.
5. Click "Apply" and fill out the **Financial Aid Application** form.
6. Check the **Scholarship & Waiver** page to see the status as "PENDING".
7. Login as **Admin**, find the application, and mark as "APPROVED" with 50% waiver.
8. Switch back to **Student** and verify the status is "APPROVED" and visible in "Active Waivers".
9. Verify the waiver is reflected in the **Fees** (Payment Ledger) if applicable (Optional/Future integration).
