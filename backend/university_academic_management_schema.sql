-- ============================================================
-- University Academic Management System (UAMS)
-- Database Schema & Seed Data (MySQL 8+)
-- Matches DIU Portal Design
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id              CHAR(36) PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    email           VARCHAR(150) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    role            ENUM('ADMIN', 'FACULTY', 'STUDENT', 'REGISTRAR') NOT NULL,
    phone           VARCHAR(20),
    date_of_birth   DATE,
    gender          VARCHAR(10),
    blood_group     VARCHAR(5),
    profile_image   LONGTEXT,
    must_change_password BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. DEPARTMENTS
DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
    id                  CHAR(36) PRIMARY KEY,
    name                VARCHAR(150) NOT NULL,
    code                VARCHAR(20) UNIQUE NOT NULL,
    dept_number         VARCHAR(5) UNIQUE NOT NULL,
    head_faculty_id     CHAR(36) NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. FACULTY
DROP TABLE IF EXISTS faculty;
CREATE TABLE faculty (
    id              CHAR(36) PRIMARY KEY,
    user_id         CHAR(36) NOT NULL UNIQUE,
    department_id   CHAR(36) NOT NULL,
    employee_id     VARCHAR(30) UNIQUE NOT NULL,
    designation     VARCHAR(50) NOT NULL,
    joined_at       DATE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_faculty_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_faculty_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

ALTER TABLE departments ADD CONSTRAINT fk_department_head FOREIGN KEY (head_faculty_id) REFERENCES faculty(id) ON DELETE SET NULL;

-- 4. PROGRAMS
DROP TABLE IF EXISTS programs;
CREATE TABLE programs (
    id              CHAR(36) PRIMARY KEY,
    department_id   CHAR(36) NOT NULL,
    name            VARCHAR(150) NOT NULL,
    degree_level    VARCHAR(30) NOT NULL,
    duration_years  DECIMAL(3,1) NOT NULL,
    total_credits   DECIMAL(5,2) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_program_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. STUDENTS
DROP TABLE IF EXISTS students;
CREATE TABLE students (
    id                  CHAR(36) PRIMARY KEY,
    user_id             CHAR(36) NOT NULL UNIQUE,
    program_id          CHAR(36) NOT NULL,
    student_id          VARCHAR(30) UNIQUE NOT NULL, -- Long 16-digit ID
    registration_no     VARCHAR(30) UNIQUE NOT NULL, -- Short formatted ID (e.g. 242-15-211)
    batch               VARCHAR(20) NOT NULL,
    current_semester    INT NOT NULL DEFAULT 1,
    cgpa                DECIMAL(3,2) DEFAULT 0.00,
    guardian_name       VARCHAR(150),
    guardian_phone      VARCHAR(20),
    is_registration_cleared BOOLEAN NOT NULL DEFAULT FALSE,
    has_received_laptop     BOOLEAN NOT NULL DEFAULT FALSE,
    status              ENUM('ACTIVE', 'GRADUATED', 'DROPPED', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    admitted_at         DATE NOT NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_student_program FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 6. COURSES
DROP TABLE IF EXISTS courses;
CREATE TABLE courses (
    id                          CHAR(36) PRIMARY KEY,
    department_id               CHAR(36) NOT NULL,
    course_code                 VARCHAR(20) UNIQUE NOT NULL,
    title                       VARCHAR(200) NOT NULL,
    credit_hours                DECIMAL(3,1) NOT NULL,
    prerequisite_course_id      CHAR(36) NULL,
    description                 TEXT,
    created_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_course_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    CONSTRAINT fk_course_prerequisite FOREIGN KEY (prerequisite_course_id) REFERENCES courses(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 7. SEMESTERS
DROP TABLE IF EXISTS semesters;
CREATE TABLE semesters (
    id                      CHAR(36) PRIMARY KEY,
    name                    VARCHAR(50) NOT NULL,
    start_date              DATE NOT NULL,
    end_date                DATE NOT NULL,
    registration_deadline   DATE NOT NULL,
    is_active               BOOLEAN NOT NULL DEFAULT FALSE,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 8. COURSE_OFFERINGS
DROP TABLE IF EXISTS course_offerings;
CREATE TABLE course_offerings (
    id              CHAR(36) PRIMARY KEY,
    course_id       CHAR(36) NOT NULL,
    semester_id     CHAR(36) NOT NULL,
    faculty_id      CHAR(36) NOT NULL,
    target_batch    VARCHAR(20) NOT NULL,
    section         VARCHAR(10) NOT NULL DEFAULT 'A',
    schedule_info   VARCHAR(255),
    seat_limit      INT NOT NULL DEFAULT 40,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_offering_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_offering_semester FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
    CONSTRAINT fk_offering_faculty FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE RESTRICT,
    UNIQUE KEY uq_offering (course_id, semester_id, target_batch, section)
) ENGINE=InnoDB;

-- 9. ENROLLMENTS
DROP TABLE IF EXISTS enrollments;
CREATE TABLE enrollments (
    id              CHAR(36) PRIMARY KEY,
    student_id      CHAR(36) NOT NULL,
    offering_id     CHAR(36) NOT NULL,
    enrollment_type ENUM('REGULAR', 'RETAKE', 'IMPROVEMENT') NOT NULL DEFAULT 'REGULAR',
    status          ENUM('REGISTERED', 'DROPPED', 'COMPLETED') NOT NULL DEFAULT 'REGISTERED',
    enrolled_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_enrollment_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollment_offering FOREIGN KEY (offering_id) REFERENCES course_offerings(id) ON DELETE CASCADE,
    UNIQUE KEY uq_enrollment (student_id, offering_id)
) ENGINE=InnoDB;

-- 10. ATTENDANCE
DROP TABLE IF EXISTS attendance;
CREATE TABLE attendance (
    id              CHAR(36) PRIMARY KEY,
    enrollment_id   CHAR(36) NOT NULL,
    class_date      DATE NOT NULL,
    status          ENUM('PRESENT', 'ABSENT', 'LATE') NOT NULL,
    marked_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    UNIQUE KEY uq_attendance (enrollment_id, class_date)
) ENGINE=InnoDB;

-- 11. EXAMS
DROP TABLE IF EXISTS exams;
CREATE TABLE exams (
    id              CHAR(36) PRIMARY KEY,
    offering_id     CHAR(36) NOT NULL,
    exam_type       ENUM('QUIZ', 'MIDTERM', 'FINAL', 'ASSIGNMENT') NOT NULL,
    exam_date       DATE,
    total_marks     DECIMAL(6,2) NOT NULL,
    weight_percent  DECIMAL(5,2) NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_exam_offering FOREIGN KEY (offering_id) REFERENCES course_offerings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. RESULTS
DROP TABLE IF EXISTS results;
CREATE TABLE results (
    id                  CHAR(36) PRIMARY KEY,
    enrollment_id       CHAR(36) NOT NULL,
    exam_id             CHAR(36) NULL,
    marks_obtained      DECIMAL(6,2),
    grade               VARCHAR(5),
    grade_point         DECIMAL(3,2),
    is_final_result     BOOLEAN NOT NULL DEFAULT FALSE,
    published_at        TIMESTAMP NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_result_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    CONSTRAINT fk_result_exam FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 13. FEES
DROP TABLE IF EXISTS fees;
CREATE TABLE fees (
    id              CHAR(36) PRIMARY KEY,
    student_id      CHAR(36) NOT NULL,
    semester_id     CHAR(36) NOT NULL,
    amount_due      DECIMAL(10,2) NOT NULL,
    amount_paid     DECIMAL(10,2) NOT NULL DEFAULT 0,
    status          ENUM('DUE', 'PARTIAL', 'PAID') NOT NULL DEFAULT 'DUE',
    due_date        DATE,
    paid_at         TIMESTAMP NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fee_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_fee_semester FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
    UNIQUE KEY uq_fee (student_id, semester_id)
) ENGINE=InnoDB;

-- 14. NOTICES
DROP TABLE IF EXISTS notices;
CREATE TABLE notices (
    id              CHAR(36) PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    content         TEXT NOT NULL,
    posted_by       CHAR(36) NOT NULL,
    target_role     ENUM('ALL', 'STUDENT', 'FACULTY') NOT NULL DEFAULT 'ALL',
    department_id   CHAR(36) NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notice_user FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notice_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- SEED DATA (Matches Screenshots)
-- ============================================================
