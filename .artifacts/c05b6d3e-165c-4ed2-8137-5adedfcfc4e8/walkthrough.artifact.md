# Walkthrough - Seed Data Generation

I have successfully generated 20 realistic data entries for each of the 28 tables in the UAMS database.

## Changes Made

### Database Seed Data

#### [NEW] [seed_data.sql](file:///E:/Project/DBMS/uams/backend/seed_data.sql)
A comprehensive SQL script containing `INSERT` statements for all tables.

## Key Features of the Seed Data

- **Diverse Users**: Includes 10 Admins, 10 Registrars, 20 Faculty members (named after famous scientists like Turing, Hopper, Feynman), and 20 Students.
- **Academic Hierarchy**: 20 Departments (CSE, EEE, Physics, etc.), each with a Program, Batch, and Section.
- **Realistic Transactions**:
    - **Enrollments**: 20 student enrollments in various course offerings.
    - **Attendance**: Sample attendance records for the start of the semester.
    - **Exams & Results**: Midterm and Final exam definitions with corresponding student marks.
- **Financial Records**: Fee records for students with varying payment statuses.
- **Administrative Content**: 20 notices with associated view counts.
- **Applications**: Sample data for document requests, financial aid, and convocation.
- **Calendars**: Academic calendars for multiple years with specific events for the current semester.

## Integrity Checks

- **Foreign Key Safety**: The script starts with `SET FOREIGN_KEY_CHECKS = 0;` and ends with `SET FOREIGN_KEY_CHECKS = 1;` to ensure smooth execution regardless of insertion order, although the script is logically ordered.
- **UUID Consistency**: Used structured string IDs (e.g., `u-stu-001`, `fac-001`, `sem-2024-2`) to ensure easy debugging and verifiable relationships.

## How to use

1. Open your MySQL/MariaDB client.
2. Select the `uams` database.
3. Run the script: `SOURCE E:/Project/DBMS/uams/backend/seed_data.sql;`
