-- ============================================================
-- University Academic Management System (UAMS)
-- Seed Data Script (UUID-style IDs) - CORRECTED VERSION
-- ============================================================
-- Run AFTER: university_academic_management_schema.sql
--
-- ID conventions used by this seed:
--   users                      a001  (42 rows)
--   departments                a002  (20 rows)
--   semesters                  a003  (20 rows)
--   guardians                  a004  (20 rows)
--   financial_aid_circulars    a005  (20 rows)
--   faculty                    a006  (20 rows)
--   programs                   a007  (20 rows)
--   courses                    a008  (20 rows)
--   academic_calendars         a009  (20 rows)
--   batches                    b001  (20 rows)
--   calendar_events            b002  (20 rows)
--   sections                   b003  (20 rows)
--   batch_semester_fees        b004  (20 rows)
--   students                   b005  (20 rows)
--   course_offerings           b006  (20 rows)
--   enrollments                b007  (20 rows)
--   exams                      b008  (20 rows)
--   fees                       b009  (20 rows)
--   notices                    b010  (20 rows)
--   semester_clearance         c001  (20 rows)
--   evaluations                c002  (20 rows)
--   document_requests          c003  (20 rows)
--   convocation_applications   c004  (20 rows)
--   financial_aid_applications c005  (20 rows)
--   attendance                 c006  (20 rows)
--   results                    c007  (20 rows)
--   notice_views               c008  (20 rows)
--
-- Default password for every seeded account is:  password
-- (bcrypt hash below). STUDENT users have must_change_password = 1.
-- ============================================================

USE uams;
SET FOREIGN_KEY_CHECKS = 0;
-- 1. USERS (Prefix: a001)
-- Existing 20 users + 22 extra users to back students 14-20 and faculty 6-20.
INSERT INTO users (id, name, email, password_hash, role, phone, date_of_birth, 
    gender, blood_group, is_verified, is_active, must_change_password, created_at, updated_at
) VALUES
       ('00000000-0000-0000-a001-000000000001', 'Dr. Ariful Haque', 'ariful.cse@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'FACULTY', '01711223344', '1980-05-15', 'MALE', 'A+', 1, 1, 0, '2020-01-01 09:00:00', '2020-01-01 09:00:00'),
       ('00000000-0000-0000-a001-000000000002', 'Prof. Selina Begum', 'selina.eee@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'FACULTY', '01711223345', '1975-10-20', 'FEMALE', 'B+', 1, 1, 0, '2020-01-01 09:05:00', '2020-01-01 09:05:00'),
       ('00000000-0000-0000-a001-000000000003', 'Rahim Uddin', 'rahim.admin@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'ADMIN', '01711223346', '1985-03-12', 'MALE', 'O+', 1, 1, 0, '2020-01-01 10:00:00', '2020-01-01 10:00:00'),
       ('00000000-0000-0000-a001-000000000004', 'Tanvir Ahmed', 'tanvir.std@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'STUDENT', '01811223347', '2002-08-25', 'MALE', 'AB+', 1, 1, 1, '2022-01-10 14:00:00', '2022-01-10 14:00:00'),
       ('00000000-0000-0000-a001-000000000005', 'Fariha Islam', 'fariha.std@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'STUDENT', '01911223348', '2003-02-14', 'FEMALE', 'A-', 1, 1, 1, '2022-01-10 14:05:00', '2022-01-10 14:05:00'),
       ('00000000-0000-0000-a001-000000000006', 'Jasim Khan', 'jasim.reg@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'REGISTRAR', '01511223349', '1982-12-01', 'MALE', 'O-', 1, 1, 0, '2020-02-01 11:00:00', '2020-02-01 11:00:00'),
       ('00000000-0000-0000-a001-000000000007', 'Dr. Mahbubur Rahman', 'mahbub.math@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'FACULTY', '01711223350', '1982-07-04', 'MALE', 'B-', 1, 1, 0, '2020-01-05 09:00:00', '2020-01-05 09:00:00'),
       ('00000000-0000-0000-a001-000000000008', 'Sumaiya Akhtar', 'sumaiya.std@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'STUDENT', '01611223351', '2001-11-30', 'FEMALE', 'A+', 1, 1, 1, '2022-01-12 10:00:00', '2022-01-12 10:00:00'),
       ('00000000-0000-0000-a001-000000000009', 'Dr. Nusrat Jahan', 'nusrat.phy@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'FACULTY', '01711223352', '1988-09-18', 'FEMALE', 'O+', 1, 1, 0, '2020-06-01 09:00:00', '2020-06-01 09:00:00'),
       ('00000000-0000-0000-a001-000000000010', 'Kamal Hossain', 'kamal.std@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'STUDENT', '01811223353', '2002-05-05', 'MALE', 'B+', 1, 1, 1, '2022-01-15 09:00:00', '2022-01-15 09:00:00'),
       ('00000000-0000-0000-a001-000000000011', 'Sajid Iftikhar', 'sajid.std@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'STUDENT', '01711223354', '2003-01-01', 'MALE', 'A-', 1, 1, 1, '2022-01-15 10:00:00', '2022-01-15 10:00:00'),
       ('00000000-0000-0000-a001-000000000012', 'Maliha Tabassum', 'maliha.std@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'STUDENT', '01911223355', '2003-04-20', 'FEMALE', 'O+', 1, 1, 1, '2022-01-15 11:00:00', '2022-01-15 11:00:00'),
       ('00000000-0000-0000-a001-000000000013', 'Dr. Zulfikar Ali', 'zulfikar.eee@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'FACULTY', '01711223356', '1978-02-28', 'MALE', 'AB+', 1, 1, 0, '2020-01-10 09:00:00', '2020-01-10 09:00:00'),
       ('00000000-0000-0000-a001-000000000014', 'Naimur Rahman', 'naimur.std@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'STUDENT', '01811223357', '2002-12-12', 'MALE', 'A+', 1, 1, 1, '2022-01-16 09:00:00', '2022-01-16 09:00:00'),
       ('00000000-0000-0000-a001-000000000015', 'Rifat Abdullah', 'rifat.std@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'STUDENT', '01711223358', '2003-06-06', 'MALE', 'B-', 1, 1, 1, '2022-01-16 10:00:00', '2022-01-16 10:00:00'),
       ('00000000-0000-0000-a001-000000000016', 'Lutfun Nahar', 'lutfun.std@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'STUDENT', '01911223359', '2003-08-08', 'FEMALE', 'O-', 1, 1, 1, '2022-01-16 11:00:00', '2022-01-16 11:00:00'),
       ('00000000-0000-0000-a001-000000000017', 'Emon Hasan', 'emon.std@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'STUDENT', '01511223360', '2002-09-09', 'MALE', 'A+', 1, 1, 1, '2022-01-17 09:00:00', '2022-01-17 09:00:00'),
       ('00000000-0000-0000-a001-000000000018', 'Israt Jahan', 'israt.std@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'STUDENT', '01611223361', '2003-10-10', 'FEMALE', 'B+', 1, 1, 1, '2022-01-17 10:00:00', '2022-01-17 10:00:00'),
       ('00000000-0000-0000-a001-000000000019', 'Zahid Hasan', 'zahid.std@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'STUDENT', '01711223362', '2002-11-11', 'MALE', 'AB-', 1, 1, 1, '2022-01-17 11:00:00', '2022-01-17 11:00:00'),
       ('00000000-0000-0000-a001-000000000020', 'Maria Sultana', 'maria.std@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'STUDENT', '01811223363', '2003-12-12', 'FEMALE', 'O+', 1, 1, 1, '2022-01-18 09:00:00', '2022-01-18 09:00:00'),
       ('00000000-0000-0000-a001-000000000021', 'Rakibul Islam', 'rakibul.std@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'STUDENT', '01711223364', '2001-03-15', 'MALE', 'B+', 1, 1, 1, '2021-01-08 09:00:00', '2021-01-08 09:00:00'),
       ('00000000-0000-0000-a001-000000000022', 'Sabrina Karim', 'sabrina.std@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'STUDENT', '01811223365', '2001-07-22', 'FEMALE', 'A+', 1, 1, 1, '2021-01-09 09:00:00', '2021-01-09 09:00:00'),
       ('00000000-0000-0000-a001-000000000023', 'Shakil Ahmed', 'shakil.std@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'STUDENT', '01911223366', '2000-01-10', 'MALE', 'O+', 1, 1, 1, '2020-01-08 09:00:00', '2020-01-08 09:00:00'),
       ('00000000-0000-0000-a001-000000000024', 'Tahmina Akter', 'tahmina.std@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'STUDENT', '01611223367', '1999-05-18', 'FEMALE', 'AB+', 1, 1, 1, '2019-01-08 09:00:00', '2019-01-08 09:00:00'),
       ('00000000-0000-0000-a001-000000000025', 'Hasan Mahmud', 'hasan.std@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'STUDENT', '01511223368', '2000-11-25', 'MALE', 'A-', 1, 1, 1, '2020-01-09 10:00:00', '2020-01-09 10:00:00'),
       ('00000000-0000-0000-a001-000000000026', 'Sharmin Jahan', 'sharmin.std@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'STUDENT', '01711223369', '2004-02-20', 'FEMALE', 'B-', 1, 1, 1, '2024-01-08 09:00:00', '2024-01-08 09:00:00'),
       ('00000000-0000-0000-a001-000000000027', 'Imran Hossain', 'imran.std@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'STUDENT', '01811223370', '2004-06-30', 'MALE', 'O+', 1, 1, 1, '2024-01-08 10:00:00', '2024-01-08 10:00:00'),
       ('00000000-0000-0000-a001-000000000028', 'Dr. Farhan Chowdhury', 'farhan.bba@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'FACULTY', '01711223371', '1979-04-10', 'MALE', 'A+', 1, 1, 0, '2020-02-10 09:00:00', '2020-02-10 09:00:00'),
       ('00000000-0000-0000-a001-000000000029', 'Dr. Shafiqul Islam', 'shafiq.ce@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'FACULTY', '01711223372', '1976-09-14', 'MALE', 'B+', 1, 1, 0, '2020-02-12 09:00:00', '2020-02-12 09:00:00'),
       ('00000000-0000-0000-a001-000000000030', 'Dr. Rezaul Karim', 'reza.me@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'FACULTY', '01711223373', '1977-01-25', 'MALE', 'O+', 1, 1, 0, '2020-02-15 09:00:00', '2020-02-15 09:00:00'),
       ('00000000-0000-0000-a001-000000000031', 'Ms. Tania Sultana', 'tania.eng@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'FACULTY', '01711223374', '1984-12-05', 'FEMALE', 'A-', 1, 1, 0, '2020-03-01 09:00:00', '2020-03-01 09:00:00'),
       ('00000000-0000-0000-a001-000000000032', 'Dr. Abul Hasnat', 'hasnat.eco@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'FACULTY', '01711223375', '1975-06-18', 'MALE', 'AB+', 1, 1, 0, '2020-03-05 09:00:00', '2020-03-05 09:00:00'),
       ('00000000-0000-0000-a001-000000000033', 'Dr. Shirin Akter', 'shirin.chem@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'FACULTY', '01711223376', '1981-08-08', 'FEMALE', 'B+', 1, 1, 0, '2020-03-10 09:00:00', '2020-03-10 09:00:00'),
       ('00000000-0000-0000-a001-000000000034', 'Mr. Anisur Rahman', 'anis.law@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'FACULTY', '01711223377', '1980-10-11', 'MALE', 'O-', 1, 1, 0, '2020-04-01 09:00:00', '2020-04-01 09:00:00'),
       ('00000000-0000-0000-a001-000000000035', 'Dr. Rumana Haque', 'rumana.pharm@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'FACULTY', '01711223378', '1983-03-22', 'FEMALE', 'A+', 1, 1, 0, '2020-04-05 09:00:00', '2020-04-05 09:00:00'),
       ('00000000-0000-0000-a001-000000000036', 'Ar. Nabila Islam', 'nabila.arch@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'FACULTY', '01711223379', '1986-07-15', 'FEMALE', 'B-', 1, 1, 0, '2020-04-10 09:00:00', '2020-04-10 09:00:00'),
       ('00000000-0000-0000-a001-000000000037', 'Dr. Tanvir Hasan', 'tanvir.biotech@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'FACULTY', '01711223380', '1982-02-17', 'MALE', 'O+', 1, 1, 0, '2020-04-15 09:00:00', '2020-04-15 09:00:00'),
       ('00000000-0000-0000-a001-000000000038', 'Dr. Sharmin Sultana', 'sharmin.soc@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'FACULTY', '01711223381', '1985-05-27', 'FEMALE', 'AB-', 1, 1, 0, '2020-04-20 09:00:00', '2020-04-20 09:00:00'),
       ('00000000-0000-0000-a001-000000000039', 'Dr. Mehedi Hasan', 'mehedi.psy@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'FACULTY', '01711223382', '1981-11-11', 'MALE', 'A+', 1, 1, 0, '2020-05-01 09:00:00', '2020-05-01 09:00:00'),
       ('00000000-0000-0000-a001-000000000040', 'Dr. Golam Rabbani', 'rabbani.pol@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'FACULTY', '01711223383', '1978-08-19', 'MALE', 'B+', 1, 1, 0, '2020-05-05 09:00:00', '2020-05-05 09:00:00'),
       ('00000000-0000-0000-a001-000000000041', 'Engr. Sakib Al Hasan', 'sakib.tex@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'FACULTY', '01711223384', '1987-04-02', 'MALE', 'O+', 1, 1, 0, '2020-05-10 09:00:00', '2020-05-10 09:00:00'),
       ('00000000-0000-0000-a001-000000000042', 'Dr. Nadia Rahman', 'nadia.swe@rbu.edu.bd', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8.9c3KC', 'FACULTY', '01711223385', '1983-09-29', 'FEMALE', 'A-', 1, 1, 0, '2020-05-15 09:00:00', '2020-05-15 09:00:00');
-- 2. DEPARTMENTS (Prefix: a002)
INSERT INTO departments (id, name, code, dept_number, faculty_division, created_at
) VALUES
      ('00000000-0000-0000-a002-000000000001', 'Computer Science & Engineering', 'CSE', '101', 'Engineering', '2020-01-01 08:00:00'),
      ('00000000-0000-0000-a002-000000000002', 'Electrical & Electronic Engineering', 'EEE', '102', 'Engineering', '2020-01-01 08:00:00'),
      ('00000000-0000-0000-a002-000000000003', 'Mathematics', 'MATH', '201', 'Science', '2020-01-01 08:00:00'),
      ('00000000-0000-0000-a002-000000000004', 'Physics', 'PHY', '202', 'Science', '2020-01-01 08:00:00'),
      ('00000000-0000-0000-a002-000000000005', 'Business Administration', 'BBA', '301', 'Business', '2020-01-01 08:00:00'),
      ('00000000-0000-0000-a002-000000000006', 'Civil Engineering', 'CE', '103', 'Engineering', '2020-01-01 08:00:00'),
      ('00000000-0000-0000-a002-000000000007', 'Mechanical Engineering', 'ME', '104', 'Engineering', '2020-01-01 08:00:00'),
      ('00000000-0000-0000-a002-000000000008', 'English Literature', 'ENG', '401', 'Arts', '2020-01-01 08:00:00'),
      ('00000000-0000-0000-a002-000000000009', 'Economics', 'ECO', '402', 'Social Science', '2020-01-01 08:00:00'),
      ('00000000-0000-0000-a002-000000000010', 'Chemistry', 'CHEM', '203', 'Science', '2020-01-01 08:00:00'),
      ('00000000-0000-0000-a002-000000000011', 'Law', 'LAW', '501', 'Law', '2020-01-01 08:00:00'),
      ('00000000-0000-0000-a002-000000000012', 'Pharmacy', 'PHARM', '601', 'Health Science', '2020-01-01 08:00:00'),
      ('00000000-0000-0000-a002-000000000013', 'Architecture', 'ARCH', '701', 'Arts & Design', '2020-01-01 08:00:00'),
      ('00000000-0000-0000-a002-000000000014', 'Biotechnology', 'BIOTECH', '204', 'Science', '2020-01-01 08:00:00'),
      ('00000000-0000-0000-a002-000000000015', 'Sociology', 'SOC', '403', 'Social Science', '2020-01-01 08:00:00'),
      ('00000000-0000-0000-a002-000000000016', 'Psychology', 'PSY', '404', 'Social Science', '2020-01-01 08:00:00'),
      ('00000000-0000-0000-a002-000000000017', 'Political Science', 'POL', '405', 'Social Science', '2020-01-01 08:00:00'),
      ('00000000-0000-0000-a002-000000000018', 'Textile Engineering', 'TEX', '105', 'Engineering', '2020-01-01 08:00:00'),
      ('00000000-0000-0000-a002-000000000019', 'Software Engineering', 'SWE', '106', 'Engineering', '2020-01-01 08:00:00'),
      ('00000000-0000-0000-a002-000000000020', 'Marketing', 'MKT', '302', 'Business', '2020-01-01 08:00:00');

-- 3. SEMESTERS (Prefix: a003)
INSERT INTO semesters (id, name, term, academic_year, start_date, end_date, registration_deadline, status, created_at
) VALUES
      ('00000000-0000-0000-a003-000000000001', 'Spring 2024', 'SPRING', 2024, '2024-01-01', '2024-05-15', '2023-12-25', 'COMPLETED', '2023-10-01 00:00:00'),
      ('00000000-0000-0000-a003-000000000002', 'Summer 2024', 'SUMMER', 2024, '2024-05-20', '2024-09-15', '2024-05-10', 'ONGOING', '2024-01-01 00:00:00'),
      ('00000000-0000-0000-a003-000000000003', 'Fall 2024', 'FALL', 2024, '2024-09-20', '2025-01-15', '2024-09-10', 'UPCOMING', '2024-05-01 00:00:00'),
      ('00000000-0000-0000-a003-000000000004', 'Spring 2025', 'SPRING', 2025, '2025-01-01', '2025-05-15', '2024-12-25', 'UPCOMING', '2024-09-01 00:00:00'),
      ('00000000-0000-0000-a003-000000000005', 'Summer 2025', 'SUMMER', 2025, '2025-05-20', '2025-09-15', '2025-05-10', 'UPCOMING', '2025-01-01 00:00:00'),
      ('00000000-0000-0000-a003-000000000006', 'Fall 2025', 'FALL', 2025, '2025-09-20', '2026-01-15', '2025-09-10', 'UPCOMING', '2025-05-01 00:00:00'),
      ('00000000-0000-0000-a003-000000000007', 'Spring 2022', 'SPRING', 2022, '2022-01-01', '2022-05-15', '2021-12-25', 'COMPLETED', '2021-09-01 00:00:00'),
      ('00000000-0000-0000-a003-000000000008', 'Summer 2022', 'SUMMER', 2022, '2022-05-20', '2022-09-15', '2022-05-10', 'COMPLETED', '2022-01-01 00:00:00'),
      ('00000000-0000-0000-a003-000000000009', 'Fall 2022', 'FALL', 2022, '2022-09-20', '2023-01-15', '2022-09-10', 'COMPLETED', '2022-05-01 00:00:00'),
      ('00000000-0000-0000-a003-000000000010', 'Spring 2023', 'SPRING', 2023, '2023-01-01', '2023-05-15', '2022-12-25', 'COMPLETED', '2022-09-01 00:00:00'),
      ('00000000-0000-0000-a003-000000000011', 'Summer 2023', 'SUMMER', 2023, '2023-05-20', '2023-09-15', '2023-05-10', 'COMPLETED', '2023-01-01 00:00:00'),
      ('00000000-0000-0000-a003-000000000012', 'Fall 2023', 'FALL', 2023, '2023-09-20', '2024-01-15', '2023-09-10', 'COMPLETED', '2023-05-01 00:00:00'),
      ('00000000-0000-0000-a003-000000000013', 'Spring 2026', 'SPRING', 2026, '2026-01-01', '2026-05-15', '2025-12-25', 'UPCOMING', '2025-09-01 00:00:00'),
      ('00000000-0000-0000-a003-000000000014', 'Summer 2026', 'SUMMER', 2026, '2026-05-20', '2026-09-15', '2026-05-10', 'UPCOMING', '2026-01-01 00:00:00'),
      ('00000000-0000-0000-a003-000000000015', 'Fall 2026', 'FALL', 2026, '2026-09-20', '2027-01-15', '2026-09-10', 'UPCOMING', '2026-05-01 00:00:00'),
      ('00000000-0000-0000-a003-000000000016', 'Spring 2021', 'SPRING', 2021, '2021-01-01', '2021-05-15', '2020-12-25', 'COMPLETED', '2020-09-01 00:00:00'),
      ('00000000-0000-0000-a003-000000000017', 'Summer 2021', 'SUMMER', 2021, '2021-05-20', '2021-09-15', '2021-05-10', 'COMPLETED', '2021-01-01 00:00:00'),
      ('00000000-0000-0000-a003-000000000018', 'Fall 2021', 'FALL', 2021, '2021-09-20', '2022-01-15', '2021-09-10', 'COMPLETED', '2021-05-01 00:00:00'),
      ('00000000-0000-0000-a003-000000000019', 'Spring 2020', 'SPRING', 2020, '2020-01-01', '2020-05-15', '2019-12-25', 'COMPLETED', '2019-09-01 00:00:00'),
      ('00000000-0000-0000-a003-000000000020', 'Summer 2020', 'SUMMER', 2020, '2020-05-20', '2020-09-15', '2020-05-10', 'COMPLETED', '2020-01-01 00:00:00');

-- 4. GUARDIANS (Prefix: a004)
INSERT INTO guardians (id, name, phone, relation
) VALUES
      ('00000000-0000-0000-a004-000000000001', 'Abul Kashem', '01711334455', 'FATHER'),
      ('00000000-0000-0000-a004-000000000002', 'Razia Sultana', '01711334456', 'MOTHER'),
      ('00000000-0000-0000-a004-000000000003', 'Md. Ishaq', '01711334457', 'FATHER'),
      ('00000000-0000-0000-a004-000000000004', 'Lutfar Rahman', '01711334458', 'FATHER'),
      ('00000000-0000-0000-a004-000000000005', 'Shaheen Akhter', '01711334459', 'MOTHER'),
      ('00000000-0000-0000-a004-000000000006', 'Jalal Uddin', '01711334460', 'FATHER'),
      ('00000000-0000-0000-a004-000000000007', 'Nasrin Begum', '01711334461', 'MOTHER'),
      ('00000000-0000-0000-a004-000000000008', 'Aminul Islam', '01711334462', 'FATHER'),
      ('00000000-0000-0000-a004-000000000009', 'Parveen Sultana', '01711334463', 'MOTHER'),
      ('00000000-0000-0000-a004-000000000010', 'Siddiqur Rahman', '01711334464', 'FATHER'),
      ('00000000-0000-0000-a004-000000000011', 'Fatema Khatun', '01711334465', 'MOTHER'),
      ('00000000-0000-0000-a004-000000000012', 'Kabir Ahmed', '01711334466', 'FATHER'),
      ('00000000-0000-0000-a004-000000000013', 'Rokeya Begum', '01711334467', 'MOTHER'),
      ('00000000-0000-0000-a004-000000000014', 'Mansur Ali', '01711334468', 'FATHER'),
      ('00000000-0000-0000-a004-000000000015', 'Nigar Sultana', '01711334469', 'MOTHER'),
      ('00000000-0000-0000-a004-000000000016', 'Babul Akter', '01711334470', 'FATHER'),
      ('00000000-0000-0000-a004-000000000017', 'Dilara Begum', '01711334471', 'MOTHER'),
      ('00000000-0000-0000-a004-000000000018', 'Mizanur Rahman', '01711334472', 'FATHER'),
      ('00000000-0000-0000-a004-000000000019', 'Amena Khatun', '01711334473', 'MOTHER'),
      ('00000000-0000-0000-a004-000000000020', 'Rashidul Hasan', '01711334474', 'FATHER');

-- 5. GRADING_POLICIES (INT ID, schema already has 10; adding 10 variations)
INSERT INTO grading_policies (min_marks, max_marks, grade, grade_point, remarks
) VALUES
      (78.00, 79.99, 'A', 3.75, 'Exceptional Merit'),
      (72.00, 74.99, 'A-', 3.50, 'High Achievement'),
      (68.00, 69.99, 'B+', 3.25, 'Commendable'),
      (62.00, 64.99, 'B', 3.00, 'Good Progress'),
      (58.00, 59.99, 'B-', 2.75, 'Fairly Good'),
      (52.00, 54.99, 'C+', 2.50, 'Adequate'),
      (48.00, 49.99, 'C', 2.25, 'Marginal Pass'),
      (35.00, 39.99, 'E', 1.00, 'Probationary Fail'),
      (0.00, 34.99, 'F', 0.00, 'Hard Fail'),
      (101.00, 105.00, 'A++', 4.00, 'Bonus Recognition');
      
-- 6. FINANCIAL_AID_CIRCULARS (Prefix: a005)
INSERT INTO financial_aid_circulars (id, title, description, eligibility_criteria, benefit_details, deadline, is_active, created_at) VALUES
                                                                                                                                         ('00000000-0000-0000-a005-000000000001', 'Merit Based Scholarship 2024', 'Scholarship for top performers', 'GPA > 3.8', '50% waiver', '2024-02-15', 1, '2023-12-01 00:00:00'),
                                                                                                                                         ('00000000-0000-0000-a005-000000000002', 'Need Based Aid Summer 2024', 'Aid for financially struggling students', 'Income < 20k', '30% waiver', '2024-06-15', 1, '2024-04-01 00:00:00'),
                                                                                                                                         ('00000000-0000-0000-a005-000000000003', 'Freedom Fighter Quota', 'Aid for children of FF', 'FF Certificate', '100% waiver', '2024-12-31', 1, '2023-01-01 00:00:00'),
                                                                                                                                         ('00000000-0000-0000-a005-000000000004', 'Female Student Empowerment', 'Aid for female students', 'Female only', '20% waiver', '2024-10-15', 1, '2024-08-01 00:00:00'),
                                                                                                                                         ('00000000-0000-0000-a005-000000000005', 'Athletic Scholarship', 'For university sports team members', 'Team Membership', '25% waiver', '2024-09-30', 1, '2024-07-01 00:00:00'),
                                                                                                                                         ('00000000-0000-0000-a005-000000000006', 'Rural Area Support', 'For students from remote areas', 'Domicile proof', '15% waiver', '2024-11-20', 1, '2024-09-01 00:00:00'),
                                                                                                                                         ('00000000-0000-0000-a005-000000000007', 'Disabled Student Support', 'Aid for physically challenged students', 'Medical Certificate', '40% waiver', '2024-12-20', 1, '2024-01-01 00:00:00'),
                                                                                                                                         ('00000000-0000-0000-a005-000000000008', 'Sibling Discount', 'For siblings studying together', 'Family ID', '10% waiver', '2024-12-31', 1, '2024-01-01 00:00:00'),
                                                                                                                                         ('00000000-0000-0000-a005-000000000009', 'VC Special Grant', 'Special cases approved by VC', 'Extreme hardship', 'Variable', '2024-12-31', 1, '2024-01-01 00:00:00'),
                                                                                                                                         ('00000000-0000-0000-a005-000000000010', 'Alumni Funded Scholarship', 'Funded by RBU Alumni', 'GPA > 3.5', '20% waiver', '2024-11-05', 1, '2024-09-01 00:00:00'),
                                                                                                                                         ('00000000-0000-0000-a005-000000000011', 'Research Excellence Grant', 'For students with published papers', 'Research Publication', 'Full Credit Fee', '2025-01-10', 1, '2024-10-01 00:00:00'),
                                                                                                                                         ('00000000-0000-0000-a005-000000000012', 'ICT Innovation Award', 'For winners of hackathons', 'Competition Certificate', '1 Semester Waiver', '2025-03-01', 1, '2024-12-01 00:00:00'),
                                                                                                                                         ('00000000-0000-0000-a005-000000000013', 'International Student Aid', 'For non-resident students', 'Foreign Passport', '15% waiver', '2025-02-15', 1, '2024-11-01 00:00:00'),
                                                                                                                                         ('00000000-0000-0000-a005-000000000014', 'COVID-19 Recovery Fund', 'Special grant for affected families', 'Loss of income proof', '25% waiver', '2024-05-30', 0, '2021-01-01 00:00:00'),
                                                                                                                                         ('00000000-0000-0000-a005-000000000015', 'Startup Support Scheme', 'For student entrepreneurs', 'Trade License', '30% waiver', '2025-06-01', 1, '2025-01-01 00:00:00'),
                                                                                                                                         ('00000000-0000-0000-a005-000000000016', 'Community Service Award', 'For active volunteers', 'Volunteering records', '10% waiver', '2025-04-10', 1, '2025-02-01 00:00:00'),
                                                                                                                                         ('00000000-0000-0000-a005-000000000017', 'Graduate Assistantship', 'For research assistants', 'CGPA > 3.9', 'Monthly Stipend', '2025-05-20', 1, '2025-03-01 00:00:00'),
                                                                                                                                         ('00000000-0000-0000-a005-000000000018', 'Performing Arts Grant', 'For musicians and dancers', 'Talent proof', '15% waiver', '2025-07-01', 1, '2025-04-01 00:00:00'),
                                                                                                                                         ('00000000-0000-0000-a005-000000000019', 'Minority Community Grant', 'For ethnic minority students', 'Community Cert', '20% waiver', '2025-08-15', 1, '2025-05-01 00:00:00'),
                                                                                                                                         ('00000000-0000-0000-a005-000000000020', 'Winter Relief Grant', 'Seasonal aid', 'General application', 'Flat 5000 BDT', '2025-12-15', 1, '2025-10-01 00:00:00');
-- 7. FACULTY (Prefix: a006) - 20 rows
-- Every user_id references a FACULTY-role user (users a001-0001/0002/0007/0009/0013/0028-0042).
INSERT INTO faculty (id, user_id, department_id, employee_id, designation, academic_status, administrative_position, joined_at, created_at) VALUES
                                                                                                                                                ('00000000-0000-0000-a006-000000000001', '00000000-0000-0000-a001-000000000001', '00000000-0000-0000-a002-000000000001', 'EMP-CSE-001', 'Professor', 'ACTIVE', 'Dean', '2020-02-01', '2020-01-01 09:00:00'),
                                                                                                                                                ('00000000-0000-0000-a006-000000000002', '00000000-0000-0000-a001-000000000002', '00000000-0000-0000-a002-000000000002', 'EMP-EEE-001', 'Associate Professor', 'ACTIVE', 'Head of EEE', '2020-02-01', '2020-01-01 09:05:00'),
                                                                                                                                                ('00000000-0000-0000-a006-000000000003', '00000000-0000-0000-a001-000000000007', '00000000-0000-0000-a002-000000000003', 'EMP-MAT-001', 'Assistant Professor', 'ACTIVE', NULL, '2020-03-01', '2020-01-05 09:00:00'),
                                                                                                                                                ('00000000-0000-0000-a006-000000000004', '00000000-0000-0000-a001-000000000009', '00000000-0000-0000-a002-000000000004', 'EMP-PHY-001', 'Lecturer', 'ACTIVE', NULL, '2020-07-01', '2020-06-01 09:00:00'),
                                                                                                                                                ('00000000-0000-0000-a006-000000000005', '00000000-0000-0000-a001-000000000013', '00000000-0000-0000-a002-000000000002', 'EMP-EEE-002', 'Professor', 'ACTIVE', 'Proctor', '2020-02-15', '2020-01-10 09:00:00'),
                                                                                                                                                ('00000000-0000-0000-a006-000000000006', '00000000-0000-0000-a001-000000000028', '00000000-0000-0000-a002-000000000005', 'EMP-BBA-001', 'Associate Professor', 'ACTIVE', 'Head of BBA', '2020-03-01', '2020-02-10 09:00:00'),
                                                                                                                                                ('00000000-0000-0000-a006-000000000007', '00000000-0000-0000-a001-000000000029', '00000000-0000-0000-a002-000000000006', 'EMP-CE-001', 'Professor', 'ACTIVE', 'Head of CE', '2020-03-01', '2020-02-12 09:00:00'),
                                                                                                                                                ('00000000-0000-0000-a006-000000000008', '00000000-0000-0000-a001-000000000030', '00000000-0000-0000-a002-000000000007', 'EMP-ME-001', 'Professor', 'ACTIVE', 'Head of ME', '2020-03-05', '2020-02-15 09:00:00'),
                                                                                                                                                ('00000000-0000-0000-a006-000000000009', '00000000-0000-0000-a001-000000000031', '00000000-0000-0000-a002-000000000008', 'EMP-ENG-001', 'Assistant Professor', 'ACTIVE', 'Head of English', '2020-04-01', '2020-03-01 09:00:00'),
                                                                                                                                                ('00000000-0000-0000-a006-000000000010', '00000000-0000-0000-a001-000000000032', '00000000-0000-0000-a002-000000000009', 'EMP-ECO-001', 'Professor', 'ACTIVE', 'Head of Economics', '2020-04-05', '2020-03-05 09:00:00'),
                                                                                                                                                ('00000000-0000-0000-a006-000000000011', '00000000-0000-0000-a001-000000000033', '00000000-0000-0000-a002-000000000010', 'EMP-CHEM-001', 'Associate Professor', 'ACTIVE', NULL, '2020-04-10', '2020-03-10 09:00:00'),
                                                                                                                                                ('00000000-0000-0000-a006-000000000012', '00000000-0000-0000-a001-000000000034', '00000000-0000-0000-a002-000000000011', 'EMP-LAW-001', 'Assistant Professor', 'ACTIVE', NULL, '2020-05-01', '2020-04-01 09:00:00'),
                                                                                                                                                ('00000000-0000-0000-a006-000000000013', '00000000-0000-0000-a001-000000000035', '00000000-0000-0000-a002-000000000012', 'EMP-PHARM-001', 'Professor', 'ACTIVE', NULL, '2020-05-05', '2020-04-05 09:00:00'),
                                                                                                                                                ('00000000-0000-0000-a006-000000000014', '00000000-0000-0000-a001-000000000036', '00000000-0000-0000-a002-000000000013', 'EMP-ARCH-001', 'Associate Professor', 'ACTIVE', NULL, '2020-05-10', '2020-04-10 09:00:00'),
                                                                                                                                                ('00000000-0000-0000-a006-000000000015', '00000000-0000-0000-a001-000000000037', '00000000-0000-0000-a002-000000000014', 'EMP-BIO-001', 'Assistant Professor', 'ACTIVE', NULL, '2020-05-15', '2020-04-15 09:00:00'),
                                                                                                                                                ('00000000-0000-0000-a006-000000000016', '00000000-0000-0000-a001-000000000038', '00000000-0000-0000-a002-000000000015', 'EMP-SOC-001', 'Professor', 'ACTIVE', NULL, '2020-05-20', '2020-04-20 09:00:00'),
                                                                                                                                                ('00000000-0000-0000-a006-000000000017', '00000000-0000-0000-a001-000000000039', '00000000-0000-0000-a002-000000000016', 'EMP-PSY-001', 'Associate Professor', 'ACTIVE', NULL, '2020-06-01', '2020-05-01 09:00:00'),
                                                                                                                                                ('00000000-0000-0000-a006-000000000018', '00000000-0000-0000-a001-000000000040', '00000000-0000-0000-a002-000000000017', 'EMP-POL-001', 'Professor', 'ACTIVE', NULL, '2020-06-05', '2020-05-05 09:00:00'),
                                                                                                                                                ('00000000-0000-0000-a006-000000000019', '00000000-0000-0000-a001-000000000041', '00000000-0000-0000-a002-000000000018', 'EMP-TEX-001', 'Assistant Professor', 'ACTIVE', NULL, '2020-06-10', '2020-05-10 09:00:00'),
                                                                                                                                                ('00000000-0000-0000-a006-000000000020', '00000000-0000-0000-a001-000000000042', '00000000-0000-0000-a002-000000000019', 'EMP-SWE-001', 'Associate Professor', 'ACTIVE', NULL, '2020-06-15', '2020-05-15 09:00:00');
-- Update Department heads (circular dependency handled post-insert)
UPDATE departments SET head_faculty_id = '00000000-0000-0000-a006-000000000001' WHERE code = 'CSE';
UPDATE departments SET head_faculty_id = '00000000-0000-0000-a006-000000000002' WHERE code = 'EEE';
UPDATE departments SET head_faculty_id = '00000000-0000-0000-a006-000000000003' WHERE code = 'MATH';
UPDATE departments SET head_faculty_id = '00000000-0000-0000-a006-000000000004' WHERE code = 'PHY';
UPDATE departments SET head_faculty_id = '00000000-0000-0000-a006-000000000006' WHERE code = 'BBA';
UPDATE departments SET head_faculty_id = '00000000-0000-0000-a006-000000000007' WHERE code = 'CE';
UPDATE departments SET head_faculty_id = '00000000-0000-0000-a006-000000000008' WHERE code = 'ME';
UPDATE departments SET head_faculty_id = '00000000-0000-0000-a006-000000000009' WHERE code = 'ENG';
UPDATE departments SET head_faculty_id = '00000000-0000-0000-a006-000000000010' WHERE code = 'ECO';
UPDATE departments SET head_faculty_id = '00000000-0000-0000-a006-000000000011' WHERE code = 'CHEM';
UPDATE departments SET head_faculty_id = '00000000-0000-0000-a006-000000000012' WHERE code = 'LAW';
UPDATE departments SET head_faculty_id = '00000000-0000-0000-a006-000000000013' WHERE code = 'PHARM';
UPDATE departments SET head_faculty_id = '00000000-0000-0000-a006-000000000014' WHERE code = 'ARCH';
UPDATE departments SET head_faculty_id = '00000000-0000-0000-a006-000000000015' WHERE code = 'BIOTECH';
UPDATE departments SET head_faculty_id = '00000000-0000-0000-a006-000000000016' WHERE code = 'SOC';
UPDATE departments SET head_faculty_id = '00000000-0000-0000-a006-000000000017' WHERE code = 'PSY';
UPDATE departments SET head_faculty_id = '00000000-0000-0000-a006-000000000018' WHERE code = 'POL';
UPDATE departments SET head_faculty_id = '00000000-0000-0000-a006-000000000019' WHERE code = 'TEX';
UPDATE departments SET head_faculty_id = '00000000-0000-0000-a006-000000000020' WHERE code = 'SWE';
-- 8. PROGRAMS (Prefix: a007)
INSERT INTO programs (id, department_id, name, degree_level, duration_years, total_credits, created_at) VALUES
                                                                                                            ('00000000-0000-0000-a007-000000000001', '00000000-0000-0000-a002-000000000001', 'B.Sc. in Computer Science', 'Undergraduate', 4.0, 160.00, '2020-01-01 08:30:00'),
                                                                                                            ('00000000-0000-0000-a007-000000000002', '00000000-0000-0000-a002-000000000002', 'B.Sc. in Electrical Engineering', 'Undergraduate', 4.0, 160.00, '2020-01-01 08:30:00'),
                                                                                                            ('00000000-0000-0000-a007-000000000003', '00000000-0000-0000-a002-000000000003', 'M.Sc. in Applied Mathematics', 'Graduate', 2.0, 36.00, '2020-01-01 08:30:00'),
                                                                                                            ('00000000-0000-0000-a007-000000000004', '00000000-0000-0000-a002-000000000004', 'B.Sc. in Physics', 'Undergraduate', 4.0, 140.00, '2020-01-01 08:30:00'),
                                                                                                            ('00000000-0000-0000-a007-000000000005', '00000000-0000-0000-a002-000000000005', 'Bachelor of Business Administration', 'Undergraduate', 4.0, 128.00, '2020-01-01 08:30:00'),
                                                                                                            ('00000000-0000-0000-a007-000000000006', '00000000-0000-0000-a002-000000000006', 'B.Sc. in Civil Engineering', 'Undergraduate', 4.0, 160.00, '2020-01-01 08:30:00'),
                                                                                                            ('00000000-0000-0000-a007-000000000007', '00000000-0000-0000-a002-000000000007', 'B.Sc. in Mechanical Engineering', 'Undergraduate', 4.0, 160.00, '2020-01-01 08:30:00'),
                                                                                                            ('00000000-0000-0000-a007-000000000008', '00000000-0000-0000-a002-000000000008', 'B.A. in English Literature', 'Undergraduate', 4.0, 120.00, '2020-01-01 08:30:00'),
                                                                                                            ('00000000-0000-0000-a007-000000000009', '00000000-0000-0000-a002-000000000009', 'B.S.S. in Economics', 'Undergraduate', 4.0, 120.00, '2020-01-01 08:30:00'),
                                                                                                            ('00000000-0000-0000-a007-000000000010', '00000000-0000-0000-a002-000000000010', 'B.Sc. in Chemistry', 'Undergraduate', 4.0, 140.00, '2020-01-01 08:30:00'),
                                                                                                            ('00000000-0000-0000-a007-000000000011', '00000000-0000-0000-a002-000000000011', 'Bachelor of Laws', 'Undergraduate', 4.0, 130.00, '2020-01-01 08:30:00'),
                                                                                                            ('00000000-0000-0000-a007-000000000012', '00000000-0000-0000-a002-000000000012', 'Bachelor of Pharmacy', 'Undergraduate', 5.0, 180.00, '2020-01-01 08:30:00'),
                                                                                                            ('00000000-0000-0000-a007-000000000013', '00000000-0000-0000-a002-000000000013', 'Bachelor of Architecture', 'Undergraduate', 5.0, 200.00, '2020-01-01 08:30:00'),
                                                                                                            ('00000000-0000-0000-a007-000000000014', '00000000-0000-0000-a002-000000000014', 'B.Sc. in Biotechnology', 'Undergraduate', 4.0, 160.00, '2020-01-01 08:30:00'),
                                                                                                            ('00000000-0000-0000-a007-000000000015', '00000000-0000-0000-a002-000000000015', 'B.S.S. in Sociology', 'Undergraduate', 4.0, 120.00, '2020-01-01 08:30:00'),
                                                                                                            ('00000000-0000-0000-a007-000000000016', '00000000-0000-0000-a002-000000000016', 'B.S.S. in Psychology', 'Undergraduate', 4.0, 120.00, '2020-01-01 08:30:00'),
                                                                                                            ('00000000-0000-0000-a007-000000000017', '00000000-0000-0000-a002-000000000017', 'B.S.S. in Political Science', 'Undergraduate', 4.0, 120.00, '2020-01-01 08:30:00'),
                                                                                                            ('00000000-0000-0000-a007-000000000018', '00000000-0000-0000-a002-000000000018', 'B.Sc. in Textile Engineering', 'Undergraduate', 4.0, 160.00, '2020-01-01 08:30:00'),
                                                                                                            ('00000000-0000-0000-a007-000000000019', '00000000-0000-0000-a002-000000000019', 'B.Sc. in Software Engineering', 'Undergraduate', 4.0, 160.00, '2020-01-01 08:30:00'),
                                                                                                            ('00000000-0000-0000-a007-000000000020', '00000000-0000-0000-a002-000000000020', 'Bachelor of Marketing', 'Undergraduate', 4.0, 128.00, '2020-01-01 08:30:00');
-- 9. COURSES (Prefix: a008)
INSERT INTO courses (id, department_id, course_code, title, credit_hours, course_type, is_active, created_at, updated_at) VALUES
                                                                                                                              ('00000000-0000-0000-a008-000000000001', '00000000-0000-0000-a002-000000000001', 'CSE101', 'Structured Programming', 3.0, 'THEORY', TRUE, '2020-01-01 09:00:00', '2020-01-01 09:00:00'),
                                                                                                                              ('00000000-0000-0000-a008-000000000002', '00000000-0000-0000-a002-000000000001', 'CSE101L', 'Structured Programming Lab', 1.0, 'LAB', TRUE, '2020-01-01 09:00:00', '2020-01-01 09:00:00'),
                                                                                                                              ('00000000-0000-0000-a008-000000000003', '00000000-0000-0000-a002-000000000002', 'EEE101', 'Electrical Circuits I', 3.0, 'THEORY', TRUE, '2020-01-01 09:00:00', '2020-01-01 09:00:00'),
                                                                                                                              ('00000000-0000-0000-a008-000000000004', '00000000-0000-0000-a002-000000000003', 'MATH101', 'Differential Calculus', 3.0, 'THEORY', TRUE, '2020-01-01 09:00:00', '2020-01-01 09:00:00'),
                                                                                                                              ('00000000-0000-0000-a008-000000000005', '00000000-0000-0000-a002-000000000005', 'BUS101', 'Introduction to Business', 3.0, 'THEORY', TRUE, '2020-01-01 09:00:00', '2020-01-01 09:00:00'),
                                                                                                                              ('00000000-0000-0000-a008-000000000006', '00000000-0000-0000-a002-000000000001', 'CSE201', 'Data Structures', 3.0, 'THEORY', TRUE, '2021-01-01 09:00:00', '2021-01-01 09:00:00'),
                                                                                                                              ('00000000-0000-0000-a008-000000000007', '00000000-0000-0000-a002-000000000001', 'CSE301', 'Algorithms', 3.0, 'THEORY', TRUE, '2022-01-01 09:00:00', '2022-01-01 09:00:00'),
                                                                                                                              ('00000000-0000-0000-a008-000000000008', '00000000-0000-0000-a002-000000000001', 'CSE401', 'Database Management Systems', 3.0, 'THEORY', TRUE, '2023-01-01 09:00:00', '2023-01-01 09:00:00'),
                                                                                                                              ('00000000-0000-0000-a008-000000000009', '00000000-0000-0000-a002-000000000002', 'EEE201', 'Electronic Devices', 3.0, 'THEORY', TRUE, '2021-01-01 09:00:00', '2021-01-01 09:00:00'),
                                                                                                                              ('00000000-0000-0000-a008-000000000010', '00000000-0000-0000-a002-000000000006', 'CE101', 'Engineering Mechanics', 3.0, 'THEORY', TRUE, '2020-01-01 09:00:00', '2020-01-01 09:00:00'),
                                                                                                                              ('00000000-0000-0000-a008-000000000011', '00000000-0000-0000-a002-000000000007', 'ME101', 'Thermodynamics', 3.0, 'THEORY', TRUE, '2020-01-01 09:00:00', '2020-01-01 09:00:00'),
                                                                                                                              ('00000000-0000-0000-a008-000000000012', '00000000-0000-0000-a002-000000000008', 'ENG101', 'English Composition', 3.0, 'THEORY', TRUE, '2020-01-01 09:00:00', '2020-01-01 09:00:00'),
                                                                                                                              ('00000000-0000-0000-a008-000000000013', '00000000-0000-0000-a002-000000000009', 'ECO101', 'Microeconomics', 3.0, 'THEORY', TRUE, '2020-01-01 09:00:00', '2020-01-01 09:00:00'),
                                                                                                                              ('00000000-0000-0000-a008-000000000014', '00000000-0000-0000-a002-000000000010', 'CHEM101', 'General Chemistry', 3.0, 'THEORY', TRUE, '2020-01-01 09:00:00', '2020-01-01 09:00:00'),
                                                                                                                              ('00000000-0000-0000-a008-000000000015', '00000000-0000-0000-a002-000000000011', 'LAW101', 'History of Law', 3.0, 'THEORY', TRUE, '2020-01-01 09:00:00', '2020-01-01 09:00:00'),
                                                                                                                              ('00000000-0000-0000-a008-000000000016', '00000000-0000-0000-a002-000000000012', 'PHARM101', 'Inorganic Pharmacy', 3.0, 'THEORY', TRUE, '2020-01-01 09:00:00', '2020-01-01 09:00:00'),
                                                                                                                              ('00000000-0000-0000-a008-000000000017', '00000000-0000-0000-a002-000000000013', 'ARCH101', 'Design Fundamentals', 3.0, 'PROJECT', TRUE, '2020-01-01 09:00:00', '2020-01-01 09:00:00'),
                                                                                                                              ('00000000-0000-0000-a008-000000000018', '00000000-0000-0000-a002-000000000014', 'BIO101', 'Cell Biology', 3.0, 'THEORY', TRUE, '2020-01-01 09:00:00', '2020-01-01 09:00:00'),
                                                                                                                              ('00000000-0000-0000-a008-000000000019', '00000000-0000-0000-a002-000000000019', 'SWE101', 'Software Engineering Principles', 3.0, 'THEORY', TRUE, '2020-01-01 09:00:00', '2020-01-01 09:00:00'),
                                                                                                                              ('00000000-0000-0000-a008-000000000020', '00000000-0000-0000-a002-000000000020', 'MKT101', 'Principles of Marketing', 3.0, 'THEORY', TRUE, '2020-01-01 09:00:00', '2020-01-01 09:00:00');
-- 10. ACADEMIC_CALENDARS (Prefix: a009)
INSERT INTO academic_calendars (id, semester_id, academic_year, duration, created_at) VALUES
                                                                                          ('00000000-0000-0000-a009-000000000001', '00000000-0000-0000-a003-000000000001', 2024, '4.5 Months', '2023-11-01 00:00:00'),
                                                                                          ('00000000-0000-0000-a009-000000000002', '00000000-0000-0000-a003-000000000002', 2024, '4 Months', '2024-02-01 00:00:00'),
                                                                                          ('00000000-0000-0000-a009-000000000003', '00000000-0000-0000-a003-000000000003', 2024, '4 Months', '2024-06-01 00:00:00'),
                                                                                          ('00000000-0000-0000-a009-000000000004', '00000000-0000-0000-a003-000000000004', 2025, '4.5 Months', '2024-10-01 00:00:00'),
                                                                                          ('00000000-0000-0000-a009-000000000005', '00000000-0000-0000-a003-000000000005', 2025, '4 Months', '2025-02-01 00:00:00'),
                                                                                          ('00000000-0000-0000-a009-000000000006', '00000000-0000-0000-a003-000000000006', 2025, '4 Months', '2025-06-01 00:00:00'),
                                                                                          ('00000000-0000-0000-a009-000000000007', '00000000-0000-0000-a003-000000000007', 2022, '4.5 Months', '2021-10-01 00:00:00'),
                                                                                          ('00000000-0000-0000-a009-000000000008', '00000000-0000-0000-a003-000000000008', 2022, '4 Months', '2022-02-01 00:00:00'),
                                                                                          ('00000000-0000-0000-a009-000000000009', '00000000-0000-0000-a003-000000000009', 2022, '4 Months', '2022-06-01 00:00:00'),
                                                                                          ('00000000-0000-0000-a009-000000000010', '00000000-0000-0000-a003-000000000010', 2023, '4.5 Months', '2022-10-01 00:00:00'),
                                                                                          ('00000000-0000-0000-a009-000000000011', '00000000-0000-0000-a003-000000000011', 2023, '4 Months', '2023-02-01 00:00:00'),
                                                                                          ('00000000-0000-0000-a009-000000000012', '00000000-0000-0000-a003-000000000012', 2023, '4 Months', '2023-06-01 00:00:00'),
                                                                                          ('00000000-0000-0000-a009-000000000013', '00000000-0000-0000-a003-000000000013', 2026, '4.5 Months', '2025-10-01 00:00:00'),
                                                                                          ('00000000-0000-0000-a009-000000000014', '00000000-0000-0000-a003-000000000014', 2026, '4 Months', '2026-02-01 00:00:00'),
                                                                                          ('00000000-0000-0000-a009-000000000015', '00000000-0000-0000-a003-000000000015', 2026, '4 Months', '2026-06-01 00:00:00'),
                                                                                          ('00000000-0000-0000-a009-000000000016', '00000000-0000-0000-a003-000000000016', 2021, '4.5 Months', '2020-10-01 00:00:00'),
                                                                                          ('00000000-0000-0000-a009-000000000017', '00000000-0000-0000-a003-000000000017', 2021, '4 Months', '2021-02-01 00:00:00'),
                                                                                          ('00000000-0000-0000-a009-000000000018', '00000000-0000-0000-a003-000000000018', 2021, '4 Months', '2021-06-01 00:00:00'),
                                                                                          ('00000000-0000-0000-a009-000000000019', '00000000-0000-0000-a003-000000000019', 2020, '4.5 Months', '2019-10-01 00:00:00'),
                                                                                          ('00000000-0000-0000-a009-000000000020', '00000000-0000-0000-a003-000000000020', 2020, '4 Months', '2020-02-01 00:00:00');
-- 11. BATCHES (Prefix: b001)
INSERT INTO batches (id, batch_number, batch_initial, program_id, created_at) VALUES
                                                                                  ('00000000-0000-0000-b001-000000000001', '221', 'CSE-221', '00000000-0000-0000-a007-000000000001', '2022-01-01 00:00:00'),
                                                                                  ('00000000-0000-0000-b001-000000000002', '222', 'CSE-222', '00000000-0000-0000-a007-000000000001', '2022-06-01 00:00:00'),
                                                                                  ('00000000-0000-0000-b001-000000000003', '231', 'CSE-231', '00000000-0000-0000-a007-000000000001', '2023-01-01 00:00:00'),
                                                                                  ('00000000-0000-0000-b001-000000000004', '221', 'EEE-221', '00000000-0000-0000-a007-000000000002', '2022-01-01 00:00:00'),
                                                                                  ('00000000-0000-0000-b001-000000000005', '221', 'BBA-221', '00000000-0000-0000-a007-000000000005', '2022-01-01 00:00:00'),
                                                                                  ('00000000-0000-0000-b001-000000000006', '231', 'EEE-231', '00000000-0000-0000-a007-000000000002', '2023-01-01 00:00:00'),
                                                                                  ('00000000-0000-0000-b001-000000000007', '211', 'CSE-211', '00000000-0000-0000-a007-000000000001', '2021-01-01 00:00:00'),
                                                                                  ('00000000-0000-0000-b001-000000000008', '212', 'CSE-212', '00000000-0000-0000-a007-000000000001', '2021-06-01 00:00:00'),
                                                                                  ('00000000-0000-0000-b001-000000000009', '211', 'EEE-211', '00000000-0000-0000-a007-000000000002', '2021-01-01 00:00:00'),
                                                                                  ('00000000-0000-0000-b001-000000000010', '211', 'BBA-211', '00000000-0000-0000-a007-000000000005', '2021-01-01 00:00:00'),
                                                                                  ('00000000-0000-0000-b001-000000000011', '241', 'CSE-241', '00000000-0000-0000-a007-000000000001', '2024-01-01 00:00:00'),
                                                                                  ('00000000-0000-0000-b001-000000000012', '201', 'CSE-201', '00000000-0000-0000-a007-000000000001', '2020-01-01 00:00:00'),
                                                                                  ('00000000-0000-0000-b001-000000000013', '202', 'CSE-202', '00000000-0000-0000-a007-000000000001', '2020-06-01 00:00:00'),
                                                                                  ('00000000-0000-0000-b001-000000000014', '201', 'EEE-201', '00000000-0000-0000-a007-000000000002', '2020-01-01 00:00:00'),
                                                                                  ('00000000-0000-0000-b001-000000000015', '201', 'CE-201', '00000000-0000-0000-a007-000000000006', '2020-01-01 00:00:00'),
                                                                                  ('00000000-0000-0000-b001-000000000016', '191', 'CSE-191', '00000000-0000-0000-a007-000000000001', '2019-01-01 00:00:00'),
                                                                                  ('00000000-0000-0000-b001-000000000017', '192', 'CSE-192', '00000000-0000-0000-a007-000000000001', '2019-06-01 00:00:00'),
                                                                                  ('00000000-0000-0000-b001-000000000018', '241', 'EEE-241', '00000000-0000-0000-a007-000000000002', '2024-01-01 00:00:00'),
                                                                                  ('00000000-0000-0000-b001-000000000019', '241', 'BBA-241', '00000000-0000-0000-a007-000000000005', '2024-01-01 00:00:00'),
                                                                                  ('00000000-0000-0000-b001-000000000020', '232', 'CSE-232', '00000000-0000-0000-a007-000000000001', '2023-06-01 00:00:00');
-- 12. CALENDAR_EVENTS (Prefix: b002)
INSERT INTO calendar_events (id, calendar_id, title, date_value, order_index) VALUES
                                                                                  ('00000000-0000-0000-b002-000000000001', '00000000-0000-0000-a009-000000000001', 'Orientation Program', 'Jan 05, 2024', 1),
                                                                                  ('00000000-0000-0000-b002-000000000002', '00000000-0000-0000-a009-000000000001', 'Classes Begin', 'Jan 07, 2024', 2),
                                                                                  ('00000000-0000-0000-b002-000000000003', '00000000-0000-0000-a009-000000000001', 'Midterm Exams', 'Feb 25 - Mar 05', 3),
                                                                                  ('00000000-0000-0000-b002-000000000004', '00000000-0000-0000-a009-000000000001', 'Spring Break', 'Mar 25 - Mar 31', 4),
                                                                                  ('00000000-0000-0000-b002-000000000005', '00000000-0000-0000-a009-000000000001', 'Final Exams', 'May 05 - May 15', 5),
                                                                                  ('00000000-0000-0000-b002-000000000006', '00000000-0000-0000-a009-000000000002', 'Orientation Program', 'May 22, 2024', 1),
                                                                                  ('00000000-0000-0000-b002-000000000007', '00000000-0000-0000-a009-000000000002', 'Classes Begin', 'May 25, 2024', 2),
                                                                                  ('00000000-0000-0000-b002-000000000008', '00000000-0000-0000-a009-000000000002', 'Midterm Exams', 'Jul 15 - Jul 25', 3),
                                                                                  ('00000000-0000-0000-b002-000000000009', '00000000-0000-0000-a009-000000000002', 'Final Exams', 'Sep 05 - Sep 15', 4),
                                                                                  ('00000000-0000-0000-b002-000000000010', '00000000-0000-0000-a009-000000000003', 'Orientation', 'Sep 25, 2024', 1),
                                                                                  ('00000000-0000-0000-b002-000000000011', '00000000-0000-0000-a009-000000000003', 'Classes Begin', 'Sep 28, 2024', 2),
                                                                                  ('00000000-0000-0000-b002-000000000012', '00000000-0000-0000-a009-000000000003', 'Midterm', 'Nov 10 - Nov 20', 3),
                                                                                  ('00000000-0000-0000-b002-000000000013', '00000000-0000-0000-a009-000000000003', 'Finals', 'Jan 05 - Jan 15, 2025', 4),
                                                                                  ('00000000-0000-0000-b002-000000000014', '00000000-0000-0000-a009-000000000004', 'Orientation', 'Jan 05, 2025', 1),
                                                                                  ('00000000-0000-0000-b002-000000000015', '00000000-0000-0000-a009-000000000004', 'Classes Begin', 'Jan 08, 2025', 2),
                                                                                  ('00000000-0000-0000-b002-000000000016', '00000000-0000-0000-a009-000000000004', 'Midterm', 'Feb 25 - Mar 05', 3),
                                                                                  ('00000000-0000-0000-b002-000000000017', '00000000-0000-0000-a009-000000000004', 'Finals', 'May 05 - May 15', 4),
                                                                                  ('00000000-0000-0000-b002-000000000018', '00000000-0000-0000-a009-000000000005', 'Classes Start', 'May 25, 2025', 1),
                                                                                  ('00000000-0000-0000-b002-000000000019', '00000000-0000-0000-a009-000000000005', 'Midterm', 'Jul 15', 2),
                                                                                  ('00000000-0000-0000-b002-000000000020', '00000000-0000-0000-a009-000000000005', 'Finals', 'Sep 10', 3);
-- 13. SECTIONS (Prefix: b003)
INSERT INTO sections (id, name, batch_id, created_at) VALUES
                                                          ('00000000-0000-0000-b003-000000000001', 'A', '00000000-0000-0000-b001-000000000001', '2022-01-01 00:00:00'),
                                                          ('00000000-0000-0000-b003-000000000002', 'B', '00000000-0000-0000-b001-000000000001', '2022-01-01 00:00:00'),
                                                          ('00000000-0000-0000-b003-000000000003', 'A', '00000000-0000-0000-b001-000000000002', '2022-06-01 00:00:00'),
                                                          ('00000000-0000-0000-b003-000000000004', 'B', '00000000-0000-0000-b001-000000000002', '2022-06-01 00:00:00'),
                                                          ('00000000-0000-0000-b003-000000000005', 'A', '00000000-0000-0000-b001-000000000003', '2023-01-01 00:00:00'),
                                                          ('00000000-0000-0000-b003-000000000006', 'A', '00000000-0000-0000-b001-000000000004', '2022-01-01 00:00:00'),
                                                          ('00000000-0000-0000-b003-000000000007', 'A', '00000000-0000-0000-b001-000000000005', '2022-01-01 00:00:00'),
                                                          ('00000000-0000-0000-b003-000000000008', 'A', '00000000-0000-0000-b001-000000000007', '2021-01-01 00:00:00'),
                                                          ('00000000-0000-0000-b003-000000000009', 'B', '00000000-0000-0000-b001-000000000007', '2021-01-01 00:00:00'),
                                                          ('00000000-0000-0000-b003-000000000010', 'A', '00000000-0000-0000-b001-000000000011', '2024-01-01 00:00:00'),
                                                          ('00000000-0000-0000-b003-000000000011', 'B', '00000000-0000-0000-b001-000000000011', '2024-01-01 00:00:00'),
                                                          ('00000000-0000-0000-b003-000000000012', 'A', '00000000-0000-0000-b001-000000000012', '2020-01-01 00:00:00'),
                                                          ('00000000-0000-0000-b003-000000000013', 'A', '00000000-0000-0000-b001-000000000016', '2019-01-01 00:00:00'),
                                                          ('00000000-0000-0000-b003-000000000014', 'A', '00000000-0000-0000-b001-000000000018', '2024-01-01 00:00:00'),
                                                          ('00000000-0000-0000-b003-000000000015', 'A', '00000000-0000-0000-b001-000000000019', '2024-01-01 00:00:00'),
                                                          ('00000000-0000-0000-b003-000000000016', 'C', '00000000-0000-0000-b001-000000000001', '2022-01-01 00:00:00'),
                                                          ('00000000-0000-0000-b003-000000000017', 'C', '00000000-0000-0000-b001-000000000002', '2022-06-01 00:00:00'),
                                                          ('00000000-0000-0000-b003-000000000018', 'B', '00000000-0000-0000-b001-000000000003', '2023-01-01 00:00:00'),
                                                          ('00000000-0000-0000-b003-000000000019', 'B', '00000000-0000-0000-b001-000000000004', '2022-01-01 00:00:00'),
                                                          ('00000000-0000-0000-b003-000000000020', 'B', '00000000-0000-0000-b001-000000000005', '2022-01-01 00:00:00');
-- 14. BATCH_SEMESTER_FEES (Prefix: b004)
INSERT INTO batch_semester_fees (id, batch_id, semester_id, registration_fee, created_at) VALUES
                                                                                              ('00000000-0000-0000-b004-000000000001', '00000000-0000-0000-b001-000000000001', '00000000-0000-0000-a003-000000000001', 15000.00, '2023-11-01 00:00:00'),
                                                                                              ('00000000-0000-0000-b004-000000000002', '00000000-0000-0000-b001-000000000001', '00000000-0000-0000-a003-000000000002', 15000.00, '2024-02-01 00:00:00'),
                                                                                              ('00000000-0000-0000-b004-000000000003', '00000000-0000-0000-b001-000000000001', '00000000-0000-0000-a003-000000000003', 15000.00, '2024-06-01 00:00:00'),
                                                                                              ('00000000-0000-0000-b004-000000000004', '00000000-0000-0000-b001-000000000002', '00000000-0000-0000-a003-000000000001', 16000.00, '2023-11-01 00:00:00'),
                                                                                              ('00000000-0000-0000-b004-000000000005', '00000000-0000-0000-b001-000000000003', '00000000-0000-0000-a003-000000000001', 17000.00, '2023-11-01 00:00:00'),
                                                                                              ('00000000-0000-0000-b004-000000000006', '00000000-0000-0000-b001-000000000004', '00000000-0000-0000-a003-000000000001', 15000.00, '2023-11-01 00:00:00'),
                                                                                              ('00000000-0000-0000-b004-000000000007', '00000000-0000-0000-b001-000000000005', '00000000-0000-0000-a003-000000000001', 14000.00, '2023-11-01 00:00:00'),
                                                                                              ('00000000-0000-0000-b004-000000000008', '00000000-0000-0000-b001-000000000007', '00000000-0000-0000-a003-000000000001', 13000.00, '2023-11-01 00:00:00'),
                                                                                              ('00000000-0000-0000-b004-000000000009', '00000000-0000-0000-b001-000000000011', '00000000-0000-0000-a003-000000000001', 18000.00, '2023-11-01 00:00:00'),
                                                                                              ('00000000-0000-0000-b004-000000000010', '00000000-0000-0000-b001-000000000012', '00000000-0000-0000-a003-000000000001', 12000.00, '2023-11-01 00:00:00'),
                                                                                              ('00000000-0000-0000-b004-000000000011', '00000000-0000-0000-b001-000000000016', '00000000-0000-0000-a003-000000000001', 10000.00, '2023-11-01 00:00:00'),
                                                                                              ('00000000-0000-0000-b004-000000000012', '00000000-0000-0000-b001-000000000018', '00000000-0000-0000-a003-000000000001', 15500.00, '2023-11-01 00:00:00'),
                                                                                              ('00000000-0000-0000-b004-000000000013', '00000000-0000-0000-b001-000000000019', '00000000-0000-0000-a003-000000000001', 14500.00, '2023-11-01 00:00:00'),
                                                                                              ('00000000-0000-0000-b004-000000000014', '00000000-0000-0000-b001-000000000001', '00000000-0000-0000-a003-000000000004', 15000.00, '2024-10-01 00:00:00'),
                                                                                              ('00000000-0000-0000-b004-000000000015', '00000000-0000-0000-b001-000000000001', '00000000-0000-0000-a003-000000000005', 15000.00, '2025-02-01 00:00:00'),
                                                                                              ('00000000-0000-0000-b004-000000000016', '00000000-0000-0000-b001-000000000002', '00000000-0000-0000-a003-000000000002', 16000.00, '2024-02-01 00:00:00'),
                                                                                              ('00000000-0000-0000-b004-000000000017', '00000000-0000-0000-b001-000000000003', '00000000-0000-0000-a003-000000000002', 17000.00, '2024-02-01 00:00:00'),
                                                                                              ('00000000-0000-0000-b004-000000000018', '00000000-0000-0000-b001-000000000004', '00000000-0000-0000-a003-000000000002', 15000.00, '2024-02-01 00:00:00'),
                                                                                              ('00000000-0000-0000-b004-000000000019', '00000000-0000-0000-b001-000000000005', '00000000-0000-0000-a003-000000000002', 14000.00, '2024-02-01 00:00:00'),
                                                                                              ('00000000-0000-0000-b004-000000000020', '00000000-0000-0000-b001-000000000007', '00000000-0000-0000-a003-000000000002', 13000.00, '2024-02-01 00:00:00');
-- 15. STUDENTS (Prefix: b005) - 20 rows
-- Linked to users a001-0004/0005/0008/0010/0011/0012/0014-0027
-- advisor_id -> faculty (a006), batch_id -> batches (b001),
-- section_id -> sections (b003), guardian_id -> guardians (a004),
-- program_id -> programs (a007).
-- section_id is NULL where the batch has no section defined (EEE-231, EEE-211, CE-201).
INSERT INTO students (
    id, user_id, program_id, advisor_id, batch_id, section_id, guardian_id,
    student_id, registration_no, current_semester, is_registration_cleared,
    has_received_laptop, status, admitted_at, created_at
) VALUES
      ('00000000-0000-0000-b005-000000000001', '00000000-0000-0000-a001-000000000004', '00000000-0000-0000-a007-000000000001', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000001', '00000000-0000-0000-b003-000000000001', '00000000-0000-0000-a004-000000000001', '221-101-001', 'REG-221-001', 1, FALSE, FALSE, 'ACTIVE', '2022-01-10', '2022-01-10 14:00:00'),
      ('00000000-0000-0000-b005-000000000002', '00000000-0000-0000-a001-000000000005', '00000000-0000-0000-a007-000000000001', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000001', '00000000-0000-0000-b003-000000000002', '00000000-0000-0000-a004-000000000002', '221-101-002', 'REG-221-002', 1, FALSE, FALSE, 'ACTIVE', '2022-01-10', '2022-01-10 14:05:00'),
      ('00000000-0000-0000-b005-000000000003', '00000000-0000-0000-a001-000000000008', '00000000-0000-0000-a007-000000000002', '00000000-0000-0000-a006-000000000002', '00000000-0000-0000-b001-000000000004', '00000000-0000-0000-b003-000000000006', '00000000-0000-0000-a004-000000000003', '221-102-001', 'REG-221-102', 1, FALSE, FALSE, 'ACTIVE', '2022-01-12', '2022-01-12 10:00:00'),
      ('00000000-0000-0000-b005-000000000004', '00000000-0000-0000-a001-000000000010', '00000000-0000-0000-a007-000000000005', '00000000-0000-0000-a006-000000000006', '00000000-0000-0000-b001-000000000005', '00000000-0000-0000-b003-000000000007', '00000000-0000-0000-a004-000000000004', '221-301-001', 'REG-221-301', 1, FALSE, FALSE, 'ACTIVE', '2022-01-15', '2022-01-15 09:00:00'),
      ('00000000-0000-0000-b005-000000000005', '00000000-0000-0000-a001-000000000011', '00000000-0000-0000-a007-000000000001', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000001', '00000000-0000-0000-b003-000000000001', '00000000-0000-0000-a004-000000000005', '221-101-003', 'REG-221-003', 1, FALSE, FALSE, 'ACTIVE', '2022-01-15', '2022-01-15 10:00:00'),
      ('00000000-0000-0000-b005-000000000006', '00000000-0000-0000-a001-000000000012', '00000000-0000-0000-a007-000000000001', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000002', '00000000-0000-0000-b003-000000000003', '00000000-0000-0000-a004-000000000006', '222-101-001', 'REG-222-001', 1, FALSE, FALSE, 'ACTIVE', '2022-01-15', '2022-01-15 11:00:00'),
      ('00000000-0000-0000-b005-000000000007', '00000000-0000-0000-a001-000000000014', '00000000-0000-0000-a007-000000000001', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000001', '00000000-0000-0000-b003-000000000016', '00000000-0000-0000-a004-000000000007', '221-101-004', 'REG-221-004', 1, FALSE, FALSE, 'ACTIVE', '2022-01-16', '2022-01-16 09:00:00'),
      ('00000000-0000-0000-b005-000000000008', '00000000-0000-0000-a001-000000000015', '00000000-0000-0000-a007-000000000001', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000003', '00000000-0000-0000-b003-000000000005', '00000000-0000-0000-a004-000000000008', '231-101-001', 'REG-231-001', 1, FALSE, FALSE, 'ACTIVE', '2022-01-16', '2022-01-16 10:00:00'),
      ('00000000-0000-0000-b005-000000000009', '00000000-0000-0000-a001-000000000016', '00000000-0000-0000-a007-000000000001', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000003', '00000000-0000-0000-b003-000000000018', '00000000-0000-0000-a004-000000000009', '231-101-002', 'REG-231-002', 1, FALSE, FALSE, 'ACTIVE', '2022-01-16', '2022-01-16 11:00:00'),
      ('00000000-0000-0000-b005-000000000010', '00000000-0000-0000-a001-000000000017', '00000000-0000-0000-a007-000000000002', '00000000-0000-0000-a006-000000000002', '00000000-0000-0000-b001-000000000006', NULL, '00000000-0000-0000-a004-000000000010', '231-102-001', 'REG-231-102', 1, FALSE, FALSE, 'ACTIVE', '2022-01-17', '2022-01-17 09:00:00'),
      ('00000000-0000-0000-b005-000000000011', '00000000-0000-0000-a001-000000000018', '00000000-0000-0000-a007-000000000001', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000011', '00000000-0000-0000-b003-000000000010', '00000000-0000-0000-a004-000000000011', '241-101-001', 'REG-241-001', 1, FALSE, FALSE, 'ACTIVE', '2022-01-17', '2022-01-17 10:00:00'),
      ('00000000-0000-0000-b005-000000000012', '00000000-0000-0000-a001-000000000019', '00000000-0000-0000-a007-000000000002', '00000000-0000-0000-a006-000000000002', '00000000-0000-0000-b001-000000000018', '00000000-0000-0000-b003-000000000014', '00000000-0000-0000-a004-000000000012', '241-102-001', 'REG-241-102', 1, FALSE, FALSE, 'ACTIVE', '2022-01-17', '2022-01-17 11:00:00'),
      ('00000000-0000-0000-b005-000000000013', '00000000-0000-0000-a001-000000000020', '00000000-0000-0000-a007-000000000005', '00000000-0000-0000-a006-000000000006', '00000000-0000-0000-b001-000000000019', '00000000-0000-0000-b003-000000000015', '00000000-0000-0000-a004-000000000013', '241-301-001', 'REG-241-301', 1, FALSE, FALSE, 'ACTIVE', '2022-01-18', '2022-01-18 09:00:00'),
      ('00000000-0000-0000-b005-000000000014', '00000000-0000-0000-a001-000000000021', '00000000-0000-0000-a007-000000000001', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000007', '00000000-0000-0000-b003-000000000008', '00000000-0000-0000-a004-000000000014', '211-101-001', 'REG-211-001', 8, FALSE, FALSE, 'ACTIVE', '2021-01-10', '2021-01-08 09:00:00'),
      ('00000000-0000-0000-b005-000000000015', '00000000-0000-0000-a001-000000000022', '00000000-0000-0000-a007-000000000002', '00000000-0000-0000-a006-000000000002', '00000000-0000-0000-b001-000000000009', NULL, '00000000-0000-0000-a004-000000000015', '211-102-001', 'REG-211-102', 8, FALSE, FALSE, 'ACTIVE', '2021-01-12', '2021-01-09 09:00:00'),
      ('00000000-0000-0000-b005-000000000016', '00000000-0000-0000-a001-000000000023', '00000000-0000-0000-a007-000000000001', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000012', '00000000-0000-0000-b003-000000000012', '00000000-0000-0000-a004-000000000016', '201-101-001', 'REG-201-001', 8, FALSE, FALSE, 'ACTIVE', '2020-01-10', '2020-01-08 09:00:00'),
      ('00000000-0000-0000-b005-000000000017', '00000000-0000-0000-a001-000000000024', '00000000-0000-0000-a007-000000000001', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000016', '00000000-0000-0000-b003-000000000013', '00000000-0000-0000-a004-000000000017', '191-101-001', 'REG-191-001', 8, FALSE, FALSE, 'GRADUATED', '2019-01-10', '2019-01-08 09:00:00'),
      ('00000000-0000-0000-b005-000000000018', '00000000-0000-0000-a001-000000000025', '00000000-0000-0000-a007-000000000006', '00000000-0000-0000-a006-000000000007', '00000000-0000-0000-b001-000000000015', NULL, '00000000-0000-0000-a004-000000000018', '201-103-001', 'REG-201-103', 8, FALSE, FALSE, 'GRADUATED', '2020-01-15', '2020-01-09 10:00:00'),
      ('00000000-0000-0000-b005-000000000019', '00000000-0000-0000-a001-000000000026', '00000000-0000-0000-a007-000000000005', '00000000-0000-0000-a006-000000000006', '00000000-0000-0000-b001-000000000019', '00000000-0000-0000-b003-000000000015', '00000000-0000-0000-a004-000000000019', '241-301-002', 'REG-241-302', 2, FALSE, FALSE, 'ACTIVE', '2024-01-10', '2024-01-08 09:00:00'),
      ('00000000-0000-0000-b005-000000000020', '00000000-0000-0000-a001-000000000027', '00000000-0000-0000-a007-000000000002', '00000000-0000-0000-a006-000000000002', '00000000-0000-0000-b001-000000000018', '00000000-0000-0000-b003-000000000014', '00000000-0000-0000-a004-000000000020', '241-102-002', 'REG-241-103', 2, FALSE, FALSE, 'ACTIVE', '2024-01-12', '2024-01-08 10:00:00');
-- 16. COURSE_OFFERINGS (Prefix: b006)
-- course_id -> courses (a008), semester_id -> semesters (a003),
-- faculty_id -> faculty (a006), batch_id -> batches (b001), section_id -> sections (b003)
INSERT INTO course_offerings (
    id, course_id, semester_id, faculty_id, batch_id, section_id,
    schedule_info, seat_limit, is_results_approved, created_at
) VALUES
      ('00000000-0000-0000-b006-000000000001', '00000000-0000-0000-a008-000000000001', '00000000-0000-0000-a003-000000000001', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000001', '00000000-0000-0000-b003-000000000001', 'Sun 10:00 AM - 11:30 AM', 40, FALSE, '2023-12-01 00:00:00'),
      ('00000000-0000-0000-b006-000000000002', '00000000-0000-0000-a008-000000000001', '00000000-0000-0000-a003-000000000001', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000001', '00000000-0000-0000-b003-000000000002', 'Mon 10:00 AM - 11:30 AM', 40, FALSE, '2023-12-01 00:00:00'),
      ('00000000-0000-0000-b006-000000000003', '00000000-0000-0000-a008-000000000002', '00000000-0000-0000-a003-000000000001', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000001', '00000000-0000-0000-b003-000000000001', 'Tue 02:00 PM - 05:00 PM', 40, FALSE, '2023-12-01 00:00:00'),
      ('00000000-0000-0000-b006-000000000004', '00000000-0000-0000-a008-000000000003', '00000000-0000-0000-a003-000000000001', '00000000-0000-0000-a006-000000000002', '00000000-0000-0000-b001-000000000004', '00000000-0000-0000-b003-000000000006', 'Wed 08:30 AM - 10:00 AM', 40, FALSE, '2023-12-01 00:00:00'),
      ('00000000-0000-0000-b006-000000000005', '00000000-0000-0000-a008-000000000004', '00000000-0000-0000-a003-000000000001', '00000000-0000-0000-a006-000000000003', '00000000-0000-0000-b001-000000000001', '00000000-0000-0000-b003-000000000001', 'Thu 11:30 AM - 01:00 PM', 40, FALSE, '2023-12-01 00:00:00'),
      ('00000000-0000-0000-b006-000000000006', '00000000-0000-0000-a008-000000000005', '00000000-0000-0000-a003-000000000001', '00000000-0000-0000-a006-000000000006', '00000000-0000-0000-b001-000000000005', '00000000-0000-0000-b003-000000000007', 'Sun 01:00 PM - 02:30 PM', 40, FALSE, '2023-12-01 00:00:00'),
      ('00000000-0000-0000-b006-000000000007', '00000000-0000-0000-a008-000000000001', '00000000-0000-0000-a003-000000000002', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000003', '00000000-0000-0000-b003-000000000005', 'Sun 10:00 AM - 11:30 AM', 40, FALSE, '2024-05-01 00:00:00'),
      ('00000000-0000-0000-b006-000000000008', '00000000-0000-0000-a008-000000000003', '00000000-0000-0000-a003-000000000002', '00000000-0000-0000-a006-000000000002', '00000000-0000-0000-b001-000000000006', NULL, 'Mon 10:00 AM - 11:30 AM', 40, FALSE, '2024-05-01 00:00:00'),
      ('00000000-0000-0000-b006-000000000009', '00000000-0000-0000-a008-000000000006', '00000000-0000-0000-a003-000000000001', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000007', '00000000-0000-0000-b003-000000000008', 'Tue 10:00 AM - 11:30 AM', 40, FALSE, '2023-12-01 00:00:00'),
      ('00000000-0000-0000-b006-000000000010', '00000000-0000-0000-a008-000000000007', '00000000-0000-0000-a003-000000000001', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000012', '00000000-0000-0000-b003-000000000012', 'Wed 10:00 AM - 11:30 AM', 40, FALSE, '2023-12-01 00:00:00'),
      ('00000000-0000-0000-b006-000000000011', '00000000-0000-0000-a008-000000000008', '00000000-0000-0000-a003-000000000001', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000016', '00000000-0000-0000-b003-000000000013', 'Thu 10:00 AM - 11:30 AM', 40, FALSE, '2023-12-01 00:00:00'),
      ('00000000-0000-0000-b006-000000000012', '00000000-0000-0000-a008-000000000010', '00000000-0000-0000-a003-000000000001', '00000000-0000-0000-a006-000000000007', '00000000-0000-0000-b001-000000000015', NULL, 'Sun 08:30 AM - 10:00 AM', 40, FALSE, '2023-12-01 00:00:00'),
      ('00000000-0000-0000-b006-000000000013', '00000000-0000-0000-a008-000000000001', '00000000-0000-0000-a003-000000000010', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000001', '00000000-0000-0000-b003-000000000001', 'Sun 10:00 AM', 40, FALSE, '2022-12-01 00:00:00'),
      ('00000000-0000-0000-b006-000000000014', '00000000-0000-0000-a008-000000000002', '00000000-0000-0000-a003-000000000010', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000001', '00000000-0000-0000-b003-000000000001', 'Tue 02:00 PM', 40, FALSE, '2022-12-01 00:00:00'),
      ('00000000-0000-0000-b006-000000000015', '00000000-0000-0000-a008-000000000003', '00000000-0000-0000-a003-000000000010', '00000000-0000-0000-a006-000000000002', '00000000-0000-0000-b001-000000000004', '00000000-0000-0000-b003-000000000006', 'Wed 08:30 AM', 40, FALSE, '2022-12-01 00:00:00'),
      ('00000000-0000-0000-b006-000000000016', '00000000-0000-0000-a008-000000000004', '00000000-0000-0000-a003-000000000010', '00000000-0000-0000-a006-000000000003', '00000000-0000-0000-b001-000000000001', '00000000-0000-0000-b003-000000000001', 'Thu 11:30 AM', 40, FALSE, '2022-12-01 00:00:00'),
      ('00000000-0000-0000-b006-000000000017', '00000000-0000-0000-a008-000000000001', '00000000-0000-0000-a003-000000000007', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000012', '00000000-0000-0000-b003-000000000012', 'Sun 10:00 AM', 40, FALSE, '2021-12-01 00:00:00'),
      ('00000000-0000-0000-b006-000000000018', '00000000-0000-0000-a008-000000000001', '00000000-0000-0000-a003-000000000016', '00000000-0000-0000-a006-000000000001', '00000000-0000-0000-b001-000000000016', '00000000-0000-0000-b003-000000000013', 'Sun 10:00 AM', 40, FALSE, '2020-12-01 00:00:00'),
      ('00000000-0000-0000-b006-000000000019', '00000000-0000-0000-a008-000000000003', '00000000-0000-0000-a003-000000000016', '00000000-0000-0000-a006-000000000002', '00000000-0000-0000-b001-000000000014', NULL, 'Mon 10:00 AM', 40, FALSE, '2020-12-01 00:00:00'),
      ('00000000-0000-0000-b006-000000000020', '00000000-0000-0000-a008-000000000010', '00000000-0000-0000-a003-000000000016', '00000000-0000-0000-a006-000000000007', '00000000-0000-0000-b001-000000000015', NULL, 'Tue 10:00 AM', 40, FALSE, '2020-12-01 00:00:00');
-- 17. ENROLLMENTS (Prefix: b007)
-- student_id -> students (b005), offering_id -> course_offerings (b006)
INSERT INTO enrollments (id, student_id, offering_id, enrolled_at) VALUES
                                                                       ('00000000-0000-0000-b007-000000000001', '00000000-0000-0000-b005-000000000001', '00000000-0000-0000-b006-000000000001', '2023-12-26 10:00:00'),
                                                                       ('00000000-0000-0000-b007-000000000002', '00000000-0000-0000-b005-000000000001', '00000000-0000-0000-b006-000000000003', '2023-12-26 10:05:00'),
                                                                       ('00000000-0000-0000-b007-000000000003', '00000000-0000-0000-b005-000000000001', '00000000-0000-0000-b006-000000000005', '2023-12-26 10:10:00'),
                                                                       ('00000000-0000-0000-b007-000000000004', '00000000-0000-0000-b005-000000000002', '00000000-0000-0000-b006-000000000002', '2023-12-26 11:00:00'),
                                                                       ('00000000-0000-0000-b007-000000000005', '00000000-0000-0000-b005-000000000003', '00000000-0000-0000-b006-000000000004', '2023-12-26 12:00:00'),
                                                                       ('00000000-0000-0000-b007-000000000006', '00000000-0000-0000-b005-000000000004', '00000000-0000-0000-b006-000000000006', '2023-12-26 13:00:00'),
                                                                       ('00000000-0000-0000-b007-000000000007', '00000000-0000-0000-b005-000000000005', '00000000-0000-0000-b006-000000000001', '2023-12-26 14:00:00'),
                                                                       ('00000000-0000-0000-b007-000000000008', '00000000-0000-0000-b005-000000000014', '00000000-0000-0000-b006-000000000009', '2023-12-26 15:00:00'),
                                                                       ('00000000-0000-0000-b007-000000000009', '00000000-0000-0000-b005-000000000016', '00000000-0000-0000-b006-000000000010', '2023-12-26 16:00:00'),
                                                                       ('00000000-0000-0000-b007-000000000010', '00000000-0000-0000-b005-000000000017', '00000000-0000-0000-b006-000000000011', '2023-12-26 17:00:00'),
                                                                       ('00000000-0000-0000-b007-000000000011', '00000000-0000-0000-b005-000000000018', '00000000-0000-0000-b006-000000000012', '2023-12-26 18:00:00'),
                                                                       ('00000000-0000-0000-b007-000000000012', '00000000-0000-0000-b005-000000000006', '00000000-0000-0000-b006-000000000007', '2024-05-11 10:00:00'),
                                                                       ('00000000-0000-0000-b007-000000000013', '00000000-0000-0000-b005-000000000010', '00000000-0000-0000-b006-000000000008', '2024-05-11 11:00:00'),
                                                                       ('00000000-0000-0000-b007-000000000014', '00000000-0000-0000-b005-000000000001', '00000000-0000-0000-b006-000000000013', '2022-12-26 10:00:00'),
                                                                       ('00000000-0000-0000-b007-000000000015', '00000000-0000-0000-b005-000000000001', '00000000-0000-0000-b006-000000000014', '2022-12-26 10:05:00'),
                                                                       ('00000000-0000-0000-b007-000000000016', '00000000-0000-0000-b005-000000000003', '00000000-0000-0000-b006-000000000015', '2022-12-26 10:10:00'),
                                                                       ('00000000-0000-0000-b007-000000000017', '00000000-0000-0000-b005-000000000005', '00000000-0000-0000-b006-000000000013', '2022-12-26 10:15:00'),
                                                                       ('00000000-0000-0000-b007-000000000018', '00000000-0000-0000-b005-000000000016', '00000000-0000-0000-b006-000000000017', '2021-12-26 10:00:00'),
                                                                       ('00000000-0000-0000-b007-000000000019', '00000000-0000-0000-b005-000000000017', '00000000-0000-0000-b006-000000000018', '2020-12-26 10:00:00'),
                                                                       ('00000000-0000-0000-b007-000000000020', '00000000-0000-0000-b005-000000000018', '00000000-0000-0000-b006-000000000020', '2020-12-26 10:05:00');
-- 18. EXAMS (Prefix: b008)
-- offering_id -> course_offerings (b006)
INSERT INTO exams (id, offering_id, exam_type, title, exam_date, total_marks, weight_percent, created_at) VALUES
                                                                                                              ('00000000-0000-0000-b008-000000000001', '00000000-0000-0000-b006-000000000001', 'MIDTERM', 'Midterm Spring 24', '2024-03-01', 50.00, 30.00, '2024-01-10 09:00:00'),
                                                                                                              ('00000000-0000-0000-b008-000000000002', '00000000-0000-0000-b006-000000000001', 'FINAL', 'Final Spring 24', '2024-05-10', 100.00, 40.00, '2024-01-10 09:00:00'),
                                                                                                              ('00000000-0000-0000-b008-000000000003', '00000000-0000-0000-b006-000000000001', 'QUIZ', 'Quiz 1', '2024-02-10', 20.00, 10.00, '2024-01-10 09:00:00'),
                                                                                                              ('00000000-0000-0000-b008-000000000004', '00000000-0000-0000-b006-000000000001', 'ASSIGNMENT', 'Assignment 1', '2024-04-10', 10.00, 10.00, '2024-01-10 09:00:00'),
                                                                                                              ('00000000-0000-0000-b008-000000000005', '00000000-0000-0000-b006-000000000001', 'ATTENDANCE', 'Attendance Marks', '2024-05-15', 10.00, 10.00, '2024-01-10 09:00:00'),
                                                                                                              ('00000000-0000-0000-b008-000000000006', '00000000-0000-0000-b006-000000000003', 'LAB_EVALUATION', 'Lab Final', '2024-05-12', 100.00, 50.00, '2024-01-10 09:00:00'),
                                                                                                              ('00000000-0000-0000-b008-000000000007', '00000000-0000-0000-b006-000000000004', 'MIDTERM', 'Midterm EEE', '2024-03-02', 50.00, 30.00, '2024-01-10 09:00:00'),
                                                                                                              ('00000000-0000-0000-b008-000000000008', '00000000-0000-0000-b006-000000000004', 'FINAL', 'Final EEE', '2024-05-11', 100.00, 40.00, '2024-01-10 09:00:00'),
                                                                                                              ('00000000-0000-0000-b008-000000000009', '00000000-0000-0000-b006-000000000006', 'PROJECT_SHOW', 'Project Presentation', '2024-05-14', 100.00, 50.00, '2024-01-10 09:00:00'),
                                                                                                              ('00000000-0000-0000-b008-000000000010', '00000000-0000-0000-b006-000000000007', 'MIDTERM', 'Midterm Summer 24', '2024-07-20', 50.00, 30.00, '2024-06-10 09:00:00'),
                                                                                                              ('00000000-0000-0000-b008-000000000011', '00000000-0000-0000-b006-000000000007', 'FINAL', 'Final Summer 24', '2024-09-10', 100.00, 40.00, '2024-06-10 09:00:00'),
                                                                                                              ('00000000-0000-0000-b008-000000000012', '00000000-0000-0000-b006-000000000013', 'FINAL', 'Final Spring 23', '2023-05-10', 100.00, 50.00, '2023-01-10 09:00:00'),
                                                                                                              ('00000000-0000-0000-b008-000000000013', '00000000-0000-0000-b006-000000000014', 'LAB_EVALUATION', 'Lab Spring 23', '2023-05-11', 100.00, 50.00, '2023-01-10 09:00:00'),
                                                                                                              ('00000000-0000-0000-b008-000000000014', '00000000-0000-0000-b006-000000000015', 'FINAL', 'Final Spring 23', '2023-05-12', 100.00, 50.00, '2023-01-10 09:00:00'),
                                                                                                              ('00000000-0000-0000-b008-000000000015', '00000000-0000-0000-b006-000000000017', 'FINAL', 'Final Spring 22', '2022-05-10', 100.00, 50.00, '2022-01-10 09:00:00'),
                                                                                                              ('00000000-0000-0000-b008-000000000016', '00000000-0000-0000-b006-000000000018', 'FINAL', 'Final Spring 21', '2021-05-10', 100.00, 50.00, '2021-01-10 09:00:00'),
                                                                                                              ('00000000-0000-0000-b008-000000000017', '00000000-0000-0000-b006-000000000019', 'FINAL', 'Final Spring 21', '2021-05-11', 100.00, 50.00, '2021-01-10 09:00:00'),
                                                                                                              ('00000000-0000-0000-b008-000000000018', '00000000-0000-0000-b006-000000000020', 'FINAL', 'Final Spring 21', '2021-05-12', 100.00, 50.00, '2021-01-10 09:00:00'),
                                                                                                              ('00000000-0000-0000-b008-000000000019', '00000000-0000-0000-b006-000000000001', 'MIDTERM_IMPROVEMENT', 'Retake Midterm', '2024-04-01', 50.00, 30.00, '2024-03-15 09:00:00'),
                                                                                                              ('00000000-0000-0000-b008-000000000020', '00000000-0000-0000-b006-000000000009', 'FINAL', 'Algorithm Final', '2024-05-10', 100.00, 50.00, '2024-01-10 09:00:00');
-- 19. FEES (Prefix: b009)
-- student_id -> students (b005), semester_id -> semesters (a003)
INSERT INTO fees (id, student_id, semester_id, registration_fee, credit_fee, amount_paid, due_date, paid_at, created_at) VALUES
                                                                                                                             ('00000000-0000-0000-b009-000000000001', '00000000-0000-0000-b005-000000000001', '00000000-0000-0000-a003-000000000001', 15000.00, 21000.00, 36000.00, '2024-01-31', '2024-01-15 10:00:00', '2023-12-25 00:00:00'),
                                                                                                                             ('00000000-0000-0000-b009-000000000002', '00000000-0000-0000-b005-000000000002', '00000000-0000-0000-a003-000000000001', 15000.00, 21000.00, 36000.00, '2024-01-31', '2024-01-16 10:00:00', '2023-12-25 00:00:00'),
                                                                                                                             ('00000000-0000-0000-b009-000000000003', '00000000-0000-0000-b005-000000000003', '00000000-0000-0000-a003-000000000001', 15000.00, 21000.00, 36000.00, '2024-01-31', '2024-01-17 10:00:00', '2023-12-25 00:00:00'),
                                                                                                                             ('00000000-0000-0000-b009-000000000004', '00000000-0000-0000-b005-000000000004', '00000000-0000-0000-a003-000000000001', 14000.00, 18000.00, 32000.00, '2024-01-31', '2024-01-18 10:00:00', '2023-12-25 00:00:00'),
                                                                                                                             ('00000000-0000-0000-b009-000000000005', '00000000-0000-0000-b005-000000000005', '00000000-0000-0000-a003-000000000001', 15000.00, 21000.00, 0.00, '2024-01-31', NULL, '2023-12-25 00:00:00'),
                                                                                                                             ('00000000-0000-0000-b009-000000000006', '00000000-0000-0000-b005-000000000001', '00000000-0000-0000-a003-000000000002', 15000.00, 15000.00, 30000.00, '2024-06-15', '2024-06-01 10:00:00', '2024-05-10 00:00:00'),
                                                                                                                             ('00000000-0000-0000-b009-000000000007', '00000000-0000-0000-b005-000000000001', '00000000-0000-0000-a003-000000000010', 15000.00, 35000.00, 50000.00, '2023-01-31', '2023-01-15 10:00:00', '2022-12-25 00:00:00'),
                                                                                                                             ('00000000-0000-0000-b009-000000000008', '00000000-0000-0000-b005-000000000014', '00000000-0000-0000-a003-000000000001', 13000.00, 21000.00, 34000.00, '2024-01-31', '2024-01-15 10:00:00', '2023-12-25 00:00:00'),
                                                                                                                             ('00000000-0000-0000-b009-000000000009', '00000000-0000-0000-b005-000000000016', '00000000-0000-0000-a003-000000000001', 12000.00, 21000.00, 33000.00, '2024-01-31', '2024-01-15 10:00:00', '2023-12-25 00:00:00'),
                                                                                                                             ('00000000-0000-0000-b009-000000000010', '00000000-0000-0000-b005-000000000017', '00000000-0000-0000-a003-000000000001', 10000.00, 21000.00, 31000.00, '2024-01-31', '2024-01-15 10:00:00', '2023-12-25 00:00:00'),
                                                                                                                             ('00000000-0000-0000-b009-000000000011', '00000000-0000-0000-b005-000000000018', '00000000-0000-0000-a003-000000000001', 12000.00, 21000.00, 33000.00, '2024-01-31', '2024-01-15 10:00:00', '2023-12-25 00:00:00'),
                                                                                                                             ('00000000-0000-0000-b009-000000000012', '00000000-0000-0000-b005-000000000006', '00000000-0000-0000-a003-000000000002', 15000.00, 21000.00, 36000.00, '2024-06-15', '2024-06-01 10:00:00', '2024-05-10 00:00:00'),
                                                                                                                             ('00000000-0000-0000-b009-000000000013', '00000000-0000-0000-b005-000000000010', '00000000-0000-0000-a003-000000000002', 15000.00, 21000.00, 36000.00, '2024-06-15', '2024-06-01 10:00:00', '2024-05-10 00:00:00'),
                                                                                                                             ('00000000-0000-0000-b009-000000000014', '00000000-0000-0000-b005-000000000016', '00000000-0000-0000-a003-000000000017', 12000.00, 21000.00, 33000.00, '2021-06-15', '2021-06-01 10:00:00', '2021-05-10 00:00:00'),
                                                                                                                             ('00000000-0000-0000-b009-000000000015', '00000000-0000-0000-b005-000000000017', '00000000-0000-0000-a003-000000000019', 10000.00, 21000.00, 31000.00, '2020-01-31', '2020-01-15 10:00:00', '2019-12-25 00:00:00'),
                                                                                                                             ('00000000-0000-0000-b009-000000000016', '00000000-0000-0000-b005-000000000018', '00000000-0000-0000-a003-000000000020', 12000.00, 21000.00, 33000.00, '2020-06-15', '2020-06-01 10:00:00', '2020-05-10 00:00:00'),
                                                                                                                             ('00000000-0000-0000-b009-000000000017', '00000000-0000-0000-b005-000000000019', '00000000-0000-0000-a003-000000000001', 14500.00, 21000.00, 0.00, '2024-01-31', NULL, '2023-12-25 00:00:00'),
                                                                                                                             ('00000000-0000-0000-b009-000000000018', '00000000-0000-0000-b005-000000000020', '00000000-0000-0000-a003-000000000001', 15000.00, 21000.00, 0.00, '2024-01-31', NULL, '2023-12-25 00:00:00'),
                                                                                                                             ('00000000-0000-0000-b009-000000000019', '00000000-0000-0000-b005-000000000001', '00000000-0000-0000-a003-000000000003', 15000.00, 0.00, 0.00, '2024-09-30', NULL, '2024-09-01 00:00:00'),
                                                                                                                             ('00000000-0000-0000-b009-000000000020', '00000000-0000-0000-b005-000000000002', '00000000-0000-0000-a003-000000000003', 15000.00, 0.00, 0.00, '2024-09-30', NULL, '2024-09-01 00:00:00');
-- 20. NOTICES (Prefix: b010)
-- posted_by -> users (a001), department_id -> departments (a002)
INSERT INTO notices (id, title, content, posted_by, target_role, department_id, category, created_at) VALUES
                                                                                                          ('00000000-0000-0000-b010-000000000001', 'Spring 2024 Final Exam Schedule', 'Final exams will start from May 5th...', '00000000-0000-0000-a001-000000000003', 'ALL', NULL, 'Exam', '2024-04-15 10:00:00'),
                                                                                                          ('00000000-0000-0000-b010-000000000002', 'Course Registration Summer 2024', 'Registration starts from May 10th...', '00000000-0000-0000-a001-000000000006', 'STUDENT', NULL, 'Registration', '2024-05-01 10:00:00'),
                                                                                                          ('00000000-0000-0000-b010-000000000003', 'Faculty Meeting Notice', 'All faculty members are requested...', '00000000-0000-0000-a001-000000000001', 'FACULTY', '00000000-0000-0000-a002-000000000001', 'Administrative', '2024-05-05 09:00:00'),
                                                                                                          ('00000000-0000-0000-b010-000000000004', 'Library Renovation', 'The library will be closed...', '00000000-0000-0000-a001-000000000003', 'ALL', NULL, 'General', '2024-06-01 10:00:00'),
                                                                                                          ('00000000-0000-0000-b010-000000000005', 'Laptop Distribution 2024', 'Eligible students can collect...', '00000000-0000-0000-a001-000000000006', 'STUDENT', NULL, 'Facilities', '2024-02-01 10:00:00'),
                                                                                                          ('00000000-0000-0000-b010-000000000006', 'Holiday Notice - Eid', 'University will remain closed...', '00000000-0000-0000-a001-000000000003', 'ALL', NULL, 'Holiday', '2024-04-05 10:00:00'),
                                                                                                          ('00000000-0000-0000-b010-000000000007', 'Research Grant Call', 'Proposals are invited...', '00000000-0000-0000-a001-000000000001', 'FACULTY', NULL, 'Research', '2024-03-01 10:00:00'),
                                                                                                          ('00000000-0000-0000-b010-000000000008', 'Blood Donation Camp', 'Organized by RBU Blood Club...', '00000000-0000-0000-a001-000000000003', 'ALL', NULL, 'Event', '2024-05-15 10:00:00'),
                                                                                                          ('00000000-0000-0000-b010-000000000009', 'Grade Submission Deadline', 'Final deadline for Summer 24...', '00000000-0000-0000-a001-000000000006', 'FACULTY', NULL, 'Academic', '2024-09-15 10:00:00'),
                                                                                                          ('00000000-0000-0000-b010-000000000010', 'Financial Aid Application', 'Applications are open for Fall...', '00000000-0000-0000-a001-000000000003', 'STUDENT', NULL, 'Financial', '2024-08-01 10:00:00'),
                                                                                                          ('00000000-0000-0000-b010-000000000011', 'Convocation 2024 Prep', 'Graduates are requested...', '00000000-0000-0000-a001-000000000006', 'STUDENT', NULL, 'Event', '2024-07-01 10:00:00'),
                                                                                                          ('00000000-0000-0000-b010-000000000012', 'Sports Week Schedule', 'Events list and timings...', '00000000-0000-0000-a001-000000000003', 'ALL', NULL, 'Event', '2024-01-20 10:00:00'),
                                                                                                          ('00000000-0000-0000-b010-000000000013', 'New Faculty Orientation', 'Welcome to RBU...', '00000000-0000-0000-a001-000000000001', 'FACULTY', NULL, 'Administrative', '2024-01-05 10:00:00'),
                                                                                                          ('00000000-0000-0000-b010-000000000014', 'COVID Protocol Update', 'Mask mandatory in labs...', '00000000-0000-0000-a001-000000000003', 'ALL', NULL, 'Health', '2021-08-01 10:00:00'),
                                                                                                          ('00000000-0000-0000-b010-000000000015', 'Bus Schedule Change', 'Effective from Monday...', '00000000-0000-0000-a001-000000000003', 'ALL', NULL, 'Transport', '2024-05-18 10:00:00'),
                                                                                                          ('00000000-0000-0000-b010-000000000016', 'Coding Contest 2024', 'Hosted by CSE Society...', '00000000-0000-0000-a001-000000000001', 'STUDENT', '00000000-0000-0000-a002-000000000001', 'Event', '2024-03-10 10:00:00'),
                                                                                                          ('00000000-0000-0000-b010-000000000017', 'Hostel Fee Payment', 'Deadline is March 31...', '00000000-0000-0000-a001-000000000003', 'STUDENT', NULL, 'Financial', '2024-03-01 10:00:00'),
                                                                                                          ('00000000-0000-0000-b010-000000000018', 'Thesis Defense Schedule', 'For graduating batch...', '00000000-0000-0000-a001-000000000001', 'STUDENT', '00000000-0000-0000-a002-000000000001', 'Academic', '2024-05-01 10:00:00'),
                                                                                                          ('00000000-0000-0000-b010-000000000019', 'Security Alert', 'Keep belongings safe...', '00000000-0000-0000-a001-000000000003', 'ALL', NULL, 'General', '2024-02-15 10:00:00'),
                                                                                                          ('00000000-0000-0000-b010-000000000020', 'Winter Vacation Notice', 'University closed for 10 days...', '00000000-0000-0000-a001-000000000003', 'ALL', NULL, 'Holiday', '2023-12-15 10:00:00');
-- 21. SEMESTER_CLEARANCE (Prefix: c001)
-- student_id -> students (b005), semester_id -> semesters (a003)
INSERT INTO semester_clearance (id, student_id, semester_id, registration_cleared, midterm_cleared, final_exam_cleared, created_at) VALUES
                                                                                                                                        ('00000000-0000-0000-c001-000000000001', '00000000-0000-0000-b005-000000000001', '00000000-0000-0000-a003-000000000001', 1, 1, 1, '2024-01-05 00:00:00'),
                                                                                                                                        ('00000000-0000-0000-c001-000000000002', '00000000-0000-0000-b005-000000000002', '00000000-0000-0000-a003-000000000001', 1, 1, 1, '2024-01-05 00:00:00'),
                                                                                                                                        ('00000000-0000-0000-c001-000000000003', '00000000-0000-0000-b005-000000000003', '00000000-0000-0000-a003-000000000001', 1, 1, 1, '2024-01-05 00:00:00'),
                                                                                                                                        ('00000000-0000-0000-c001-000000000004', '00000000-0000-0000-b005-000000000004', '00000000-0000-0000-a003-000000000001', 1, 1, 1, '2024-01-05 00:00:00'),
                                                                                                                                        ('00000000-0000-0000-c001-000000000005', '00000000-0000-0000-b005-000000000005', '00000000-0000-0000-a003-000000000001', 0, 0, 0, '2024-01-05 00:00:00'),
                                                                                                                                        ('00000000-0000-0000-c001-000000000006', '00000000-0000-0000-b005-000000000014', '00000000-0000-0000-a003-000000000001', 1, 1, 1, '2024-01-05 00:00:00'),
                                                                                                                                        ('00000000-0000-0000-c001-000000000007', '00000000-0000-0000-b005-000000000016', '00000000-0000-0000-a003-000000000001', 1, 1, 1, '2024-01-05 00:00:00'),
                                                                                                                                        ('00000000-0000-0000-c001-000000000008', '00000000-0000-0000-b005-000000000017', '00000000-0000-0000-a003-000000000001', 1, 1, 1, '2024-01-05 00:00:00'),
                                                                                                                                        ('00000000-0000-0000-c001-000000000009', '00000000-0000-0000-b005-000000000018', '00000000-0000-0000-a003-000000000001', 1, 1, 1, '2024-01-05 00:00:00'),
                                                                                                                                        ('00000000-0000-0000-c001-000000000010', '00000000-0000-0000-b005-000000000001', '00000000-0000-0000-a003-000000000002', 1, 1, 1, '2024-05-15 00:00:00'),
                                                                                                                                        ('00000000-0000-0000-c001-000000000011', '00000000-0000-0000-b005-000000000006', '00000000-0000-0000-a003-000000000002', 1, 1, 1, '2024-05-15 00:00:00'),
                                                                                                                                        ('00000000-0000-0000-c001-000000000012', '00000000-0000-0000-b005-000000000010', '00000000-0000-0000-a003-000000000002', 1, 1, 1, '2024-05-15 00:00:00'),
                                                                                                                                        ('00000000-0000-0000-c001-000000000013', '00000000-0000-0000-b005-000000000001', '00000000-0000-0000-a003-000000000010', 1, 1, 1, '2023-01-05 00:00:00'),
                                                                                                                                        ('00000000-0000-0000-c001-000000000014', '00000000-0000-0000-b005-000000000016', '00000000-0000-0000-a003-000000000017', 1, 1, 1, '2021-05-15 00:00:00'),
                                                                                                                                        ('00000000-0000-0000-c001-000000000015', '00000000-0000-0000-b005-000000000017', '00000000-0000-0000-a003-000000000019', 1, 1, 1, '2020-01-05 00:00:00'),
                                                                                                                                        ('00000000-0000-0000-c001-000000000016', '00000000-0000-0000-b005-000000000018', '00000000-0000-0000-a003-000000000020', 1, 1, 1, '2020-05-15 00:00:00'),
                                                                                                                                        ('00000000-0000-0000-c001-000000000017', '00000000-0000-0000-b005-000000000019', '00000000-0000-0000-a003-000000000001', 0, 0, 0, '2024-01-05 00:00:00'),
                                                                                                                                        ('00000000-0000-0000-c001-000000000018', '00000000-0000-0000-b005-000000000020', '00000000-0000-0000-a003-000000000001', 0, 0, 0, '2024-01-05 00:00:00'),
                                                                                                                                        ('00000000-0000-0000-c001-000000000019', '00000000-0000-0000-b005-000000000001', '00000000-0000-0000-a003-000000000003', 0, 0, 0, '2024-09-15 00:00:00'),
                                                                                                                                        ('00000000-0000-0000-c001-000000000020', '00000000-0000-0000-b005-000000000002', '00000000-0000-0000-a003-000000000003', 0, 0, 0, '2024-09-15 00:00:00');
-- 22. EVALUATIONS (Prefix: c002)
-- student_id -> students (b005), offering_id -> course_offerings (b006)
INSERT INTO evaluations (id, student_id, offering_id, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, comments, created_at) VALUES
                                                                                                                         ('00000000-0000-0000-c002-000000000001', '00000000-0000-0000-b005-000000000001', '00000000-0000-0000-b006-000000000001', 5, 5, 4, 5, 5, 4, 5, 5, 5, 5, 'Great teacher!', '2024-05-15 10:00:00'),
                                                                                                                         ('00000000-0000-0000-c002-000000000002', '00000000-0000-0000-b005-000000000002', '00000000-0000-0000-b006-000000000001', 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 'Helpful lectures.', '2024-05-15 10:05:00'),
                                                                                                                         ('00000000-0000-0000-c002-000000000003', '00000000-0000-0000-b005-000000000001', '00000000-0000-0000-b006-000000000003', 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 'Lab was fun.', '2024-05-15 10:10:00'),
                                                                                                                         ('00000000-0000-0000-c002-000000000004', '00000000-0000-0000-b005-000000000016', '00000000-0000-0000-b006-000000000017', 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 'Learnt a lot.', '2022-05-15 10:00:00'),
                                                                                                                         ('00000000-0000-0000-c002-000000000005', '00000000-0000-0000-b005-000000000017', '00000000-0000-0000-b006-000000000018', 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 'Excellent.', '2021-05-15 10:00:00'),
                                                                                                                         ('00000000-0000-0000-c002-000000000006', '00000000-0000-0000-b005-000000000018', '00000000-0000-0000-b006-000000000020', 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 'Average.', '2021-05-15 10:00:00'),
                                                                                                                         ('00000000-0000-0000-c002-000000000007', '00000000-0000-0000-b005-000000000001', '00000000-0000-0000-b006-000000000013', 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 'Best course.', '2023-05-15 10:00:00'),
                                                                                                                         ('00000000-0000-0000-c002-000000000008', '00000000-0000-0000-b005-000000000006', '00000000-0000-0000-b006-000000000007', 4, 4, 5, 4, 5, 4, 5, 4, 5, 4, 'Good.', '2024-09-15 10:00:00'),
                                                                                                                         ('00000000-0000-0000-c002-000000000009', '00000000-0000-0000-b005-000000000010', '00000000-0000-0000-b006-000000000008', 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 'Satisfactory.', '2024-09-15 10:00:00'),
                                                                                                                         ('00000000-0000-0000-c002-000000000010', '00000000-0000-0000-b005-000000000014', '00000000-0000-0000-b006-000000000009', 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 'Perfect.', '2024-05-15 10:00:00'),
                                                                                                                         ('00000000-0000-0000-c002-000000000011', '00000000-0000-0000-b005-000000000016', '00000000-0000-0000-b006-000000000010', 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 'Informative.', '2024-05-15 10:00:00'),
                                                                                                                         ('00000000-0000-0000-c002-000000000012', '00000000-0000-0000-b005-000000000017', '00000000-0000-0000-b006-000000000011', 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 'Highly recommended.', '2024-05-15 10:00:00'),
                                                                                                                         ('00000000-0000-0000-c002-000000000013', '00000000-0000-0000-b005-000000000018', '00000000-0000-0000-b006-000000000012', 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 'Okay.', '2024-05-15 10:00:00'),
                                                                                                                         ('00000000-0000-0000-c002-000000000014', '00000000-0000-0000-b005-000000000003', '00000000-0000-0000-b006-000000000004', 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 'Good.', '2024-05-15 10:00:00'),
                                                                                                                         ('00000000-0000-0000-c002-000000000015', '00000000-0000-0000-b005-000000000004', '00000000-0000-0000-b006-000000000006', 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 'Learnt much.', '2024-05-15 10:00:00'),
                                                                                                                         ('00000000-0000-0000-c002-000000000016', '00000000-0000-0000-b005-000000000005', '00000000-0000-0000-b006-000000000001', 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 'Amazing.', '2024-05-15 10:00:00'),
                                                                                                                         ('00000000-0000-0000-c002-000000000017', '00000000-0000-0000-b005-000000000014', '00000000-0000-0000-b006-000000000014', 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 'Thanks.', '2024-05-15 10:00:00'),
                                                                                                                         ('00000000-0000-0000-c002-000000000018', '00000000-0000-0000-b005-000000000001', '00000000-0000-0000-b006-000000000005', 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 'Excellent math.', '2024-05-15 10:00:00'),
                                                                                                                         ('00000000-0000-0000-c002-000000000019', '00000000-0000-0000-b005-000000000002', '00000000-0000-0000-b006-000000000002', 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 'Very good.', '2024-05-15 10:00:00'),
                                                                                                                         ('00000000-0000-0000-c002-000000000020', '00000000-0000-0000-b005-000000000003', '00000000-0000-0000-b006-000000000015', 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 'Best.', '2023-05-15 10:00:00');
-- 23. DOCUMENT_REQUESTS (Prefix: c003)
-- student_id -> students (b005)
INSERT INTO document_requests (
    id, student_id, document_type, status, fee_amount, is_paid, requested_at, updated_at
) VALUES
      ('00000000-0000-0000-c003-000000000001', '00000000-0000-0000-b005-000000000016', 'PROVISIONAL_CERTIFICATE', 'COMPLETED', 1000.00, 1, '2024-06-01 10:00:00', '2024-06-01 10:00:00'),
      ('00000000-0000-0000-c003-000000000002', '00000000-0000-0000-b005-000000000017', 'TRANSCRIPT', 'READY_FOR_PICKUP', 500.00, 1, '2024-06-05 10:00:00', '2024-06-05 10:00:00'),
      ('00000000-0000-0000-c003-000000000003', '00000000-0000-0000-b005-000000000018', 'TESTIMONIAL', 'PENDING', 200.00, 0, '2024-07-01 10:00:00', '2024-07-01 10:00:00'),
      ('00000000-0000-0000-c003-000000000004', '00000000-0000-0000-b005-000000000001', 'TRANSCRIPT', 'PROCESSING', 500.00, 1, '2024-07-10 10:00:00', '2024-07-10 10:00:00'),
      ('00000000-0000-0000-c003-000000000005', '00000000-0000-0000-b005-000000000002', 'MEDIUM_OF_INSTRUCTION', 'REJECTED', 300.00, 1, '2024-07-15 10:00:00', '2024-07-15 10:00:00'),
      ('00000000-0000-0000-c003-000000000006', '00000000-0000-0000-b005-000000000016', 'MAIN_CERTIFICATE', 'PENDING', 2000.00, 0, '2024-08-01 10:00:00', '2024-08-01 10:00:00'),
      ('00000000-0000-0000-c003-000000000007', '00000000-0000-0000-b005-000000000014', 'TRANSCRIPT', 'COMPLETED', 500.00, 1, '2024-05-01 10:00:00', '2024-05-01 10:00:00'),
      ('00000000-0000-0000-c003-000000000008', '00000000-0000-0000-b005-000000000010', 'TESTIMONIAL', 'COMPLETED', 200.00, 1, '2024-05-10 10:00:00', '2024-05-10 10:00:00'),
      ('00000000-0000-0000-c003-000000000009', '00000000-0000-0000-b005-000000000006', 'TRANSCRIPT', 'COMPLETED', 500.00, 1, '2024-09-01 10:00:00', '2024-09-01 10:00:00'),
      ('00000000-0000-0000-c003-000000000010', '00000000-0000-0000-b005-000000000001', 'MEDIUM_OF_INSTRUCTION', 'COMPLETED', 300.00, 1, '2023-06-01 10:00:00', '2023-06-01 10:00:00'),
      ('00000000-0000-0000-c003-000000000011', '00000000-0000-0000-b005-000000000003', 'TRANSCRIPT', 'COMPLETED', 500.00, 1, '2023-01-10 10:00:00', '2023-01-10 10:00:00'),
      ('00000000-0000-0000-c003-000000000012', '00000000-0000-0000-b005-000000000004', 'TESTIMONIAL', 'COMPLETED', 200.00, 1, '2022-06-01 10:00:00', '2022-06-01 10:00:00'),
      ('00000000-0000-0000-c003-000000000013', '00000000-0000-0000-b005-000000000005', 'TRANSCRIPT', 'COMPLETED', 500.00, 1, '2022-01-20 10:00:00', '2022-01-20 10:00:00'),
      ('00000000-0000-0000-c003-000000000014', '00000000-0000-0000-b005-000000000014', 'MAIN_CERTIFICATE', 'PROCESSING', 2000.00, 1, '2024-08-01 11:00:00', '2024-08-01 11:00:00'),
      ('00000000-0000-0000-c003-000000000015', '00000000-0000-0000-b005-000000000016', 'TESTIMONIAL', 'PROCESSING', 200.00, 1, '2024-08-02 10:00:00', '2024-08-02 10:00:00'),
      ('00000000-0000-0000-c003-000000000016', '00000000-0000-0000-b005-000000000017', 'MAIN_CERTIFICATE', 'PENDING', 2000.00, 0, '2024-08-03 10:00:00', '2024-08-03 10:00:00'),
      ('00000000-0000-0000-c003-000000000017', '00000000-0000-0000-b005-000000000018', 'PROVISIONAL_CERTIFICATE', 'PENDING', 1000.00, 0, '2024-08-04 10:00:00', '2024-08-04 10:00:00'),
      ('00000000-0000-0000-c003-000000000018', '00000000-0000-0000-b005-000000000019', 'TRANSCRIPT', 'PENDING', 500.00, 0, '2024-08-05 10:00:00', '2024-08-05 10:00:00'),
      ('00000000-0000-0000-c003-000000000019', '00000000-0000-0000-b005-000000000020', 'TESTIMONIAL', 'PENDING', 200.00, 0, '2024-08-05 11:00:00', '2024-08-05 11:00:00'),
      ('00000000-0000-0000-c003-000000000020', '00000000-0000-0000-b005-000000000001', 'PROVISIONAL_CERTIFICATE', 'PROCESSING', 1000.00, 1, '2024-08-05 12:00:00', '2024-08-05 12:00:00');
-- 24. CONVOCATION_APPLICATIONS (Prefix: c004)
-- student_id -> students (b005)
-- NOTE: schema has no cgpa / credits_completed columns (removed from INSERT).

INSERT INTO convocation_applications (
    id, student_id, convocation_year, gown_size, guest_count,
    fee_amount, is_paid, status, cgpa, credits_completed, applied_at, updated_at
) VALUES
      ('00000000-0000-0000-c004-000000000001', '00000000-0000-0000-b005-000000000016', 2024, 'L', 2, 5000.00, 1, 'APPROVED', 3.75, 144.00, '2024-01-10 10:00:00', '2024-01-10 10:00:00'),
      ('00000000-0000-0000-c004-000000000002', '00000000-0000-0000-b005-000000000017', 2024, 'M', 1, 5000.00, 1, 'VERIFIED', 3.80, 144.00, '2024-01-11 10:00:00', '2024-01-11 10:00:00'),
      ('00000000-0000-0000-c004-000000000003', '00000000-0000-0000-b005-000000000018', 2024, 'XL', 2, 5000.00, 1, 'PENDING', 3.50, 140.00, '2024-01-12 10:00:00', '2024-01-12 10:00:00'),
      ('00000000-0000-0000-c004-000000000004', '00000000-0000-0000-b005-000000000014', 2024, 'S', 0, 4000.00, 1, 'APPROVED', 3.90, 148.00, '2024-01-15 10:00:00', '2024-01-15 10:00:00'),
      ('00000000-0000-0000-c004-000000000005', '00000000-0000-0000-b005-000000000010', 2024, 'XXL', 3, 6000.00, 0, 'REJECTED', 2.75, 130.00, '2024-01-20 10:00:00', '2024-01-20 10:00:00'),
      ('00000000-0000-0000-c004-000000000006', '00000000-0000-0000-b005-000000000001', 2026, 'L', 2, 5000.00, 0, 'PENDING', 3.65, 135.00, '2026-08-01 10:00:00', '2026-08-01 10:00:00'),
      ('00000000-0000-0000-c004-000000000007', '00000000-0000-0000-b005-000000000002', 2026, 'M', 2, 5000.00, 0, 'PENDING', 3.70, 135.00, '2026-08-01 11:00:00', '2026-08-01 11:00:00'),
      ('00000000-0000-0000-c004-000000000008', '00000000-0000-0000-b005-000000000003', 2026, 'S', 1, 4500.00, 0, 'PENDING', 3.40, 120.00, '2026-08-02 10:00:00', '2026-08-02 10:00:00'),
      ('00000000-0000-0000-c004-000000000009', '00000000-0000-0000-b005-000000000004', 2026, 'XL', 2, 5000.00, 0, 'PENDING', 3.55, 125.00, '2026-08-02 11:00:00', '2026-08-02 11:00:00'),
      ('00000000-0000-0000-c004-000000000010', '00000000-0000-0000-b005-000000000005', 2026, 'M', 2, 5000.00, 0, 'PENDING', 3.85, 140.00, '2026-08-03 10:00:00', '2026-08-03 10:00:00'),
      ('00000000-0000-0000-c004-000000000011', '00000000-0000-0000-b005-000000000006', 2026, 'L', 2, 5000.00, 0, 'PENDING', 3.60, 130.00, '2026-08-03 11:00:00', '2026-08-03 11:00:00'),
      ('00000000-0000-0000-c004-000000000012', '00000000-0000-0000-b005-000000000007', 2026, 'XXL', 2, 5000.00, 0, 'PENDING', 3.30, 115.00, '2026-08-04 10:00:00', '2026-08-04 10:00:00'),
      ('00000000-0000-0000-c004-000000000013', '00000000-0000-0000-b005-000000000008', 2026, 'S', 0, 4500.00, 0, 'PENDING', 3.75, 135.00, '2026-08-04 11:00:00', '2026-08-04 11:00:00'),
      ('00000000-0000-0000-c004-000000000014', '00000000-0000-0000-b005-000000000009', 2026, 'L', 2, 5000.00, 0, 'PENDING', 3.45, 120.00, '2026-08-04 12:00:00', '2026-08-04 12:00:00'),
      ('00000000-0000-0000-c004-000000000015', '00000000-0000-0000-b005-000000000010', 2026, 'M', 2, 5000.00, 0, 'PENDING', 3.90, 145.00, '2026-08-05 09:00:00', '2026-08-05 09:00:00'),
      ('00000000-0000-0000-c004-000000000016', '00000000-0000-0000-b005-000000000011', 2026, 'XL', 1, 5000.00, 0, 'PENDING', 3.50, 125.00, '2026-08-05 10:00:00', '2026-08-05 10:00:00'),
      ('00000000-0000-0000-c004-000000000017', '00000000-0000-0000-b005-000000000012', 2026, 'M', 2, 5000.00, 0, 'PENDING', 3.60, 130.00, '2026-08-05 11:00:00', '2026-08-05 11:00:00'),
      ('00000000-0000-0000-c004-000000000018', '00000000-0000-0000-b005-000000000013', 2026, 'L', 2, 5000.00, 0, 'PENDING', 3.70, 135.00, '2026-08-05 13:00:00', '2026-08-05 13:00:00'),
      ('00000000-0000-0000-c004-000000000019', '00000000-0000-0000-b005-000000000014', 2026, 'XXL', 2, 5500.00, 0, 'PENDING', 3.80, 140.00, '2026-08-05 14:00:00', '2026-08-05 14:00:00'),
      ('00000000-0000-0000-c004-000000000020', '00000000-0000-0000-b005-000000000015', 2026, 'S', 1, 4500.00, 0, 'PENDING', 3.45, 120.00, '2026-08-05 15:00:00', '2026-08-05 15:00:00');


-- 25. FINANCIAL_AID_APPLICATIONS (Prefix: c005)
-- student_id -> students (b005), circular_id -> financial_aid_circulars (a005)
INSERT INTO financial_aid_applications (
    id, student_id, circular_id, justification, monthly_income, status, applied_at, updated_at
) VALUES
      ('00000000-0000-0000-c005-000000000001', '00000000-0000-0000-b005-000000000001', '00000000-0000-0000-a005-000000000001', 'Father is a daily laborer.', 15000.00, 'APPROVED', '2024-08-01 10:00:00', '2024-08-01 10:00:00'),
      ('00000000-0000-0000-c005-000000000002', '00000000-0000-0000-b005-000000000002', '00000000-0000-0000-a005-000000000001', 'Single parent household.', 12000.00, 'REVIEWING', '2024-08-02 10:00:00', '2024-08-02 10:00:00'),
      ('00000000-0000-0000-c005-000000000003', '00000000-0000-0000-b005-000000000003', '00000000-0000-0000-a005-000000000004', 'Grandfather Freedom Fighter.', 25000.00, 'PENDING', '2024-08-03 10:00:00', '2024-08-03 10:00:00'),
      ('00000000-0000-0000-c005-000000000004', '00000000-0000-0000-b005-000000000004', '00000000-0000-0000-a005-000000000006', 'First gen female engineer.', 20000.00, 'APPROVED', '2024-08-04 10:00:00', '2024-08-04 10:00:00'),
      ('00000000-0000-0000-c005-000000000005', '00000000-0000-0000-b005-000000000005', '00000000-0000-0000-a005-000000000013', 'Physics research enthusiast.', 40000.00, 'REJECTED', '2024-08-05 10:00:00', '2024-08-05 10:00:00'),
      ('00000000-0000-0000-c005-000000000006', '00000000-0000-0000-b005-000000000006', '00000000-0000-0000-a005-000000000001', 'Low family income.', 18000.00, 'PENDING', '2024-08-05 11:00:00', '2024-08-05 11:00:00'),
      ('00000000-0000-0000-c005-000000000007', '00000000-0000-0000-b005-000000000007', '00000000-0000-0000-a005-000000000002', 'High GPA maintenance.', 35000.00, 'PENDING', '2024-08-05 12:00:00', '2024-08-05 12:00:00'),
      ('00000000-0000-0000-c005-000000000008', '00000000-0000-0000-b005-000000000008', '00000000-0000-0000-a005-000000000007', 'Rural area resident.', 10000.00, 'PENDING', '2024-08-05 13:00:00', '2024-08-05 13:00:00'),
      ('00000000-0000-0000-c005-000000000009', '00000000-0000-0000-b005-000000000009', '00000000-0000-0000-a005-000000000001', 'Flood affected family.', 22000.00, 'PENDING', '2024-08-05 14:00:00', '2024-08-05 14:00:00'),
      ('00000000-0000-0000-c005-000000000010', '00000000-0000-0000-b005-000000000010', '00000000-0000-0000-a005-000000000005', 'National volleyball player.', 30000.00, 'PENDING', '2024-08-05 15:00:00', '2024-08-05 15:00:00'),
      ('00000000-0000-0000-c005-000000000011', '00000000-0000-0000-b005-000000000011', '00000000-0000-0000-a005-000000000001', 'Medical crisis in family.', 15000.00, 'PENDING', '2024-08-06 10:00:00', '2024-08-06 10:00:00'),
      ('00000000-0000-0000-c005-000000000012', '00000000-0000-0000-b005-000000000012', '00000000-0000-0000-a005-000000000008', 'Disability support.', 5000.00, 'PENDING', '2024-08-06 11:00:00', '2024-08-06 11:00:00'),
      ('00000000-0000-0000-c005-000000000013', '00000000-0000-0000-b005-000000000013', '00000000-0000-0000-a005-000000000017', 'State level writer.', 28000.00, 'PENDING', '2024-08-06 12:00:00', '2024-08-06 12:00:00'),
      ('00000000-0000-0000-c005-000000000014', '00000000-0000-0000-b005-000000000014', '00000000-0000-0000-a005-000000000001', 'Unemployed father.', 7000.00, 'PENDING', '2024-08-06 13:00:00', '2024-08-06 13:00:00'),
      ('00000000-0000-0000-c005-000000000015', '00000000-0000-0000-b005-000000000015', '00000000-0000-0000-a005-000000000010', 'Orphan.', 0.00, 'PENDING', '2024-08-06 14:00:00', '2024-08-06 14:00:00'),
      ('00000000-0000-0000-c005-000000000016', '00000000-0000-0000-b005-000000000016', '00000000-0000-0000-a005-000000000014', 'Need support for Law internship.', 25000.00, 'PENDING', '2024-08-07 10:00:00', '2024-08-07 10:00:00'),
      ('00000000-0000-0000-c005-000000000017', '00000000-0000-0000-b005-000000000017', '00000000-0000-0000-a005-000000000016', 'Env science project funding.', 18000.00, 'PENDING', '2024-08-07 11:00:00', '2024-08-07 11:00:00'),
      ('00000000-0000-0000-c005-000000000018', '00000000-0000-0000-b005-000000000018', '00000000-0000-0000-a005-000000000001', 'Large family, low income.', 20000.00, 'PENDING', '2024-08-07 12:00:00', '2024-08-07 12:00:00'),
      ('00000000-0000-0000-c005-000000000019', '00000000-0000-0000-b005-000000000019', '00000000-0000-0000-a005-000000000009', 'Child of lower grade staff.', 32000.00, 'PENDING', '2024-08-07 13:00:00', '2024-08-07 13:00:00'),
      ('00000000-0000-0000-c005-000000000020', '00000000-0000-0000-b005-000000000020', '00000000-0000-0000-a005-000000000015', 'Architecture thesis costs.', 45000.00, 'PENDING', '2024-08-07 14:00:00', '2024-08-07 14:00:00');
-- 26. ATTENDANCE (Prefix: c006)
-- enrollment_id -> enrollments (b007)
INSERT INTO attendance (id, enrollment_id, class_date, status, marked_at) VALUES
                                                                              ('00000000-0000-0000-c006-000000000001', '00000000-0000-0000-b007-000000000001', '2024-06-02', 'PRESENT', '2024-06-02 09:05:00'),
                                                                              ('00000000-0000-0000-c006-000000000002', '00000000-0000-0000-b007-000000000002', '2024-06-02', 'PRESENT', '2024-06-02 09:10:00'),
                                                                              ('00000000-0000-0000-c006-000000000003', '00000000-0000-0000-b007-000000000003', '2024-06-03', 'LATE', '2024-06-03 10:15:00'),
                                                                              ('00000000-0000-0000-c006-000000000004', '00000000-0000-0000-b007-000000000004', '2024-06-02', 'PRESENT', '2024-06-02 14:05:00'),
                                                                              ('00000000-0000-0000-c006-000000000005', '00000000-0000-0000-b007-000000000005', '2024-06-03', 'ABSENT', '2024-06-03 12:00:00'),
                                                                              ('00000000-0000-0000-c006-000000000006', '00000000-0000-0000-b007-000000000006', '2024-06-04', 'PRESENT', '2024-06-04 09:05:00'),
                                                                              ('00000000-0000-0000-c006-000000000007', '00000000-0000-0000-b007-000000000007', '2024-06-02', 'PRESENT', '2024-06-02 11:05:00'),
                                                                              ('00000000-0000-0000-c006-000000000008', '00000000-0000-0000-b007-000000000008', '2024-06-03', 'PRESENT', '2024-06-03 09:05:00'),
                                                                              ('00000000-0000-0000-c006-000000000009', '00000000-0000-0000-b007-000000000009', '2024-06-02', 'PRESENT', '2024-06-02 10:05:00'),
                                                                              ('00000000-0000-0000-c006-000000000010', '00000000-0000-0000-b007-000000000010', '2024-06-03', 'PRESENT', '2024-06-03 14:05:00'),
                                                                              ('00000000-0000-0000-c006-000000000011', '00000000-0000-0000-b007-000000000011', '2024-06-02', 'PRESENT', '2024-06-02 12:05:00'),
                                                                              ('00000000-0000-0000-c006-000000000012', '00000000-0000-0000-b007-000000000012', '2024-06-04', 'PRESENT', '2024-06-04 11:05:00'),
                                                                              ('00000000-0000-0000-c006-000000000013', '00000000-0000-0000-b007-000000000013', '2024-06-03', 'PRESENT', '2024-06-03 09:05:00'),
                                                                              ('00000000-0000-0000-c006-000000000014', '00000000-0000-0000-b007-000000000014', '2024-06-02', 'PRESENT', '2024-06-02 11:05:00'),
                                                                              ('00000000-0000-0000-c006-000000000015', '00000000-0000-0000-b007-000000000015', '2024-06-03', 'PRESENT', '2024-06-03 10:05:00'),
                                                                              ('00000000-0000-0000-c006-000000000016', '00000000-0000-0000-b007-000000000016', '2024-06-04', 'PRESENT', '2024-06-04 14:05:00'),
                                                                              ('00000000-0000-0000-c006-000000000017', '00000000-0000-0000-b007-000000000017', '2024-06-02', 'PRESENT', '2024-06-02 09:05:00'),
                                                                              ('00000000-0000-0000-c006-000000000018', '00000000-0000-0000-b007-000000000018', '2024-06-03', 'PRESENT', '2024-06-03 11:05:00'),
                                                                              ('00000000-0000-0000-c006-000000000019', '00000000-0000-0000-b007-000000000019', '2024-06-04', 'PRESENT', '2024-06-04 10:05:00'),
                                                                              ('00000000-0000-0000-c006-000000000020', '00000000-0000-0000-b007-000000000020', '2024-06-05', 'PRESENT', '2024-06-05 11:05:00');
-- 27. RESULTS (Prefix: c007)
-- enrollment_id -> enrollments (b007), exam_id -> exams (b008)
INSERT INTO results (
    id, enrollment_id, exam_id, marks_obtained, is_final_result, published_at, created_at
) VALUES
      ('00000000-0000-0000-c007-000000000001', '00000000-0000-0000-b007-000000000001', '00000000-0000-0000-b008-000000000001', 25.5, 0, '2024-07-25 15:00:00', '2024-07-25 15:00:00'),
      ('00000000-0000-0000-c007-000000000002', '00000000-0000-0000-b007-000000000003', '00000000-0000-0000-b008-000000000003', 22.0, 0, '2024-07-25 15:00:00', '2024-07-25 15:00:00'),
      ('00000000-0000-0000-c007-000000000003', '00000000-0000-0000-b007-000000000004', '00000000-0000-0000-b008-000000000004', 8.5, 0, '2024-06-30 15:00:00', '2024-06-30 15:00:00'),
      ('00000000-0000-0000-c007-000000000004', '00000000-0000-0000-b007-000000000005', '00000000-0000-0000-b008-000000000005', 9.0, 0, '2024-06-30 15:00:00', '2024-06-30 15:00:00'),
      ('00000000-0000-0000-c007-000000000005', '00000000-0000-0000-b007-000000000006', '00000000-0000-0000-b008-000000000006', 27.0, 0, '2024-07-25 15:00:00', '2024-07-25 15:00:00'),
      ('00000000-0000-0000-c007-000000000006', '00000000-0000-0000-b007-000000000007', '00000000-0000-0000-b008-000000000007', 9.5, 0, '2024-06-30 15:00:00', '2024-06-30 15:00:00'),
      ('00000000-0000-0000-c007-000000000007', '00000000-0000-0000-b007-000000000008', '00000000-0000-0000-b008-000000000008', 21.0, 0, '2024-07-25 15:00:00', '2024-07-25 15:00:00'),
      ('00000000-0000-0000-c007-000000000008', '00000000-0000-0000-b007-000000000009', '00000000-0000-0000-b008-000000000009', 24.0, 0, '2024-07-25 15:00:00', '2024-07-25 15:00:00'),
      ('00000000-0000-0000-c007-000000000009', '00000000-0000-0000-b007-000000000010', '00000000-0000-0000-b008-000000000010', 26.5, 0, '2024-07-25 15:00:00', '2024-07-25 15:00:00'),
      ('00000000-0000-0000-c007-000000000010', '00000000-0000-0000-b007-000000000011', '00000000-0000-0000-b008-000000000011', 19.5, 0, '2024-07-25 15:00:00', '2024-07-25 15:00:00'),
      ('00000000-0000-0000-c007-000000000011', '00000000-0000-0000-b007-000000000012', '00000000-0000-0000-b008-000000000012', 28.0, 0, '2024-07-25 15:00:00', '2024-07-25 15:00:00'),
      ('00000000-0000-0000-c007-000000000012', '00000000-0000-0000-b007-000000000013', '00000000-0000-0000-b008-000000000013', 23.5, 0, '2024-07-25 15:00:00', '2024-07-25 15:00:00'),
      ('00000000-0000-0000-c007-000000000013', '00000000-0000-0000-b007-000000000014', '00000000-0000-0000-b008-000000000014', 22.5, 0, '2024-07-25 15:00:00', '2024-07-25 15:00:00'),
      ('00000000-0000-0000-c007-000000000014', '00000000-0000-0000-b007-000000000015', '00000000-0000-0000-b008-000000000015', 20.0, 0, '2024-07-25 15:00:00', '2024-07-25 15:00:00'),
      ('00000000-0000-0000-c007-000000000015', '00000000-0000-0000-b007-000000000016', '00000000-0000-0000-b008-000000000016', 25.0, 0, '2024-07-25 15:00:00', '2024-07-25 15:00:00'),
      ('00000000-0000-0000-c007-000000000016', '00000000-0000-0000-b007-000000000017', '00000000-0000-0000-b008-000000000017', 21.5, 0, '2024-07-25 15:00:00', '2024-07-25 15:00:00'),
      ('00000000-0000-0000-c007-000000000017', '00000000-0000-0000-b007-000000000018', '00000000-0000-0000-b008-000000000018', 27.5, 0, '2024-07-25 15:00:00', '2024-07-25 15:00:00'),
      ('00000000-0000-0000-c007-000000000018', '00000000-0000-0000-b007-000000000019', '00000000-0000-0000-b008-000000000019', 24.5, 0, '2024-07-25 15:00:00', '2024-07-25 15:00:00'),
      ('00000000-0000-0000-c007-000000000019', '00000000-0000-0000-b007-000000000002', '00000000-0000-0000-b008-000000000020', 26.0, 0, '2024-07-25 15:00:00', '2024-07-25 15:00:00'),
      ('00000000-0000-0000-c007-000000000020', '00000000-0000-0000-b007-000000000020', '00000000-0000-0000-b008-000000000001', 24.0, 0, '2024-07-25 15:00:00', '2024-07-25 15:00:00');
-- 28. NOTICE_VIEWS (Prefix: c008)
-- notice_id -> notices (b010), user_id -> users (a001)
INSERT INTO notice_views (id, notice_id, user_id, viewed_at) VALUES
                                                                 ('00000000-0000-0000-c008-000000000001', '00000000-0000-0000-b010-000000000001', '00000000-0000-0000-a001-000000000004', '2024-05-10 10:00:00'),
                                                                 ('00000000-0000-0000-c008-000000000002', '00000000-0000-0000-b010-000000000001', '00000000-0000-0000-a001-000000000005', '2024-05-10 10:30:00'),
                                                                 ('00000000-0000-0000-c008-000000000003', '00000000-0000-0000-b010-000000000002', '00000000-0000-0000-a001-000000000001', '2024-06-01 09:00:00'),
                                                                 ('00000000-0000-0000-c008-000000000004', '00000000-0000-0000-b010-000000000003', '00000000-0000-0000-a001-000000000001', '2024-05-11 10:00:00'),
                                                                 ('00000000-0000-0000-c008-000000000005', '00000000-0000-0000-b010-000000000004', '00000000-0000-0000-a001-000000000008', '2024-07-01 10:00:00'),
                                                                 ('00000000-0000-0000-c008-000000000006', '00000000-0000-0000-b010-000000000005', '00000000-0000-0000-a001-000000000010', '2024-05-15 10:00:00'),
                                                                 ('00000000-0000-0000-c008-000000000007', '00000000-0000-0000-b010-000000000006', '00000000-0000-0000-a001-000000000011', '2024-06-15 10:00:00'),
                                                                 ('00000000-0000-0000-c008-000000000008', '00000000-0000-0000-b010-000000000007', '00000000-0000-0000-a001-000000000002', '2024-05-15 11:00:00'),
                                                                 ('00000000-0000-0000-c008-000000000009', '00000000-0000-0000-b010-000000000008', '00000000-0000-0000-a001-000000000012', '2024-06-25 10:00:00'),
                                                                 ('00000000-0000-0000-c008-000000000010', '00000000-0000-0000-b010-000000000009', '00000000-0000-0000-a001-000000000001', '2024-06-10 10:00:00'),
                                                                 ('00000000-0000-0000-c008-000000000011', '00000000-0000-0000-b010-000000000010', '00000000-0000-0000-a001-000000000014', '2024-07-20 10:00:00'),
                                                                 ('00000000-0000-0000-c008-000000000012', '00000000-0000-0000-b010-000000000011', '00000000-0000-0000-a001-000000000015', '2024-06-15 11:00:00'),
                                                                 ('00000000-0000-0000-c008-000000000013', '00000000-0000-0000-b010-000000000012', '00000000-0000-0000-a001-000000000002', '2024-06-20 10:00:00'),
                                                                 ('00000000-0000-0000-c008-000000000014', '00000000-0000-0000-b010-000000000013', '00000000-0000-0000-a001-000000000016', '2024-05-15 12:00:00'),
                                                                 ('00000000-0000-0000-c008-000000000015', '00000000-0000-0000-b010-000000000014', '00000000-0000-0000-a001-000000000017', '2024-06-10 11:00:00'),
                                                                 ('00000000-0000-0000-c008-000000000016', '00000000-0000-0000-b010-000000000015', '00000000-0000-0000-a001-000000000007', '2024-10-15 10:00:00'),
                                                                 ('00000000-0000-0000-c008-000000000017', '00000000-0000-0000-b010-000000000016', '00000000-0000-0000-a001-000000000018', '2024-08-01 10:00:00'),
                                                                 ('00000000-0000-0000-c008-000000000018', '00000000-0000-0000-b010-000000000017', '00000000-0000-0000-a001-000000000019', '2024-09-01 10:00:00'),
                                                                 ('00000000-0000-0000-c008-000000000019', '00000000-0000-0000-b010-000000000018', '00000000-0000-0000-a001-000000000001', '2024-01-15 10:00:00'),
                                                                 ('00000000-0000-0000-c008-000000000020', '00000000-0000-0000-b010-000000000019', '00000000-0000-0000-a001-000000000020', '2024-05-15 13:00:00');
SET FOREIGN_KEY_CHECKS = 1;