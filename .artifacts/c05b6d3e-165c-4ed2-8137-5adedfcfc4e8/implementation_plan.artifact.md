# Implementation Plan - Seed Data Generation

Generate 20 realistic sample data entries for each table in the `uams` database to facilitate testing and development.

## Proposed Changes

### Database Seed Data

#### [NEW] [seed_data.sql](file:///E:/Project/DBMS/uams/backend/seed_data.sql)
Create a new SQL script containing `INSERT` statements for 20 rows per table, following the correct dependency order to maintain referential integrity.

## Data Generation Strategy

1.  **Users**: Create a mix of Admin, Faculty, Student, and Registrar roles.
2.  **Departments**: 20 departments with unique names and codes.
3.  **Faculty**: Linked to users and departments.
4.  **Programs**: Linked to departments.
5.  **Batches & Sections**: Standard academic groupings.
6.  **Students**: Linked to users, programs, batches, and guardians.
7.  **Courses**: Academic curriculum entries.
8.  **Semesters**: Time-based academic cycles.
9.  **Enrollments, Attendance, Exams, Results**: Transactional academic data.
10. **Financials & Administrative**: Fees, notices, aid, etc.

## Verification Plan

### Manual Verification
- Execute the script in a MySQL/MariaDB environment to ensure no foreign key violations or data type mismatches occur.
- Verify that the data looks "realistic" (e.g., proper names, emails, dates).
