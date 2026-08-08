# Implementation Plan: Integrating Stored Procedures with Spring Data JPA

This plan describes how to move the CGPA calculation logic from the Java service layer into the MySQL database using a Stored Procedure and then invoking it using the Spring Data JPA `@Procedure` annotation.

## User Review Required

> [!IMPORTANT]
> This change moves business logic from the Java code to the Database. While this is great for DBMS labs to show technical depth, it makes the code dependent on the stored procedure being correctly created in the MySQL database.

## Proposed Changes

### [Database]
#### [MODIFY] [procedures.sql](file:///E:/Project/DBMS/uams/database/procedures.sql)
- Add the `sp_calculate_student_cgpa` procedure. This procedure uses a `CURSOR` to calculate the cumulative GPA based on a student's completed courses and the university's grading policies.

### [Backend - Repository]
#### [MODIFY] [StudentRepository.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/repository/StudentRepository.java)
- Add a method annotated with `@Procedure` to map to the database's `sp_calculate_student_cgpa`.

### [Backend - Service]
#### [MODIFY] [DashboardServiceImpl.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/DashboardServiceImpl.java)
- Remove the Java-based CGPA calculation loop.
- Replace it with a call to the new `StudentRepository` procedure method.

## Verification Plan

### Automated Verification
- I will check that the Java code compiles.
- I will verify the SQL syntax for the new procedure.

### Manual Verification
1. **Database Setup**: Run the updated `procedures.sql` in MySQL Workbench to create the `sp_calculate_student_cgpa` procedure.
2. **Dashboard Test**: Log in as a student in the React UI and verify that the CGPA is still calculated and displayed correctly on the dashboard.
