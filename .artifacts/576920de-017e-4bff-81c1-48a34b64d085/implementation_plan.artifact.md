# Implementation Plan - Visual Faculty Directory

This plan outlines the creation of a visual, institutional-grade Faculty Directory system as per the provided design specifications. It includes structural changes to group departments by "Faculty Divisions" (Schools) and detailed faculty member profiles with photos and status tracking.

## User Review Required

> [!IMPORTANT]
> - **Organizational Structure**: Departments will now be grouped into broader "Faculty Divisions" (e.g., Faculty of Science and IT, Faculty of Engineering) to match the hierarchical navigation in the screenshots.
> - **Faculty Details**: Faculty profiles will include an "Academic Status" (e.g., On Leave, Part-Time) and an "Administrative Position" (e.g., Dean, Associate Dean).
> - **Public/Common Access**: This directory will be accessible by Students and Administrators, providing a more visual way to explore the university staff compared to the existing administrative tables.

## Proposed Changes

### 1. Database & Schema

#### [MODIFY] [university_academic_management_schema.sql](file:///E:/Project/DBMS/uams/backend/university_academic_management_schema.sql)
- Add `faculty_division` VARCHAR(150) to the `departments` table.
- Add `academic_status` VARCHAR(50) and `administrative_position` VARCHAR(100) to the `faculty` table.

### 2. Backend Implementation

#### [MODIFY] Models & DTOs
- Update `Department.java` and `Faculty.java` entities.
- Update `DepartmentRequest`, `DepartmentResponse`, `FacultyRequest`, and `FacultyResponse` DTOs to include the new fields.

#### [MODIFY] Services
- Update `DepartmentServiceImpl` and `FacultyServiceImpl` to handle mapping and saving of the new attributes.
- Ensure that the faculty listing endpoint can filter by department ID to populate the department-specific grid.

### 3. Frontend Implementation

#### [NEW] [FacultyMembers.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/common/FacultyMembers.jsx)
- Implements the first design: A searchable directory grouped by Faculty Divisions.
- Each Division block contains a list of its departments as links.

#### [NEW] [DepartmentFacultyView.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/common/DepartmentFacultyView.jsx)
- Implements the second design: A visual grid of faculty members for a specific department.
- High-profile cards for Deans/Associate Deans at the top.
- Cards with photos, linked names, and status badges (e.g., "On Leave").
- Integrated pagination.

#### [MODIFY] [App.jsx](file:///E:/Project/DBMS/uams/frontend/src/App.jsx)
- Register routes for `/faculty-directory` and `/faculty-directory/dept/:id`.

#### [MODIFY] [sidebarConfig.js](file:///E:/Project/DBMS/uams/frontend/src/utils/sidebarConfig.js)
- Add "Faculty Directory" to Student and Admin menus.

#### [MODIFY] Management Forms
- Update `DepartmentForm.jsx` and `FacultyForm.jsx` to allow Admins to manage the new organizational data.

## Verification Plan

### Manual Verification
1. **Admin Setup**:
   - Edit an existing Department to assign it to a "Faculty Division" (e.g., Faculty of Engineering).
   - Edit a Faculty member to set their "Administrative Position" as "Dean" and "Academic Status" as "ACTIVE".
2. **Directory Browsing**:
   - Navigate to the **Faculty Members** directory.
   - Verify departments are correctly grouped under their divisions.
   - Search for a faculty member using the top search bar.
3. **Department Grid**:
   - Click on a department link.
   - Verify the "Dean" appears at the top.
   - Verify all faculty cards show the correct photo and designation.
   - Check if the "On Leave" badge appears correctly for relevant staff.
