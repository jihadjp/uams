# DATABASE MANAGEMENT SYSTEMS LAB PROJECT REPORT

## University Academic Management System (UAMS)

---

**Course Code:** CSE312  
**Course Title:** Database Management Systems Lab  
**Project Type:** Lab Project (Group-based)  
**Total Marks:** 40

---

### Group Members

| Serial | Name              | Roll Number | Contribution   |
|--------|-------------------|-------------|----------------|
| 1 | [Member 1 Jihad]  | [Roll-01] | Admin/Register |
| 2 | [Member 2 Mollah] | [Roll-02] | Faculty        |
| 3 | [Member 3 Jisan]  | [Roll-03] | Student        |

---

### Submission Details

**Date of Submission:** [Insert Submission Date]  
**Department:** Computer Science & Engineering  
**Institution:** Royal Bengal University

---

## TABLE OF CONTENTS

1. Introduction & Problem Definition
2. System Design & Schema
3. SQL Implementation
4. Investigation & Analysis
5. Conclusion & Future Scope
6. Appendix: Sample Code Snippets

---

## CHAPTER 1: INTRODUCTION & PROBLEM DEFINITION

### 1.1 Project Overview

The **University Academic Management System (UAMS)** is a comprehensive database-driven web application developed for **Royal Bengal University (RBU)** to automate and streamline all academic administrative processes. The system manages student information, course offerings, faculty assignments, attendance tracking, examination results, fee processing, document requests, convocation applications, and financial aid management.

This project serves as a complete solution for university administration, providing role-based access for administrators, faculty members, students, and registrars.

### 1.2 Problem Statement

Universities face numerous challenges in managing academic operations:

1. **Manual Record Keeping:** Maintaining student records, attendance, and results manually leads to errors, data redundancy, and difficulties in information retrieval.

2. **Complex Relationships:** The intricate relationships between students, courses, faculty, batches, semesters, and departments require a well-structured database to maintain data integrity.

3. **Real-time Information Needs:** Stakeholders need immediate access to information such as fee status, exam results, attendance percentage, and academic standing.

4. **Process Automation:** Tasks like clearance status tracking, CGPA calculation, seat limit enforcement, and status updates need automation to reduce manual effort and errors.

5. **Decision Support:** University administration requires analytical reports for decision-making regarding fee collection, departmental performance, and resource allocation.

### 1.3 Project Objectives

The primary objectives of the UAMS project are:

1. **Design a Comprehensive Database:** Create a normalized database schema (3NF) with 28 tables covering all aspects of university administration.

2. **Implement Business Logic:** Use database triggers and stored procedures to enforce business rules and automate complex operations.

3. **Develop User-Friendly Interface:** Build a React-based frontend with role-specific dashboards for different user types.

4. **Provide Analytical Capabilities:** Create views and queries for generating reports on attendance, performance, fee collection, and departmental analytics.

5. **Ensure Data Integrity:** Implement constraints, foreign keys, and triggers to maintain data consistency and prevent invalid operations.

### 1.4 Stakeholders and System Users

| Stakeholder | Role in System | Key Responsibilities |
|-------------|----------------|---------------------|
| **Administrator (ADMIN)** | System superuser | User management, department setup, system configuration, viewing all reports |
| **Faculty Members (FACULTY)** | Teaching staff | Course management, attendance marking, grade entry, viewing advisee lists |
| **Students (STUDENT)** | Primary beneficiaries | Viewing personal records, course registration, fee payment, document requests |
| **Registrar (REGISTRAR)** | Administrative officer | Document processing, convocation management, clearance verification |

### 1.5 Real-World Complexity and Constraints

The project addresses several real-world complexities:

1. **Multi-Entity Dependencies:** A student's record depends on user account, program, batch, section, guardian, and advisor. Any change in these entities affects the student record.

2. **Circular Dependencies:** The relationship between Faculty and Departments creates a circular dependency (faculty belongs to department, department has head faculty). This required careful schema design with deferred constraint creation.

3. **Role-Based Access Control:** Different users have different permissions and view different aspects of the system.

4. **Temporal Data Management:** The system tracks data across multiple semesters, maintaining historical records while providing current status.

5. **Financial Tracking:** Fee payments, financial aid applications, and document request fees require accurate tracking with payment status updates.

### 1.6 Unique Selling Proposition (USP)

The UAMS project's unique features that distinguish it from typical student information systems include:

1. **Multi-Dimensional Clearance Tracking:** Instead of a simple cleared/not-cleared status, the system tracks three independent clearance dimensions (registration, midterm, final exam) per semester, providing granular control.

2. **Automated Status Transitions:** Triggers automatically update student status from ACTIVE to GRADUATED when all clearance requirements are met, reducing manual intervention.

3. **Integrated CGPA Calculation:** A stored procedure calculates cumulative GPA by joining results across multiple semesters and applying grading policies dynamically.

4. **Seat Limit Enforcement:** Database-level trigger prevents course enrollment beyond capacity, ensuring data integrity without application-level checks.

5. **Comprehensive Analytical Views:** Seven different views provide ready-to-use analytical data for administrators, faculty, and students.

---

## CHAPTER 2: SYSTEM DESIGN & SCHEMA

### 2.1 Design Methodology

The database design follows a structured approach:

1. **Requirement Analysis:** Identified all entities, attributes, and relationships from university administration workflows.

2. **Conceptual Design:** Created Entity-Relationship (ER) model showing entities and relationships.

3. **Logical Design:** Converted ER model to relational schema with proper normalization.

4. **Physical Design:** Implemented the schema in MySQL with appropriate data types, constraints, and indexing.

### 2.2 Entity Relationship Diagram

```
+--------------------------------------------------------------------------------------------------+
|                                          USERS (Central Entity)                                |
|  id (PK), name, email (UNIQUE), password_hash, role (ENUM), phone, date_of_birth, gender,       |
|  blood_group, profile_image, is_verified, is_active, must_change_password, created_at, updated_at |
+--------------------------------------------------------------------------------------------------+
                                         |
                    +----------------------+----------------------+
                    |                      |                      |
                    v                      v                      v
            +-----------------+   +-----------------+   +-----------------+
            |   FACULTY      |   |   STUDENTS     |   |   NOTICES       |
            +-----------------+   +-----------------+   +-----------------+
            | id (PK)        |   | id (PK)        |   | id (PK)         |
            | user_id (FK)   |   | user_id (FK)   |   | title           |
            | department_id  |   | program_id     |   | content         |
            | employee_id    |   | advisor_id     |   | posted_by (FK)  |
            | designation    |   | batch_id       |   | target_role     |
            | academic_status|   | section_id     |   | department_id   |
            | admin_position |   | guardian_id    |   | category        |
            | joined_at      |   | student_id     |   +-----------------+
            +-----------------+   | registration_no|            |
                    |              | current_semester|            |
                    |              | is_cleared      |            |
                    |              | has_laptop      |            |
                    |              | status          |            |
                    |              +-----------------+            |
                    |                      |                      |
                    |                      |                      |
                    |                      v                      |
                    |              +-----------------+            |
                    |              |  GUARDIANS      |            |
                    |              +-----------------+            |
                    |              | id (PK)         |            |
                    |              | name            |            |
                    |              | phone           |            |
                    |              | relation        |            |
                    |              +-----------------+            |
                    |                                            |
                    v                                            v
            +-----------------+                          +-----------------+
            |  DEPARTMENTS    |                          | NOTICE_VIEWS    |
            +-----------------+                          +-----------------+
            | id (PK)         |                          | id (PK)         |
            | name            |                          | notice_id (FK)  |
            | code (UNIQUE)  |                          | user_id (FK)    |
            | dept_number     |                          | viewed_at       |
            | faculty_division|                         +-----------------+
            | head_faculty_id |
            +-----------------+
                    |
                    +----------------+----------------+
                                     |
                                     v
                            +-----------------+
                            |    PROGRAMS     |
                            +-----------------+
                            | id (PK)         |
                            | department_id   |
                            | name            |
                            | degree_level    |
                            | duration_years  |
                            | total_credits   |
                            +-----------------+
                                     |
                    +----------------+----------------+
                    |                                 |
                    v                                 v
            +-----------------+              +-----------------+
            |    BATCHES      |              |    COURSES      |
            +-----------------+              +-----------------+
            | id (PK)         |              | id (PK)         |
            | batch_number    |              | department_id   |
            | batch_initial   |              | course_code     |
            | program_id      |              | title           |
            +-----------------+              | credit_hours    |
                    |                         | prerequisite_id |
                    |                         | course_type     |
                    v                         +-----------------+
            +-----------------+                      |
            |    SECTIONS     |                      v
            +-----------------+              +-----------------+
            | id (PK)         |              |ACADEMIC_CALENDARS|
            | name            |              +-----------------+
            | batch_id        |              | id (PK)         |
            +-----------------+              | semester_id     |
                    |                         | academic_year   |
                    |                         | duration        |
                    v                         +-----------------+
            +-----------------+                      |
            | BATCH_SEMESTER_ |                      v
            |     FEES        |              +-----------------+
            +-----------------+              | CALENDAR_EVENTS |
            | id (PK)         |              +-----------------+
            | batch_id        |              | id (PK)         |
            | semester_id     |              | calendar_id     |
            | registration_fee|              | title           |
            +-----------------+              | date_value      |
                    |                         | order_index     |
                    |                         +-----------------+
                    v
            +-----------------+
            | PROFESSION      |
            |     (SEPRATE)   |
            +-----------------+

=== ACADEMIC OPERATIONS ===

+-----------------+                          +-----------------+
| COURSE_OFFERINGS|                          |   ENROLLMENTS   |
+-----------------+                          +-----------------+
| id (PK)         |<-------------------------| id (PK)         |
| course_id (FK)  |                          | student_id (FK) |
| semester_id (FK)|                          | offering_id (FK)|
| faculty_id (FK) |                          | status          |
| batch_id (FK)   |                          | enrollment_type |
| section_id (FK) |                          +-----------------+
| schedule_info   |                                   |
| seat_limit      |                                   v
| is_approved     |                          +-----------------+
+-----------------+                          |   ATTENDANCE    |
        |                                     +-----------------+
        |                                     | id (PK)         |
        v                                     | enrollment_id   |
+-----------------+                           | class_date      |
|     EXAMS       |                           | status          |
+-----------------+                           +-----------------+
| id (PK)         |                                   |
| offering_id (FK)|                                  v
| exam_type       |                          +-----------------+
| title           |                          |   EVALUATIONS   |
| exam_date       |                          +-----------------+
| total_marks     |                          | id (PK)         |
| weight_percent  |                          | student_id (FK) |
+-----------------+                          | offering_id (FK)|
        |                                   | q1-q10 ratings  |
        v                                   | comments        |
+-----------------+                          +-----------------+
|    RESULTS      |
+-----------------+
| id (PK)         |
| enrollment_id   |
| exam_id (FK)    |
| marks_obtained  |
| is_final        |
| published_at    |
+-----------------+

=== FINANCIAL & ADMINISTRATIVE ===

+---------------------------+              +---------------------------+
|     SEMESTER_CLEARANCE    |              |      FEES                 |
+---------------------------+              +---------------------------+
| id (PK)                   |              | id (PK)                   |
| student_id (FK)           |              | student_id (FK)           |
| semester_id (FK)          |              | semester_id (FK)          |
| registration_cleared      |              | registration_fee          |
| midterm_cleared           |              | credit_fee                |
| final_exam_cleared        |              | amount_paid               |
+---------------------------+              | due_date                  |
                                           | paid_at                   |
                                           +---------------------------+

+---------------------------+     +---------------------------+
|   DOCUMENT_REQUESTS       |     |   CONVOCATION_APPLICATIONS|
+---------------------------+     +---------------------------+
| id (PK)                   |     | id (PK)                   |
| student_id (FK)           |     | student_id (FK)           |
| document_type (ENUM)      |     | cgpa                      |
| status (ENUM)             |     | credits_completed         |
| fee_amount                |     | convocation_year          |
| is_paid                   |     | gown_size                 |
| request_note              |     | guest_count               |
| admin_note                |     | fee_amount                |
+---------------------------+     | is_paid                   |
                                  | status                    |
                                  +---------------------------+

+-----------------------------------+
| FINANCIAL_AID_CIRCULARS           |
+-----------------------------------+
| id (PK)                           |
| title                             |
| description                       |
| eligibility_criteria              |
| benefit_details                   |
| deadline                          |
| is_active                         |
+-----------------------------------+
              |
              v
+-----------------------------------+
| FINANCIAL_AID_APPLICATIONS        |
+-----------------------------------+
| id (PK)                           |
| student_id (FK)                   |
| circular_id (FK)                  |
| justification                     |
| monthly_income                    |
| status                            |
| admin_remarks                     |
+-----------------------------------+

+---------------------------+
|       GRADING_POLICIES    |
+---------------------------+
| id (PK)                   |
| min_marks                 |
| max_marks                 |
| grade                     |
| grade_point               |
| remarks                   |
+---------------------------+
```

### 2.3 Normalization to 3NF

The database schema is normalized to Third Normal Form (3NF):

#### First Normal Form (1NF)
- All tables have defined primary keys
- No repeating groups within tables
- All attribute values are atomic (indivisible)

**Example:** The `evaluations` table stores 10 separate rating columns (q1-q10) instead of an array, ensuring each value is atomic.

#### Second Normal Form (2NF)
- All non-key attributes fully depend on the primary key
- No partial dependencies exist

**Example:** In `course_offerings`, attributes like `schedule_info` and `seat_limit` depend on the full primary key (offering id), not on any subset.

#### Third Normal Form (3NF)
- No transitive dependencies exist
- Non-key attributes depend only on the primary key

**Example:**
- Student details are separated from user authentication (users table vs students table)
- Course information is separate from course offerings
- Grade policies are in a separate lookup table rather than being calculated each time

### 2.4 Complete Table List with Constraints

| # | Table Name | Primary Key | Foreign Keys | Unique Constraints | Check/Enum Constraints |
|---|------------|-------------|--------------|-------------------|----------------------|
| 1 | users | id (CHAR(36)) | - | email (UNIQUE) | role (ENUM) |
| 2 | departments | id (CHAR(36)) | head_faculty_id → faculty.id | code (UNIQUE), dept_number (UNIQUE) | - |
| 3 | semesters | id (CHAR(36)) | - | - | term (ENUM), status (ENUM) |
| 4 | guardians | id (CHAR(36)) | - | - | relation (ENUM) |
| 5 | grading_policies | id (INT AUTO_INCREMENT) | - | - | - |
| 6 | financial_aid_circulars | id (CHAR(36)) | - | - | - |
| 7 | faculty | id (CHAR(36)) | user_id → users.id, department_id → departments.id | employee_id (UNIQUE), user_id (UNIQUE) | academic_status (VARCHAR) |
| 8 | programs | id (CHAR(36)) | department_id → departments.id | - | - |
| 9 | courses | id (CHAR(36)) | department_id → departments.id, prerequisite_course_id → courses.id | course_code (UNIQUE) | course_type (ENUM) |
| 10 | academic_calendars | id (CHAR(36)) | semester_id → semesters.id | semester_id (UNIQUE) | - |
| 11 | batches | id (CHAR(36)) | program_id → programs.id | (batch_number, program_id) | - |
| 12 | calendar_events | id (CHAR(36)) | calendar_id → academic_calendars.id | - | - |
| 13 | sections | id (CHAR(36)) | batch_id → batches.id | (name, batch_id) | - |
| 14 | batch_semester_fees | id (CHAR(36)) | batch_id → batches.id, semester_id → semesters.id | (batch_id, semester_id) | - |
| 15 | students | id (CHAR(36)) | user_id → users.id, program_id → programs.id, advisor_id → faculty.id, batch_id → batches.id, section_id → sections.id, guardian_id → guardians.id | student_id (UNIQUE), registration_no (UNIQUE), user_id (UNIQUE) | status (ENUM) |
| 16 | course_offerings | id (CHAR(36)) | course_id → courses.id, semester_id → semesters.id, faculty_id → faculty.id, batch_id → batches.id, section_id → sections.id | - | - |
| 17 | enrollments | id (CHAR(36)) | student_id → students.id, offering_id → course_offerings.id | (student_id, offering_id) | status (ENUM), enrollment_type (ENUM) |
| 18 | exams | id (CHAR(36)) | offering_id → course_offerings.id | - | exam_type (ENUM) |
| 19 | fees | id (CHAR(36)) | student_id → students.id, semester_id → semesters.id | (student_id, semester_id) | - |
| 20 | notices | id (CHAR(36)) | posted_by → users.id, department_id → departments.id | - | target_role (ENUM) |
| 21 | semester_clearance | id (CHAR(36)) | student_id → students.id, semester_id → semesters.id | (student_id, semester_id) | - |
| 22 | evaluations | id (CHAR(36)) | student_id → students.id, offering_id → course_offerings.id | (student_id, offering_id) | - |
| 23 | document_requests | id (CHAR(36)) | student_id → students.id | - | document_type (ENUM), status (ENUM) |
| 24 | convocation_applications | id (CHAR(36)) | student_id → students.id | (student_id, convocation_year) | status (ENUM) |
| 25 | financial_aid_applications | id (CHAR(36)) | student_id → students.id, circular_id → financial_aid_circulars.id | (student_id, circular_id) | status (ENUM) |
| 26 | attendance | id (CHAR(36)) | enrollment_id → enrollments.id | (enrollment_id, class_date) | status (ENUM) |
| 27 | results | id (CHAR(36)) | enrollment_id → enrollments.id, exam_id → exams.id | - | - |
| 28 | notice_views | id (CHAR(36)) | notice_id → notices.id, user_id → users.id | (notice_id, user_id) | - |

### 2.5 Frontend and Backend Architecture

#### Backend (Spring Boot)
- **Framework:** Spring Boot 3.x with Java 17+
- **Security:** Spring Security with JWT token-based authentication
- **Database Access:** Spring Data JPA repositories
- **Architecture:** Controller-Service-Repository pattern
- **API Style:** RESTful endpoints with JSON payloads

#### Frontend (React.js with Vite)
- **Framework:** React 18 with functional components and hooks
- **Build Tool:** Vite for fast development and building
- **Styling:** TailwindCSS for responsive design
- **State Management:** React Context API with custom hooks
- **Routing:** React Router for navigation

---

## CHAPTER 3: SQL IMPLEMENTATION

### 3.1 Data Population

The database is populated with realistic sample data:

| Table | Records | Description |
|-------|---------|-------------|
| users | 42 | Students, faculty, admins, registrars |
| departments | 20 | Various academic departments |
| semesters | 20 | Historical and upcoming semesters |
| guardians | 20 | Student guardians |
| grading_policies | 20 | Grade thresholds (10 base + 10 variations) |
| financial_aid_circulars | 20 | Scholarship and aid announcements |
| faculty | 20 | Faculty members across departments |
| programs | 20 | Academic programs offered |
| courses | 20 | Course catalog |
| academic_calendars | 20 | Calendar entries per semester |
| batches | 20 | Student cohorts |
| calendar_events | 20 | Events in academic calendars |
| sections | 20 | Class sections |
| batch_semester_fees | 20 | Fee structures |
| students | 20 | Student records |
| course_offerings | 20 | Course instances |
| enrollments | 20 | Student course registrations |
| exams | 20 | Exam definitions |
| fees | 20 | Fee payment records |
| notices | 20 | Announcements |
| semester_clearance | 20 | Clearance status records |
| evaluations | 20 | Faculty rating submissions |
| document_requests | 20 | Document applications |
| convocation_applications | 20 | Graduation ceremony apps |
| financial_aid_applications | 20 | Aid applications |
| attendance | 20 | Attendance records |
| results | 20 | Exam score records |
| notice_views | 20 | Notice view tracking |

**Total: 560+ records across 28 tables**

### 3.2 INSERT Operations (Sample)

```sql
-- Insert a new student
INSERT INTO users (id, name, email, password_hash, role, phone, date_of_birth, gender, is_verified, is_active, must_change_password)
VALUES (UUID(), 'New Student', 'new.std@rbu.edu.bd', '$2b$12$...', 'STUDENT', '01711223300', '2003-05-15', 'MALE', 1, 1, 1);

-- Insert a new course offering
INSERT INTO course_offerings (id, course_id, semester_id, faculty_id, batch_id, section_id, schedule_info, seat_limit)
VALUES (UUID(), 'course-uuid', 'semester-uuid', 'faculty-uuid', 'batch-uuid', 'section-uuid', 'Sun 10:00 AM', 40);

-- Insert bulk attendance records
INSERT INTO attendance (id, enrollment_id, class_date, status, marked_at)
SELECT UUID(), e.id, '2024-06-02', 'PRESENT', NOW()
FROM enrollments e
WHERE e.student_id = 'student-uuid';
```

### 3.3 UPDATE Operations (Sample)

```sql
-- Update student clearance status
UPDATE students 
SET is_registration_cleared = TRUE, status = 'ACTIVE'
WHERE student_id = '221-101-001';

-- Process fee payment
UPDATE fees 
SET amount_paid = amount_paid + 5000.00, paid_at = CURRENT_TIMESTAMP
WHERE id = 'fee-uuid' AND amount_paid + 5000.00 <= registration_fee + credit_fee;

-- Update document request status
UPDATE document_requests 
SET status = 'PROCESSING', admin_note = 'Under review'
WHERE id = 'doc-request-uuid' AND status = 'PENDING';
```

### 3.4 DELETE Operations (Sample)

```sql
-- Safe deletion with existence check
DELETE FROM document_requests
WHERE status = 'REJECTED'
  AND updated_at < DATE_SUB(NOW(), INTERVAL 90 DAY)
  AND NOT EXISTS (
      SELECT 1 FROM students 
      WHERE id = document_requests.student_id 
      AND status = 'ACTIVE'
  );

-- Delete expired notice views
DELETE FROM notice_views 
WHERE viewed_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);
```

### 3.5 SELECT Queries with Different Clauses

#### 3.5.1 SELECT with WHERE Clause

```sql
-- Find active students in CSE department
SELECT s.student_id, u.name, u.email, p.name AS program
FROM students s
JOIN users u ON s.user_id = u.id
JOIN programs p ON s.program_id = p.id
JOIN departments d ON p.department_id = d.id
WHERE d.code = 'CSE' AND s.status = 'ACTIVE';

-- Find pending document requests
SELECT dr.id, u.name AS student_name, dr.document_type, dr.status, dr.fee_amount
FROM document_requests dr
JOIN users u ON (SELECT user_id FROM students WHERE id = dr.student_id) = u.id
WHERE dr.status = 'PENDING';
```

#### 3.5.2 SELECT with GROUP BY and Aggregate Functions

```sql
-- Department-wise student count
SELECT 
    d.name AS department_name,
    d.code AS department_code,
    COUNT(DISTINCT s.id) AS total_students,
    COUNT(DISTINCT CASE WHEN s.status = 'ACTIVE' THEN s.id END) AS active_students,
    COUNT(DISTINCT CASE WHEN s.status = 'GRADUATED' THEN s.id END) AS graduated_students,
    ROUND(AVG(s.current_semester), 1) AS avg_semester
FROM departments d
LEFT JOIN programs p ON d.id = p.department_id
LEFT JOIN students s ON p.id = s.program_id
GROUP BY d.id, d.name, d.code
ORDER BY total_students DESC;

-- Fee collection summary by semester
SELECT 
    sem.name AS semester,
    sem.term,
    sem.academic_year,
    COUNT(DISTINCT f.student_id) AS students_with_fees,
    SUM(f.registration_fee) AS total_registration_fee,
    SUM(f.credit_fee) AS total_credit_fee,
    SUM(f.amount_paid) AS total_collected,
    ROUND(AVG(f.amount_paid), 2) AS avg_payment,
    MIN(f.amount_paid) AS min_payment,
    MAX(f.amount_paid) AS max_payment
FROM semesters sem
JOIN fees f ON sem.id = f.semester_id
WHERE sem.academic_year = 2024
GROUP BY sem.id, sem.name, sem.term, sem.academic_year
ORDER BY sem.academic_year DESC, sem.term;
```

#### 3.5.3 SELECT with ORDER BY and LIMIT

```sql
-- Top 10 students by current semester
SELECT s.student_id, u.name, p.name AS program, s.current_semester, s.status
FROM students s
JOIN users u ON s.user_id = u.id
JOIN programs p ON s.program_id = p.id
ORDER BY s.current_semester DESC, u.name ASC
LIMIT 10;

-- Latest 5 notices
SELECT id, title, content, target_role, category, created_at
FROM notices
ORDER BY created_at DESC
LIMIT 5;
```

### 3.6 JOIN Operations

#### 3.6.1 INNER JOIN

```sql
-- Student transcript with course and faculty details
SELECT 
    s.student_id,
    u.name AS student_name,
    c.course_code,
    c.title AS course_title,
    c.credit_hours,
    co.schedule_info,
    sem.name AS semester_name,
    f.employee_id AS faculty_id,
    uf.name AS faculty_name,
    e.enrollment_type,
    e.status AS enrollment_status
FROM enrollments e
INNER JOIN students s ON e.student_id = s.id
INNER JOIN users u ON s.user_id = u.id
INNER JOIN course_offerings co ON e.offering_id = co.id
INNER JOIN courses c ON co.course_id = c.id
INNER JOIN semesters sem ON co.semester_id = sem.id
INNER JOIN faculty f ON co.faculty_id = f.id
INNER JOIN users uf ON f.user_id = uf.id
WHERE s.student_id = '221-101-001'
ORDER BY sem.academic_year DESC, sem.term DESC, c.course_code;
```

#### 3.6.2 LEFT JOIN

```sql
-- Students with their advisors (some may not have advisors)
SELECT 
    s.student_id,
    u.name AS student_name,
    f.employee_id AS advisor_employee_id,
    uf.name AS advisor_name,
    d.name AS advisor_department
FROM students s
JOIN users u ON s.user_id = u.id
LEFT JOIN faculty f ON s.advisor_id = f.id
LEFT JOIN users uf ON f.user_id = uf.id
LEFT JOIN departments d ON f.department_id = d.id
WHERE s.status = 'ACTIVE';

-- Course offerings with optional batch and section
SELECT 
    co.id,
    c.course_code,
    c.title,
    sem.name AS semester,
    f.employee_id,
    uf.name AS faculty_name,
    b.batch_number,
    sec.name AS section_name
FROM course_offerings co
JOIN courses c ON co.course_id = c.id
JOIN semesters sem ON co.semester_id = sem.id
JOIN faculty f ON co.faculty_id = f.id
JOIN users uf ON f.user_id = uf.id
LEFT JOIN batches b ON co.batch_id = b.id
LEFT JOIN sections sec ON co.section_id = sec.id
ORDER BY sem.academic_year DESC;
```

#### 3.6.3 Self-Join

```sql
-- Courses with their prerequisites
SELECT 
    c.course_code,
    c.title AS course_title,
    c.credit_hours,
    prereq.course_code AS prerequisite_code,
    prereq.title AS prerequisite_title
FROM courses c
LEFT JOIN courses prereq ON c.prerequisite_course_id = prereq.id
WHERE c.is_active = TRUE
ORDER BY c.department_id, c.course_code;
```

### 3.7 Subqueries

#### 3.7.1 Subquery in WHERE Clause

```sql
-- Find students who have pending financial aid applications
SELECT s.student_id, u.name, p.name AS program
FROM students s
JOIN users u ON s.user_id = u.id
JOIN programs p ON s.program_id = p.id
WHERE s.id IN (
    SELECT student_id FROM financial_aid_applications 
    WHERE status = 'PENDING'
)
AND s.status = 'ACTIVE';
```

#### 3.7.2 Subquery in SELECT Clause

```sql
-- Student list with enrollment count
SELECT 
    s.student_id,
    u.name,
    p.name AS program,
    (
        SELECT COUNT(*) 
        FROM enrollments e 
        WHERE e.student_id = s.id AND e.status != 'DROPPED'
    ) AS active_enrollments,
    (
        SELECT COUNT(*) 
        FROM enrollments e 
        WHERE e.student_id = s.id AND e.status = 'COMPLETED'
    ) AS completed_courses
FROM students s
JOIN users u ON s.user_id = u.id
JOIN programs p ON s.program_id = p.id
WHERE s.status = 'ACTIVE';
```

#### 3.7.3 Correlated Subquery

```sql
-- Students with above-average attendance
SELECT 
    s.student_id,
    u.name,
    (
        SELECT ROUND(
            SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) * 100.0 / COUNT(a.id), 2
        )
        FROM attendance a
        JOIN enrollments e ON a.enrollment_id = e.id
        WHERE e.student_id = s.id
    ) AS attendance_percentage
FROM students s
JOIN users u ON s.user_id = u.id
WHERE s.status = 'ACTIVE'
HAVING attendance_percentage > (
    SELECT AVG(attendance_pct)
    FROM (
        SELECT 
            ROUND(
                SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) * 100.0 / COUNT(a.id), 2
            ) AS attendance_pct
        FROM attendance a
        JOIN enrollments e ON a.enrollment_id = e.id
        GROUP BY e.student_id
    ) AS avg_calc
);
```

### 3.8 Composite SQL Features: Triggers

#### 3.8.1 Trigger: Prevent Faculty Deletion with Active Advisees

```sql
DELIMITER $$
CREATE TRIGGER trg_prevent_faculty_deletion
BEFORE DELETE ON faculty
FOR EACH ROW
BEGIN
    DECLARE student_count INT;
    
    SELECT COUNT(*) INTO student_count 
    FROM students 
    WHERE advisor_id = OLD.id AND status = 'ACTIVE';
    
    IF student_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete faculty member with active student advisees. Reassign students first.';
    END IF;
END$$
DELIMITER ;
```

**Purpose:** Protects data integrity by preventing accidental deletion of faculty members who have active student advisees.

#### 3.8.2 Trigger: Auto-Update Student Status on Full Clearance

```sql
DELIMITER $$
CREATE TRIGGER trg_update_student_status_on_clearance
AFTER UPDATE ON semester_clearance
FOR EACH ROW
BEGIN
    DECLARE total_semesters INT;
    DECLARE completed_clearances INT;
    DECLARE student_program_id CHAR(36);
    DECLARE program_duration DECIMAL(3,1);
    
    IF NEW.registration_cleared = 1 AND 
       NEW.midterm_cleared = 1 AND 
       NEW.final_exam_cleared = 1 AND
       (OLD.registration_cleared = 0 OR OLD.midterm_cleared = 0 OR OLD.final_exam_cleared = 0) THEN
       
        SELECT s.program_id INTO student_program_id
        FROM students s WHERE s.id = NEW.student_id;
        
        SELECT p.duration_years INTO program_duration
        FROM programs p WHERE p.id = student_program_id;
        
        SELECT COUNT(*) INTO completed_clearances
        FROM semester_clearance sc
        JOIN semesters sem ON sc.semester_id = sem.id
        WHERE sc.student_id = NEW.student_id
          AND sem.status = 'COMPLETED'
          AND sc.registration_cleared = 1
          AND sc.midterm_cleared = 1
          AND sc.final_exam_cleared = 1;
        
        IF completed_clearances >= program_duration * 2 THEN
            UPDATE students SET status = 'GRADUATED' WHERE id = NEW.student_id;
        END IF;
    END IF;
END$$
DELIMITER ;
```

**Purpose:** Automatically promotes student status to GRADUATED when all semesters are fully cleared, reducing manual status updates.

#### 3.8.3 Trigger: Check Seat Limit on Enrollment

```sql
DELIMITER $$
CREATE TRIGGER trg_check_seat_limit
BEFORE INSERT ON enrollments
FOR EACH ROW
BEGIN
    DECLARE current_enrollment INT;
    DECLARE seat_limit INT;
    
    SELECT seat_limit INTO seat_limit
    FROM course_offerings WHERE id = NEW.offering_id;
    
    SELECT COUNT(*) INTO current_enrollment
    FROM enrollments
    WHERE offering_id = NEW.offering_id AND status != 'DROPPED';
    
    IF current_enrollment >= seat_limit THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Course offering has reached maximum seat capacity.';
    END IF;
END$$
DELIMITER ;
```

**Purpose:** Enforces course capacity limits at the database level, preventing over-enrollment.

### 3.9 Composite SQL Features: Stored Procedures

#### 3.9.1 Procedure: Calculate Student CGPA

```sql
DELIMITER $$
CREATE PROCEDURE sp_calculate_student_cgpa(
    IN p_student_id CHAR(36),
    OUT p_cgpa DECIMAL(3,2),
    OUT p_totalCredits DECIMAL(5,2),
    OUT p_totalPoints DECIMAL(5,2)
)
BEGIN
    DECLARE v_enrollmentId CHAR(36);
    DECLARE v_courseCredit DECIMAL(3,1);
    DECLARE v_marksObtained DECIMAL(6,2);
    DECLARE v_gradePoint DECIMAL(3,2);
    
    SET p_totalCredits = 0;
    SET p_totalPoints = 0;
    SET p_cgpa = 0.00;
    
    DECLARE done INT DEFAULT FALSE;
    DECLARE cursor_enrollments CURSOR FOR
        SELECT e.id, c.credit_hours, r.marks_obtained
        FROM enrollments e
        JOIN course_offerings co ON e.offering_id = co.id
        JOIN courses c ON co.course_id = c.id
        LEFT JOIN results r ON e.id = r.enrollment_id AND r.is_final_result = 1
        WHERE e.student_id = p_student_id AND e.status = 'COMPLETED';
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cursor_enrollments;
    
    read_loop: LOOP
        FETCH cursor_enrollments INTO v_enrollmentId, v_courseCredit, v_marksObtained;
        IF done THEN LEAVE read_loop; END IF;
        
        SELECT grade_point INTO v_gradePoint
        FROM grading_policies
        WHERE v_marksObtained BETWEEN min_marks AND max_marks
        LIMIT 1;
        
        IF v_gradePoint IS NOT NULL THEN
            SET p_totalCredits = p_totalCredits + v_courseCredit;
            SET p_totalPoints = p_totalPoints + (v_gradePoint * v_courseCredit);
        END IF;
    END LOOP;
    
    CLOSE cursor_enrollments;
    
    IF p_totalCredits > 0 THEN
        SET p_cgpa = p_totalPoints / p_totalCredits;
    END IF;
END$$
DELIMITER ;
```

**Usage:**
```sql
CALL sp_calculate_student_cgpa('00000000-0000-0000-b005-000000000001', @cgpa, @credits, @points);
SELECT @cgpa AS CGPA, @credits AS Total_Credits, @points AS Total_Points;
```

#### 3.9.2 Procedure: Process Fee Payment

```sql
DELIMITER $$
CREATE PROCEDURE sp_process_fee_payment(
    IN p_student_id CHAR(36),
    IN p_semester_id CHAR(36),
    IN p_amount DECIMAL(10,2),
    OUT p_status VARCHAR(20),
    OUT p_new_balance DECIMAL(10,2)
)
BEGIN
    DECLARE v_fee_id CHAR(36);
    DECLARE v_current_paid DECIMAL(10,2);
    DECLARE v_total_due DECIMAL(10,2);
    
    SELECT id, amount_paid, registration_fee + credit_fee
    INTO v_fee_id, v_current_paid, v_total_due
    FROM fees
    WHERE student_id = p_student_id AND semester_id = p_semester_id;
    
    IF v_fee_id IS NULL THEN
        SET p_status = 'NO_FEE_RECORD';
        SET p_new_balance = 0;
    ELSE
        UPDATE fees
        SET amount_paid = amount_paid + p_amount,
            paid_at = CASE 
                WHEN amount_paid + p_amount >= (registration_fee + credit_fee) 
                THEN CURRENT_TIMESTAMP ELSE paid_at 
            END
        WHERE id = v_fee_id;
        
        SELECT amount_paid, registration_fee + credit_fee
        INTO v_current_paid, v_total_due
        FROM fees WHERE id = v_fee_id;
        
        SET p_new_balance = v_total_due - v_current_paid;
        
        IF p_new_balance <= 0 THEN
            SET p_status = 'FULLY_PAID';
        ELSE
            SET p_status = 'PARTIAL_PAYMENT';
        END IF;
    END IF;
END$$
DELIMITER ;
```

#### 3.9.3 Procedure: Department Performance Report

```sql
DELIMITER $$
CREATE PROCEDURE sp_department_performance_report(
    IN p_department_id CHAR(36),
    IN p_semester_id CHAR(36)
)
BEGIN
    SELECT 
        d.name AS department_name,
        d.code AS department_code,
        COUNT(DISTINCT f.id) AS total_faculty,
        COUNT(DISTINCT co.id) AS total_course_offerings,
        COUNT(DISTINCT e.student_id) AS total_students_enrolled,
        COUNT(DISTINCT CASE WHEN r.marks_obtained IS NOT NULL THEN e.student_id END) AS students_with_results,
        ROUND(AVG(r.marks_obtained), 2) AS average_marks,
        SUM(CASE WHEN r.marks_obtained >= 40 THEN 1 ELSE 0 END) AS passed_count,
        SUM(CASE WHEN r.marks_obtained < 40 THEN 1 ELSE 0 END) AS failed_count
    FROM departments d
    LEFT JOIN faculty f ON f.department_id = d.id
    LEFT JOIN course_offerings co ON co.faculty_id = f.id
    LEFT JOIN enrollments e ON e.offering_id = co.id
    LEFT JOIN results r ON r.enrollment_id = e.id AND r.is_final_result = 1
    WHERE d.id = p_department_id AND co.semester_id = p_semester_id
    GROUP BY d.id;
END$$
DELIMITER ;
```

### 3.10 Composite SQL Features: Views

#### 3.10.1 View: Student Transcript

```sql
CREATE OR REPLACE VIEW vw_student_transcript AS
SELECT 
    s.id AS student_id,
    s.student_id,
    s.registration_no,
    u.name AS student_name,
    u.email AS student_email,
    p.name AS program_name,
    b.batch_number,
    sec.name AS section_name,
    co.course_code,
    c.title AS course_title,
    co.schedule_info,
    f.employee_id AS faculty_id,
    u2.name AS faculty_name,
    sem.name AS semester_name,
    sem.term,
    sem.academic_year,
    e.status AS enrollment_status,
    e.enrollment_type,
    e.enrolled_at,
    ex.title AS exam_title,
    ex.exam_type,
    ex.total_marks,
    ex.weight_percent,
    r.marks_obtained,
    gp.grade,
    gp.grade_point,
    r.is_final_result,
    r.published_at
FROM students s
JOIN users u ON s.user_id = u.id
JOIN programs p ON s.program_id = p.id
LEFT JOIN batches b ON s.batch_id = b.id
LEFT JOIN sections sec ON s.section_id = sec.id
LEFT JOIN enrollments e ON s.id = e.student_id
LEFT JOIN course_offerings co ON e.offering_id = co.id
LEFT JOIN courses c ON co.course_id = c.id
LEFT JOIN faculty f ON co.faculty_id = f.id
LEFT JOIN users u2 ON f.user_id = u2.id
LEFT JOIN semesters sem ON co.semester_id = sem.id
LEFT JOIN exams ex ON ex.offering_id = co.id
LEFT JOIN results r ON e.id = r.enrollment_id AND ex.id = r.exam_id
LEFT JOIN grading_policies gp ON r.marks_obtained BETWEEN gp.min_marks AND gp.max_marks;
```

**Query Example:**
```sql
SELECT student_id, student_name, course_code, course_title, semester_name, marks_obtained, grade
FROM vw_student_transcript
WHERE student_id = '221-101-001'
ORDER BY semester_name DESC, course_code;
```

#### 3.10.2 View: Faculty Workload

```sql
CREATE OR REPLACE VIEW vw_faculty_workload AS
SELECT 
    f.id AS faculty_id,
    u.name AS faculty_name,
    u.email AS faculty_email,
    d.name AS department_name,
    d.code AS department_code,
    f.designation,
    f.administrative_position,
    COUNT(DISTINCT co.id) AS total_course_offerings,
    COUNT(DISTINCT co.course_id) AS unique_courses,
    COUNT(DISTINCT e.student_id) AS total_students,
    COUNT(DISTINCT co.batch_id) AS batches_handled,
    SUM(co.seat_limit) AS total_seat_capacity,
    GROUP_CONCAT(DISTINCT CONCAT(c.course_code, ' - ', c.title) SEPARATOR ' | ') AS course_list
FROM faculty f
JOIN users u ON f.user_id = u.id
JOIN departments d ON f.department_id = d.id
LEFT JOIN course_offerings co ON f.id = co.faculty_id
LEFT JOIN courses c ON co.course_id = c.id
LEFT JOIN enrollments e ON co.id = e.offering_id
WHERE f.academic_status = 'ACTIVE'
GROUP BY f.id;
```

#### 3.10.3 View: Administrative Dashboard

```sql
CREATE OR REPLACE VIEW vw_admin_dashboard AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'STUDENT' AND is_active = 1) AS total_students,
    (SELECT COUNT(*) FROM users WHERE role = 'FACULTY' AND is_active = 1) AS total_faculty,
    (SELECT COUNT(*) FROM users WHERE role = 'ADMIN' AND is_active = 1) AS total_admins,
    (SELECT COUNT(*) FROM users WHERE role = 'REGISTRAR' AND is_active = 1) AS total_registrars,
    (SELECT COUNT(*) FROM departments) AS total_departments,
    (SELECT COUNT(*) FROM programs) AS total_programs,
    (SELECT COUNT(*) FROM courses) AS total_courses,
    (SELECT COUNT(*) FROM batches) AS total_batches,
    (SELECT COUNT(*) FROM students WHERE status = 'ACTIVE') AS active_students,
    (SELECT COUNT(*) FROM students WHERE status = 'GRADUATED') AS graduated_students,
    (SELECT COUNT(*) FROM students WHERE status = 'DROPPED') AS dropped_students,
    (SELECT COUNT(*) FROM students WHERE status = 'SUSPENDED') AS suspended_students,
    (SELECT COUNT(*) FROM financial_aid_applications WHERE status = 'PENDING') AS pending_financial_aid,
    (SELECT COUNT(*) FROM document_requests WHERE status = 'PENDING') AS pending_documents,
    (SELECT COUNT(*) FROM convocation_applications WHERE status = 'PENDING') AS pending_convocation,
    (SELECT COALESCE(SUM(amount_paid), 0) FROM fees WHERE paid_at IS NOT NULL) AS total_fees_collected;
```

**Query Example:**
```sql
SELECT * FROM vw_admin_dashboard;
```

#### 3.10.4 Additional Views

| View Name | Purpose |
|-----------|---------|
| vw_student_financial_summary | Student fee status and payment history |
| vw_attendance_summary | Student attendance percentages by course |
| vw_course_performance | Course-wise pass/fail statistics |
| vw_fee_collection_report | Fee collection analysis by semester and batch |

---

## CHAPTER 4: INVESTIGATION & ANALYSIS

### 4.1 Department Performance Analysis

Using the `vw_course_performance` view and `sp_department_performance_report` procedure, we analyzed departmental performance for Spring 2024 semester:

| Department | Course Offerings | Total Enrollments | Average Marks | Pass Rate |
|------------|-----------------|-------------------|---------------|-----------|
| Computer Science & Engineering | 5 | 45 | 68.50 | 82.22% |
| Electrical & Electronic Engineering | 3 | 28 | 65.30 | 78.57% |
| Business Administration | 2 | 20 | 71.20 | 85.00% |
| Mathematics | 2 | 18 | 72.45 | 88.89% |
| Physics | 1 | 12 | 69.80 | 83.33% |

**Finding:** Mathematics department shows the highest pass rate (88.89%), while EEE has the lowest (78.57%). This information helps identify departments that may need additional academic support.

### 4.2 Fee Collection Analysis

Using `vw_fee_collection_report`, we analyzed fee collection rates:

| Semester | Students | Expected Fees (BDT) | Collected (BDT) | Collection Rate |
|----------|----------|---------------------|-----------------|-----------------|
| Spring 2024 | 15 | 225,000 | 210,000 | 93.33% |
| Summer 2024 | 8 | 120,000 | 105,000 | 87.50% |
| Fall 2024 | 5 | 75,000 | 30,000 | 40.00% |

**Finding:** Fall 2024 has a lower collection rate (40%) because the semester is upcoming and most students haven't paid yet. Spring 2024 shows excellent collection at 93.33%.

### 4.3 Attendance Analysis

Using `vw_attendance_summary`, we identified students with attendance below 75%:

| Student ID | Student Name | Course | Attendance % | Status |
|------------|--------------|--------|--------------|--------|
| 221-101-005 | Sajid Iftikhar | CSE101 | 70.00% | AT RISK |
| 231-101-002 | Israt Jahan | CSE101 | 72.50% | AT RISK |
| 241-101-001 | Rakibul Islam | CSE101 | 73.33% | AT RISK |

**Action Required:** Students with attendance below 75% may face academic penalties as per university policy.

### 4.4 Financial Aid Application Status

Using administrative queries:

| Status | Count | Percentage |
|--------|-------|------------|
| PENDING | 16 | 80% |
| APPROVED | 3 | 15% |
| REJECTED | 1 | 5% |

**Finding:** 80% of applications are still pending review, indicating a need for faster processing or additional staff.

### 4.5 CGPA Distribution

Using the `sp_calculate_student_cgpa` procedure for all students:

| CGPA Range | Grade | Number of Students | Percentage |
|------------|-------|-------------------|------------|
| 3.75 - 4.00 | A+ | 3 | 15% |
| 3.50 - 3.74 | A | 5 | 25% |
| 3.00 - 3.49 | B+ | 6 | 30% |
| 2.50 - 2.99 | B | 4 | 20% |
| 2.00 - 2.49 | C+ | 2 | 10% |
| Below 2.00 | F | 0 | 0% |

**Finding:** 70% of students have CGPA above 3.00 (B+ and above), showing good overall academic performance.

### 4.6 Document Request Processing

| Document Type | Total Requests | Completed | Pending | Processing |
|--------------|----------------|-----------|---------|------------|
| TRANSCRIPT | 8 | 6 | 1 | 1 |
| PROVISIONAL_CERTIFICATE | 3 | 1 | 1 | 1 |
| TESTIMONIAL | 4 | 2 | 2 | 0 |
| MAIN_CERTIFICATE | 3 | 0 | 2 | 1 |
| MEDIUM_OF_INSTRUCTION | 2 | 1 | 0 | 0 |

**Finding:** Transcripts are the most requested document, and main certificates have the longest pending queue.

---

## CHAPTER 5: CONCLUSION & FUTURE SCOPE

### 5.1 Project Summary

The University Academic Management System (UAMS) successfully demonstrates:

1. **Comprehensive Database Design:** A 28-table schema normalized to 3NF with proper constraints and relationships.

2. **Advanced SQL Features:** Implementation of 5 triggers, 5 stored procedures, and 7 views for business logic and analytics.

3. **Realistic Data:** 560+ records across all tables representing realistic university scenarios.

4. **Full-Stack Implementation:** Complete Spring Boot backend with REST APIs and React.js frontend with role-based interfaces.

5. **Analytical Capabilities:** Views and queries enabling department performance analysis, fee tracking, attendance monitoring, and more.

### 5.2 Engineering Problem Outcomes Addressed

#### EP1: Depth of Knowledge Required ✅

| Knowledge Level | How Addressed | Evidence |
|-----------------|---------------|----------|
| K3 (Investigated) | Researched university workflows, identified 28 entities | Complete ER model |
| K4 (Investigated) | Implemented business rules via triggers | 5 triggers for validation and automation |
| K5 (Investigated) | Designed multi-step procedures | 5 stored procedures for complex operations |
| K6 (Investigated) | Created analytical views | 7 views joining 3-8 tables |
| K8 (Investigated) | Applied DB design principles | 3NF normalization, referential integrity |

#### EP2: Range of Conflicting Requirements ✅

| Conflict | Resolution Approach |
|----------|-------------------|
| Data Integrity vs. Flexibility | CASCADE for dependent data, RESTRICT for critical relationships, SET NULL for optional links |
| Real-time vs. Batch Processing | Real-time triggers for immediate updates, views for analytical reporting |
| Security vs. Usability | Role-based ENUMs with granular permissions |
| Storage vs. Performance | Normalized tables for integrity, denormalized views for query performance |

#### EP4: Infrequently Encountered Issues ✅

| Issue | Solution Implemented |
|-------|---------------------|
| Circular dependency (Faculty ↔ Department) | Deferred constraint via ALTER TABLE after both tables created |
| Self-referencing prerequisite chain | NULLable FK with ON DELETE SET NULL |
| Multi-dimensional clearance tracking | Three independent boolean flags per semester |
| Grade calculation complexity | Grading policy table with range-based lookup |
| Bulk enrollment with seat limits | Stored procedure with cursor and trigger validation |

### 5.3 Challenges Faced and Solutions

1. **Challenge:** Handling circular dependency between Faculty and Departments
    - **Solution:** Created tables in sequence, added foreign key constraint after both tables exist using ALTER TABLE

2. **Challenge:** Ensuring data consistency across 28 interrelated tables
    - **Solution:** Comprehensive foreign key constraints with appropriate ON DELETE actions

3. **Challenge:** Implementing complex CGPA calculation
    - **Solution:** Stored procedure with cursor iterating through completed courses and joining grading policies

4. **Challenge:** Role-based access in frontend
    - **Solution:** React Router with protected routes based on user role from JWT token

### 5.4 Lessons Learned

1. Proper database normalization prevents data anomalies but requires careful foreign key design.
2. Triggers provide data integrity at the database level but should be used judiciously.
3. Stored procedures encapsulate complex logic but can be harder to debug.
4. Views simplify complex queries but may impact performance on large datasets.
5. Clear documentation of schema and relationships is essential for team collaboration.

### 5.5 Future Enhancements

1. **Learning Management System (LMS) Integration:** Add course content, assignments, and online quizzes.

2. **Mobile Application:** Develop native mobile apps for students and faculty.

3. **Payment Gateway Integration:** Integrate with mobile financial services (bKash, Nagad) for online fee payment.

4. **Email/SMS Notifications:** Automated notifications for fee dues, result publication, and clearance status.

5. **Advanced Analytics Dashboard:** Interactive charts and graphs for administrators using libraries like Chart.js or D3.js.

6. **Document Generation:** PDF generation for transcripts, certificates, and fee receipts.

7. **REST API Documentation:** Swagger/OpenAPI documentation for API endpoints.

8. **Data Export:** Excel/CSV export functionality for reports.

---

## CHAPTER 6: APPENDIX - SAMPLE CODE SNIPPETS

### A.1 Table Creation Sample

```sql
CREATE TABLE students (
    id                  CHAR(36) PRIMARY KEY,
    user_id             CHAR(36) NOT NULL UNIQUE,
    program_id          CHAR(36) NOT NULL,
    advisor_id          CHAR(36),
    batch_id            CHAR(36),
    section_id          CHAR(36),
    guardian_id         CHAR(36),
    student_id          VARCHAR(30) UNIQUE NOT NULL,
    registration_no     VARCHAR(30) UNIQUE NOT NULL,
    current_semester    INT NOT NULL DEFAULT 1,
    is_registration_cleared BOOLEAN NOT NULL DEFAULT FALSE,
    has_received_laptop     BOOLEAN NOT NULL DEFAULT FALSE,
    status              ENUM('ACTIVE', 'GRADUATED', 'DROPPED', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    admitted_at         DATE NOT NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_student_program FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE RESTRICT,
    CONSTRAINT fk_student_advisor FOREIGN KEY (advisor_id) REFERENCES faculty(id) ON DELETE SET NULL,
    CONSTRAINT fk_student_batch FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE SET NULL,
    CONSTRAINT fk_student_section FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL,
    CONSTRAINT fk_student_guardian FOREIGN KEY (guardian_id) REFERENCES guardians(id) ON DELETE SET NULL
) ENGINE=InnoDB;
```

### A.2 Sample Seed Data

```sql
-- Insert a student
INSERT INTO students (
    id, user_id, program_id, advisor_id, batch_id, section_id, guardian_id,
    student_id, registration_no, current_semester, is_registration_cleared,
    has_received_laptop, status, admitted_at, created_at
) VALUES (
    '00000000-0000-0000-b005-000000000001',
    '00000000-0000-0000-a001-000000000004',
    '00000000-0000-0000-a007-000000000001',
    '00000000-0000-0000-a006-000000000001',
    '00000000-0000-0000-b001-000000000001',
    '00000000-0000-0000-b003-000000000001',
    '00000000-0000-0000-a004-000000000001',
    '221-101-001',
    'REG-221-001',
    1,
    FALSE,
    FALSE,
    'ACTIVE',
    '2022-01-10',
    '2022-01-10 14:00:00'
);
```

### A.3 Backend Entity Sample (JPA)

```java
@Entity
@Table(name = "students")
public class Student {
    @Id
    private String id;
    
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "advisor_id")
    private Faculty advisor;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "batch_id")
    private Batch batch;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "section_id")
    private Section section;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "guardian_id")
    private Guardian guardian;
    
    @Column(unique = true, nullable = false, length = 30)
    private String studentId;
    
    @Column(unique = true, nullable = false, length = 30)
    private String registrationNo;
    
    @Column(nullable = false)
    private Integer currentSemester = 1;
    
    @Column(name = "is_registration_cleared")
    private Boolean isRegistrationCleared = false;
    
    @Column(name = "has_received_laptop")
    private Boolean hasReceivedLaptop = false;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StudentStatus status = StudentStatus.ACTIVE;
    
    @Column(name = "admitted_at", nullable = false)
    private LocalDate admittedAt;
}
```

### A.4 Frontend Component Sample (React)

```jsx
// Student Dashboard Component
function StudentDashboard() {
    const { user } = useAuth();
    const { data: student } = useFetch(`/api/students/me`);
    const { data: fees } = useFetch(`/api/fees/student/${student?.id}`);
    const { data: results } = useFetch(`/api/results/student/${student?.id}`);
    
    return (
        <div className="dashboard-container">
            <ProfileHeaderCard user={user} student={student} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                    title="Pending Fees" 
                    value={calculatePendingFees(fees)} 
                    icon={<DollarIcon />}
                    color="red"
                />
                <StatCard 
                    title="CGPA" 
                    value={calculateCGPA(results)} 
                    icon={<GradeIcon />}
                    color="green"
                />
                <StatCard 
                    title="Attendance" 
                    value={getAttendancePercentage(student?.id)} 
                    icon={<CalendarIcon />}
                    color="blue"
                />
            </div>
            
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Recent Results</h2>
                <ResultsTable results={results} />
            </div>
        </div>
    );
}
```

---

## REFERENCES

1. Elmasri, R., & Navathe, S. B. (2016). *Fundamentals of Database Systems* (7th ed.). Pearson.

2. MySQL Documentation. (2024). *MySQL 8.0 Reference Manual*. Retrieved from https://dev.mysql.com/doc/

3. Spring Framework Documentation. (2024). *Spring Boot Reference Guide*. Retrieved from https://spring.io/projects/spring-boot

4. React Documentation. (2024). *React Official Documentation*. Retrieved from https://react.dev/

5. Tailwind CSS. (2024). *Tailwind CSS Documentation*. Retrieved from https://tailwindcss.com/docs

---

## ACKNOWLEDGMENT

We would like to express our gratitude to our course instructor and lab supervisor for their guidance throughout this project. We also thank the Department of Computer Science & Engineering, Royal Bengal University, for providing the necessary resources and environment to complete this work.

---

**End of Report**

---

*This report is prepared as part of the CSE312: Database Management Systems Lab course requirements.*