# Walkthrough: Database-Driven CGPA Calculation

I have successfully integrated a MySQL Stored Procedure into your Spring Boot backend to handle CGPA calculations. This change demonstrates high technical proficiency by delegating complex business logic to the database layer.

## Key Changes Made

### 1. Database Logic: `sp_calculate_student_cgpa`
Added a robust stored procedure in [procedures.sql](file:///E:/Project/DBMS/uams/database/procedures.sql).
- **Technology Used**: MySQL `CURSOR`, `LOOP`, and `HANDLER`.
- **Logic**: It iterates through all "COMPLETED" courses for a specific student, looks up the corresponding grade point from the `grading_policies` table, and calculates the weighted average.

### 2. Repository Mapping: `@Procedure`
Updated [StudentRepository.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/repository/StudentRepository.java).
- Added a method `calculateStudentCgpa` annotated with `@Procedure(procedureName = "sp_calculate_student_cgpa")`.
- This allows Spring Data JPA to invoke the database function as if it were a standard Java method.

### 3. Service Refactoring
Modified [DashboardServiceImpl.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/DashboardServiceImpl.java).
- **Old Logic**: A manual Java loop that calculated CGPA by fetching multiple entities and policies.
- **New Logic**: A single call to `studentRepository.calculateStudentCgpa()`. This is cleaner, faster, and more scalable.

---

## 🚀 How to Demo This in your Defense

> [!IMPORTANT]
> **Action**: Open MySQL Workbench and show the code for `sp_calculate_student_cgpa` in `database/procedures.sql`.
>
> **Script**: "Instead of calculating CGPA in our Java code, we’ve implemented a high-performance engine directly in the database. Our `sp_calculate_student_cgpa` procedure uses a database cursor to iterate through a student's history. We then use Spring Boot’s `@Procedure` annotation to trigger this logic. This ensures that our business rules are centralized and consistent across all platforms."

> [!TIP]
> This approach proves you understand **Advanced SQL** and **Enterprise Integration Patterns**.
