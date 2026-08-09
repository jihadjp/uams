-- ============================================================
-- University Academic Management System (UAMS)
-- Royal Bengal University (RBU)
-- 3NF Database Schema
-- Organized by Insertion Order (Dependency Sequence)
-- Constraint names use
-- ============================================================

CREATE DATABASE IF NOT EXISTS uams;
USE uams;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS (Independent)
DROP TABLE IF EXISTS users;
CREATE TABLE users (
                       id                      CHAR(36) PRIMARY KEY,
                       name                    VARCHAR(150) NOT NULL,
                       email                   VARCHAR(150) UNIQUE NOT NULL,
                       password_hash           VARCHAR(255) NOT NULL,
                       role                    ENUM('ADMIN', 'FACULTY', 'STUDENT', 'REGISTRAR') NOT NULL,
                       phone                   VARCHAR(20),
                       date_of_birth           DATE,
                       gender                  VARCHAR(10),
                       blood_group             VARCHAR(5),
                       profile_image           LONGTEXT,
                       is_verified             BOOLEAN NOT NULL DEFAULT FALSE,
                       is_active               BOOLEAN NOT NULL DEFAULT TRUE,
                       must_change_password    BOOLEAN NOT NULL DEFAULT TRUE,
                       created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. DEPARTMENTS (Independent - head_faculty link added after faculty exists)
DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
                             id                      CHAR(36) PRIMARY KEY,
                             name                    VARCHAR(150) NOT NULL,
                             code                    VARCHAR(20) UNIQUE NOT NULL,
                             dept_number             VARCHAR(5) UNIQUE NOT NULL,
                             faculty_division        VARCHAR(150),
                             head_faculty_id         CHAR(36),
                             created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. SEMESTERS (Independent)
DROP TABLE IF EXISTS semesters;
CREATE TABLE semesters (
                           id                      CHAR(36) PRIMARY KEY,
                           name                    VARCHAR(50) NOT NULL,
                           term                    ENUM('SPRING', 'SUMMER', 'FALL') NOT NULL,
                           academic_year           INT NOT NULL,
                           start_date              DATE NOT NULL,
                           end_date                DATE NOT NULL,
                           registration_deadline   DATE NOT NULL,
                           add_drop_deadline       DATE,
                           grade_deadline          DATE,
                           status                  ENUM('UPCOMING', 'REGISTRATION', 'ONGOING', 'FINAL_EXAMS', 'GRADING', 'COMPLETED') NOT NULL DEFAULT 'UPCOMING',
                           created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. GUARDIANS (Independent)
DROP TABLE IF EXISTS guardians;
CREATE TABLE guardians (
                           id                      CHAR(36) PRIMARY KEY,
                           name                    VARCHAR(150) NOT NULL,
                           phone                   VARCHAR(20) NOT NULL,
                           relation                ENUM('FATHER', 'MOTHER', 'BROTHER', 'SISTER', 'OTHER') NOT NULL,
                           other_relation          VARCHAR(50)
) ENGINE=InnoDB;

-- 5. GRADING_POLICIES (Independent)
DROP TABLE IF EXISTS grading_policies;
CREATE TABLE grading_policies (
                                  id                      INT AUTO_INCREMENT PRIMARY KEY,
                                  min_marks               DECIMAL(5,2) NOT NULL,
                                  max_marks               DECIMAL(5,2) NOT NULL,
                                  grade                   VARCHAR(5) NOT NULL,
                                  grade_point             DECIMAL(3,2) NOT NULL,
                                  remarks                 VARCHAR(50)
) ENGINE=InnoDB;

INSERT INTO grading_policies (min_marks, max_marks, grade, grade_point, remarks) VALUES
                                                                                     (80.00, 100.00, 'A+', 4.00, 'Outstanding'),
                                                                                     (75.00, 79.99, 'A',  3.75, 'Excellent'),
                                                                                     (70.00, 74.99, 'A-', 3.50, 'Very Good'),
                                                                                     (65.00, 69.99, 'B+', 3.25, 'Good'),
                                                                                     (60.00, 64.99, 'B',  3.00, 'Satisfactory'),
                                                                                     (55.00, 59.99, 'B-', 2.75, 'Above Average'),
                                                                                     (50.00, 54.99, 'C+', 2.50, 'Average'),
                                                                                     (45.00, 49.99, 'C',  2.25, 'Below Average'),
                                                                                     (40.00, 44.99, 'D',  2.00, 'Pass'),
                                                                                     (0.00,  39.99, 'F',  0.00, 'Fail');

-- 6. FINANCIAL_AID_CIRCULARS (Independent)
DROP TABLE IF EXISTS financial_aid_circulars;
CREATE TABLE financial_aid_circulars (
                                         id                      CHAR(36) PRIMARY KEY,
                                         title                   VARCHAR(200) NOT NULL,
                                         description             TEXT NOT NULL,
                                         eligibility_criteria    TEXT,
                                         benefit_details         TEXT,
                                         deadline                DATE NOT NULL,
                                         is_active               BOOLEAN NOT NULL DEFAULT TRUE,
                                         created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 7. FACULTY (Depends on USERS, DEPARTMENTS)
DROP TABLE IF EXISTS faculty;
CREATE TABLE faculty (
                         id                          CHAR(36) PRIMARY KEY,
                         user_id                     CHAR(36) NOT NULL UNIQUE,
                         department_id               CHAR(36) NOT NULL,
                         employee_id                 VARCHAR(30) UNIQUE NOT NULL,
                         designation                 VARCHAR(50) NOT NULL,
                         academic_status             VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
                         administrative_position     VARCHAR(100),
                         joined_at                   DATE,
                         created_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT faculty_belongs_to_user
                             FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                         CONSTRAINT faculty_belongs_to_department
                             FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Circular dependency resolution: Department is headed by a Faculty member
ALTER TABLE departments
    ADD CONSTRAINT department_is_headed_by_faculty
        FOREIGN KEY (head_faculty_id) REFERENCES faculty(id) ON DELETE SET NULL;

-- 8. PROGRAMS (Depends on DEPARTMENTS)
DROP TABLE IF EXISTS programs;
CREATE TABLE programs (
                          id                      CHAR(36) PRIMARY KEY,
                          department_id           CHAR(36) NOT NULL,
                          name                    VARCHAR(150) NOT NULL,
                          degree_level            VARCHAR(30) NOT NULL,
                          duration_years          DECIMAL(3,1) NOT NULL,
                          total_credits           DECIMAL(5,2) NOT NULL,
                          created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          CONSTRAINT program_belongs_to_department
                              FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. COURSES (Depends on DEPARTMENTS)
DROP TABLE IF EXISTS courses;
CREATE TABLE courses (
                         id                      CHAR(36) PRIMARY KEY,
                         department_id           CHAR(36) NOT NULL,
                         course_code             VARCHAR(20) UNIQUE NOT NULL,
                         title                   VARCHAR(200) NOT NULL,
                         credit_hours            DECIMAL(3,1) NOT NULL,
                         prerequisite_course_id  CHAR(36),
                         course_type             ENUM('THEORY', 'LAB', 'PROJECT', 'RESEARCH') NOT NULL DEFAULT 'THEORY',
                         is_active               BOOLEAN NOT NULL DEFAULT TRUE,
                         description             TEXT,
                         created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         CONSTRAINT course_belongs_to_department
                             FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
                         CONSTRAINT course_has_prerequisite_course
                             FOREIGN KEY (prerequisite_course_id) REFERENCES courses(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 10. ACADEMIC_CALENDARS (Depends on SEMESTERS)
DROP TABLE IF EXISTS academic_calendars;
CREATE TABLE academic_calendars (
                                    id                      CHAR(36) PRIMARY KEY,
                                    semester_id             CHAR(36) NOT NULL UNIQUE,
                                    academic_year           INT NOT NULL,
                                    duration                VARCHAR(100) NOT NULL,
                                    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    CONSTRAINT academic_calendar_belongs_to_semester
                                        FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. BATCHES (Depends on PROGRAMS)
DROP TABLE IF EXISTS batches;
CREATE TABLE batches (
                         id                      CHAR(36) PRIMARY KEY,
                         batch_number            VARCHAR(20) NOT NULL,
                         batch_initial           VARCHAR(10) NOT NULL,
                         program_id              CHAR(36) NOT NULL,
                         created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT batch_belongs_to_program
                             FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
                         UNIQUE KEY uq_batch_program (batch_number, program_id)
) ENGINE=InnoDB;

-- 12. CALENDAR_EVENTS (Depends on ACADEMIC_CALENDARS)
DROP TABLE IF EXISTS calendar_events;
CREATE TABLE calendar_events (
                                 id                      CHAR(36) PRIMARY KEY,
                                 calendar_id             CHAR(36) NOT NULL,
                                 title                   VARCHAR(150) NOT NULL,
                                 date_value              VARCHAR(100),
                                 order_index             INT NOT NULL,
                                 CONSTRAINT calendar_event_belongs_to_academic_calendar
                                     FOREIGN KEY (calendar_id) REFERENCES academic_calendars(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 13. SECTIONS (Depends on BATCHES)
DROP TABLE IF EXISTS sections;
CREATE TABLE sections (
                          id                      CHAR(36) PRIMARY KEY,
                          name                    VARCHAR(20) NOT NULL,
                          batch_id                CHAR(36) NOT NULL,
                          created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          CONSTRAINT section_belongs_to_batch
                              FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
                          UNIQUE KEY uq_section_batch (name, batch_id)
) ENGINE=InnoDB;

-- 14. BATCH_SEMESTER_FEES (Depends on BATCHES, SEMESTERS)
DROP TABLE IF EXISTS batch_semester_fees;
CREATE TABLE batch_semester_fees (
                                     id                      CHAR(36) PRIMARY KEY,
                                     batch_id                CHAR(36) NOT NULL,
                                     semester_id             CHAR(36) NOT NULL,
                                     registration_fee        DECIMAL(10,2) NOT NULL,
                                     created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                     CONSTRAINT batch_semester_fee_belongs_to_batch
                                         FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
                                     CONSTRAINT batch_semester_fee_belongs_to_semester
                                         FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
                                     UNIQUE KEY uq_batch_semester_fee (batch_id, semester_id)
) ENGINE=InnoDB;

-- 15. STUDENTS (Depends on USERS, PROGRAMS, FACULTY, BATCHES, SECTIONS, GUARDIANS)
DROP TABLE IF EXISTS students;
CREATE TABLE students (
                          id                          CHAR(36) PRIMARY KEY,
                          user_id                     CHAR(36) NOT NULL UNIQUE,
                          program_id                  CHAR(36) NOT NULL,
                          advisor_id                  CHAR(36),
                          batch_id                    CHAR(36),
                          section_id                  CHAR(36),
                          guardian_id                 CHAR(36),
                          student_id                  VARCHAR(30) UNIQUE NOT NULL,
                          registration_no             VARCHAR(30) UNIQUE NOT NULL,
                          current_semester            INT NOT NULL DEFAULT 1,
                          is_registration_cleared     BOOLEAN NOT NULL DEFAULT FALSE,
                          has_received_laptop         BOOLEAN NOT NULL DEFAULT FALSE,
                          status                      ENUM('ACTIVE', 'GRADUATED', 'DROPPED', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
                          admitted_at                 DATE NOT NULL,
                          created_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          CONSTRAINT student_belongs_to_user
                              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                          CONSTRAINT student_enrolled_in_program
                              FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE RESTRICT,
                          CONSTRAINT student_is_advised_by_faculty
                              FOREIGN KEY (advisor_id) REFERENCES faculty(id) ON DELETE SET NULL,
                          CONSTRAINT student_belongs_to_batch
                              FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE SET NULL,
                          CONSTRAINT student_belongs_to_section
                              FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL,
                          CONSTRAINT student_has_guardian
                              FOREIGN KEY (guardian_id) REFERENCES guardians(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 16. COURSE_OFFERINGS (Depends on COURSES, SEMESTERS, FACULTY, BATCHES, SECTIONS)
DROP TABLE IF EXISTS course_offerings;
CREATE TABLE course_offerings (
                                  id                      CHAR(36) PRIMARY KEY,
                                  course_id               CHAR(36) NOT NULL,
                                  semester_id             CHAR(36) NOT NULL,
                                  faculty_id              CHAR(36) NOT NULL,
                                  batch_id                CHAR(36),
                                  section_id              CHAR(36),
                                  schedule_info           VARCHAR(255),
                                  seat_limit              INT NOT NULL DEFAULT 40,
                                  is_results_approved     BOOLEAN NOT NULL DEFAULT FALSE,
                                  created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  CONSTRAINT course_offering_offers_course
                                      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
                                  CONSTRAINT course_offering_belongs_to_semester
                                      FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
                                  CONSTRAINT course_offering_is_taught_by_faculty
                                      FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE RESTRICT,
                                  CONSTRAINT course_offering_targets_batch
                                      FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE SET NULL,
                                  CONSTRAINT course_offering_targets_section
                                      FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 17. ENROLLMENTS (Depends on STUDENTS, COURSE_OFFERINGS)
DROP TABLE IF EXISTS enrollments;
CREATE TABLE enrollments (
                             id                      CHAR(36) PRIMARY KEY,
                             student_id              CHAR(36) NOT NULL,
                             offering_id             CHAR(36) NOT NULL,
                             status                  ENUM('REGISTERED', 'DROPPED', 'COMPLETED') NOT NULL DEFAULT 'REGISTERED',
                             enrollment_type         ENUM('REGULAR', 'RETAKE', 'IMPROVEMENT') NOT NULL DEFAULT 'REGULAR',
                             enrolled_at             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             CONSTRAINT enrollment_belongs_to_student
                                 FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                             CONSTRAINT enrollment_belongs_to_course_offering
                                 FOREIGN KEY (offering_id) REFERENCES course_offerings(id) ON DELETE CASCADE,
                             UNIQUE KEY uq_enrollment (student_id, offering_id)
) ENGINE=InnoDB;

-- 18. EXAMS (Depends on COURSE_OFFERINGS)
DROP TABLE IF EXISTS exams;
CREATE TABLE exams (
                       id                      CHAR(36) PRIMARY KEY,
                       offering_id             CHAR(36) NOT NULL,
                       exam_type               ENUM('QUIZ', 'MIDTERM', 'MIDTERM_IMPROVEMENT', 'FINAL', 'ASSIGNMENT', 'PRESENTATION', 'PROJECT_SHOW', 'LAB_REPORT', 'LAB_EVALUATION', 'ATTENDANCE') NOT NULL,
                       title                   VARCHAR(50),
                       exam_date               DATE,
                       total_marks             DECIMAL(6,2) NOT NULL,
                       weight_percent          DECIMAL(5,2) NOT NULL DEFAULT 0,
                       created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       CONSTRAINT exam_belongs_to_course_offering
                           FOREIGN KEY (offering_id) REFERENCES course_offerings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 19. FEES (Depends on STUDENTS, SEMESTERS)
DROP TABLE IF EXISTS fees;
CREATE TABLE fees (
                      id                      CHAR(36) PRIMARY KEY,
                      student_id              CHAR(36) NOT NULL,
                      semester_id             CHAR(36) NOT NULL,
                      registration_fee        DECIMAL(10,2) NOT NULL DEFAULT 0,
                      credit_fee              DECIMAL(10,2) NOT NULL DEFAULT 0,
                      amount_paid             DECIMAL(10,2) NOT NULL DEFAULT 0,
                      due_date                DATE,
                      paid_at                 TIMESTAMP NULL,
                      created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      CONSTRAINT fee_belongs_to_student
                          FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                      CONSTRAINT fee_belongs_to_semester
                          FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
                      UNIQUE KEY uq_fee (student_id, semester_id)
) ENGINE=InnoDB;

-- 20. NOTICES (Depends on USERS, DEPARTMENTS)
DROP TABLE IF EXISTS notices;
CREATE TABLE notices (
                         id                      CHAR(36) PRIMARY KEY,
                         title                   VARCHAR(200) NOT NULL,
                         content                 TEXT NOT NULL,
                         posted_by               CHAR(36) NOT NULL,
                         target_role             ENUM('ALL', 'STUDENT', 'FACULTY', 'REGISTRAR') NOT NULL DEFAULT 'ALL',
                         department_id           CHAR(36),
                         category                VARCHAR(50) DEFAULT 'General',
                         created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT notice_is_posted_by_user
                             FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE,
                         CONSTRAINT notice_targets_department
                             FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 21. SEMESTER_CLEARANCE (Depends on STUDENTS, SEMESTERS)
DROP TABLE IF EXISTS semester_clearance;
CREATE TABLE semester_clearance (
                                    id                      CHAR(36) PRIMARY KEY,
                                    student_id              CHAR(36) NOT NULL,
                                    semester_id             CHAR(36) NOT NULL,
                                    registration_cleared    BOOLEAN NOT NULL DEFAULT FALSE,
                                    midterm_cleared         BOOLEAN NOT NULL DEFAULT FALSE,
                                    final_exam_cleared      BOOLEAN NOT NULL DEFAULT FALSE,
                                    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    CONSTRAINT semester_clearance_belongs_to_student
                                        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                                    CONSTRAINT semester_clearance_belongs_to_semester
                                        FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
                                    UNIQUE KEY uq_clearance (student_id, semester_id)
) ENGINE=InnoDB;

-- 22. EVALUATIONS (Depends on STUDENTS, COURSE_OFFERINGS)
DROP TABLE IF EXISTS evaluations;
CREATE TABLE evaluations (
                             id                      CHAR(36) PRIMARY KEY,
                             student_id              CHAR(36) NOT NULL,
                             offering_id             CHAR(36) NOT NULL,
                             q1                      INT NOT NULL,
                             q2                      INT NOT NULL,
                             q3                      INT NOT NULL,
                             q4                      INT NOT NULL,
                             q5                      INT NOT NULL,
                             q6                      INT NOT NULL,
                             q7                      INT NOT NULL,
                             q8                      INT NOT NULL,
                             q9                      INT NOT NULL,
                             q10                     INT NOT NULL,
                             comments                TEXT,
                             created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             CONSTRAINT evaluation_is_submitted_by_student
                                 FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                             CONSTRAINT evaluation_targets_course_offering
                                 FOREIGN KEY (offering_id) REFERENCES course_offerings(id) ON DELETE CASCADE,
                             UNIQUE KEY uq_evaluation (student_id, offering_id)
) ENGINE=InnoDB;

-- 23. DOCUMENT_REQUESTS (Depends on STUDENTS)
DROP TABLE IF EXISTS document_requests;
CREATE TABLE document_requests (
                                   id                      CHAR(36) PRIMARY KEY,
                                   student_id              CHAR(36) NOT NULL,
                                   document_type           ENUM('TRANSCRIPT', 'PROVISIONAL_CERTIFICATE', 'MAIN_CERTIFICATE', 'TESTIMONIAL', 'MEDIUM_OF_INSTRUCTION') NOT NULL,
                                   status                  ENUM('PENDING', 'PROCESSING', 'READY_FOR_PICKUP', 'COMPLETED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
                                   fee_amount              DECIMAL(10,2) NOT NULL,
                                   is_paid                 BOOLEAN NOT NULL DEFAULT FALSE,
                                   request_note            TEXT,
                                   admin_note              TEXT,
                                   requested_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                   CONSTRAINT document_request_is_made_by_student
                                       FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 24. CONVOCATION_APPLICATIONS (Depends on STUDENTS)
DROP TABLE IF EXISTS convocation_applications;
CREATE TABLE convocation_applications (
                                          id                      CHAR(36) PRIMARY KEY,
                                          student_id              CHAR(36) NOT NULL,
                                          cgpa                    DECIMAL(3,2) NOT NULL,
                                          credits_completed       DECIMAL(5,2) NOT NULL,
                                          convocation_year        INT NOT NULL,
                                          gown_size               VARCHAR(20) NOT NULL,
                                          guest_count             INT NOT NULL DEFAULT 0,
                                          fee_amount              DECIMAL(10,2) NOT NULL,
                                          is_paid                 BOOLEAN NOT NULL DEFAULT FALSE,
                                          status                  ENUM('PENDING', 'VERIFIED', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
                                          applied_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                          updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                          CONSTRAINT convocation_application_is_submitted_by_student
                                              FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                                          UNIQUE KEY uq_convocation_student (student_id, convocation_year)
) ENGINE=InnoDB;

-- 25. FINANCIAL_AID_APPLICATIONS (Depends on STUDENTS, FINANCIAL_AID_CIRCULARS)
DROP TABLE IF EXISTS financial_aid_applications;
CREATE TABLE financial_aid_applications (
                                            id                      CHAR(36) PRIMARY KEY,
                                            student_id              CHAR(36) NOT NULL,
                                            circular_id             CHAR(36) NOT NULL,
                                            justification           TEXT NOT NULL,
                                            monthly_income          DECIMAL(10,2),
                                            status                  ENUM('PENDING', 'REVIEWING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
                                            admin_remarks           TEXT,
                                            applied_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                            updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                            CONSTRAINT financial_aid_application_is_submitted_by_student
                                                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                                            CONSTRAINT financial_aid_application_refers_to_circular
                                                FOREIGN KEY (circular_id) REFERENCES financial_aid_circulars(id) ON DELETE CASCADE,
                                            UNIQUE KEY uq_fa_app (student_id, circular_id)
) ENGINE=InnoDB;

-- 26. ATTENDANCE (Depends on ENROLLMENTS)
DROP TABLE IF EXISTS attendance;
CREATE TABLE attendance (
                            id                      CHAR(36) PRIMARY KEY,
                            enrollment_id           CHAR(36) NOT NULL,
                            class_date              DATE NOT NULL,
                            status                  ENUM('PRESENT', 'ABSENT', 'LATE') NOT NULL,
                            marked_at               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            CONSTRAINT attendance_belongs_to_enrollment
                                FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
                            UNIQUE KEY uq_attendance (enrollment_id, class_date)
) ENGINE=InnoDB;

-- 27. RESULTS (Depends on ENROLLMENTS, EXAMS)
DROP TABLE IF EXISTS results;
CREATE TABLE results (
                         id                      CHAR(36) PRIMARY KEY,
                         enrollment_id           CHAR(36) NOT NULL,
                         exam_id                 CHAR(36),
                         marks_obtained          DECIMAL(6,2),
                         is_final_result         BOOLEAN NOT NULL DEFAULT FALSE,
                         published_at            TIMESTAMP NULL,
                         created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT result_belongs_to_enrollment
                             FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
                         CONSTRAINT result_belongs_to_exam
                             FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 28. NOTICE_VIEWS (Depends on NOTICES, USERS)
DROP TABLE IF EXISTS notice_views;
CREATE TABLE notice_views (
                              id                      CHAR(36) PRIMARY KEY,
                              notice_id               CHAR(36) NOT NULL,
                              user_id                 CHAR(36) NOT NULL,
                              viewed_at               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              CONSTRAINT notice_view_refers_to_notice
                                  FOREIGN KEY (notice_id) REFERENCES notices(id) ON DELETE CASCADE,
                              CONSTRAINT notice_view_belongs_to_user
                                  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                              UNIQUE KEY uq_notice_view (notice_id, user_id)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
