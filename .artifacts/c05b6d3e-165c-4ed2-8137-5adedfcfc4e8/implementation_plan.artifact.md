# Implementation Plan - Schema Reorganization for Insertion Order

Organize the table definitions in `university_academic_management_schema.sql` to strictly follow a serial order that respects database dependencies. This ensures that a simple top-to-bottom data insertion script will not encounter foreign key violations.

## Proposed Changes

### Database Schema

#### [MODIFY] [university_academic_management_schema.sql](file:///E:/Project/DBMS/uams/backend/university_academic_management_schema.sql)
Rearrange the `CREATE TABLE` statements into the following order:

1.  **Level 1 (Independent):** `users`, `departments`, `semesters`, `guardians`, `grading_policies`, `financial_aid_circulars`.
2.  **Level 2:** `faculty` (users, depts), `programs` (depts), `courses` (depts), `academic_calendars` (semesters).
3.  **Level 3:** `batches` (programs), `calendar_events` (calendars).
4.  **Level 4:** `sections` (batches), `batch_semester_fees` (batches, semesters).
5.  **Level 5:** `students` (users, programs, faculty, batches, sections, guardians), `course_offerings` (courses, semesters, faculty, batches, sections).
6.  **Level 6:** `enrollments` (students, offerings), `exams` (offerings), `fees` (students, semesters), `notices` (users, depts), `semester_clearance` (students, semesters), `evaluations` (students, offerings), `document_requests` (students), `convocation_applications` (students), `financial_aid_applications` (students, aid circulars).
7.  **Level 7:** `attendance` (enrollments), `results` (enrollments, exams), `notice_views` (notices, users).

## Verification Plan

### Manual Verification
- Review the rearranged file to ensure all foreign keys refer to tables defined above them.
- Verify that the `ALTER TABLE departments ADD CONSTRAINT fk_department_head` remains after `faculty` to handle the circular dependency.
- Run a dry-run check of the schema creation in a local MySQL instance.
