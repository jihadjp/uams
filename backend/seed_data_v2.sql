-- ============================================================
-- UAMS COMPREHENSIVE SEED DATA (V2)
-- 10 Entries per Entity | Connected Data | password123
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. DEPARTMENTS
INSERT INTO departments (id, name, code, dept_number, head_faculty_id) VALUES
(UUID(), 'Computer Science & Engineering', 'CSE', '15', NULL),
(UUID(), 'Electrical & Electronic Engineering', 'EEE', '16', NULL),
(UUID(), 'Business Administration', 'BBA', '11', NULL),
(UUID(), 'Law', 'LLB', '12', NULL),
(UUID(), 'Pharmacy', 'PHR', '13', NULL),
(UUID(), 'Civil Engineering', 'CE', '17', NULL),
(UUID(), 'English', 'ENG', '14', NULL),
(UUID(), 'Architecture', 'ARC', '18', NULL),
(UUID(), 'Textile Engineering', 'TE', '19', NULL),
(UUID(), 'Journalism & Media Communication', 'JMC', '20', NULL);

-- 2. USERS (FACULTY) - Password: password123
-- Hash: $2a$10$8.UnVuG9HHgffUDalk8UrOuY5fLTMyF67W27LPRiH7y968V0iH89S
SET @pass = '$2a$10$8.UnVuG9HHgffUDalk8UrOuY5fLTMyF67W27LPRiH7y968V0iH89S';

INSERT INTO users (id, name, email, password_hash, role, must_change_password, is_verified, is_active) VALUES
('f001-user-id', 'Dr. Ariful Islam', 'ariful@rbu.edu.bd', @pass, 'FACULTY', 0, 1, 1),
('f002-user-id', 'Ms. Sarah Rahman', 'sarah@rbu.edu.bd', @pass, 'FACULTY', 0, 1, 1),
('f003-user-id', 'Mr. Tanvir Ahmed', 'tanvir@rbu.edu.bd', @pass, 'FACULTY', 0, 1, 1),
('f004-user-id', 'Dr. Nadia Sultana', 'nadia@rbu.edu.bd', @pass, 'FACULTY', 0, 1, 1),
('f005-user-id', 'Mr. Kamrul Hassan', 'kamrul@rbu.edu.bd', @pass, 'FACULTY', 0, 1, 1),
('f006-user-id', 'Ms. Farhana Yeasmin', 'farhana@rbu.edu.bd', @pass, 'FACULTY', 0, 1, 1),
('f007-user-id', 'Dr. Mehedi Hasan', 'mehedi@rbu.edu.bd', @pass, 'FACULTY', 0, 1, 1),
('f008-user-id', 'Ms. Rumana Akter', 'rumana@rbu.edu.bd', @pass, 'FACULTY', 0, 1, 1),
('f009-user-id', 'Mr. Shorif Ullah', 'shorif@rbu.edu.bd', @pass, 'FACULTY', 0, 1, 1),
('f010-user-id', 'Dr. Zeba Farhin', 'zeba@rbu.edu.bd', @pass, 'FACULTY', 0, 1, 1);

-- 3. FACULTY
INSERT INTO faculty (id, user_id, department_id, employee_id, designation, joined_at) VALUES
('f001-id', 'f001-user-id', (SELECT id FROM departments WHERE code='CSE'), 'E1001', 'Professor', '2015-01-10'),
('f002-id', 'f002-user-id', (SELECT id FROM departments WHERE code='EEE'), 'E1002', 'Lecturer', '2020-05-15'),
('f010-id', 'f010-user-id', (SELECT id FROM departments WHERE code='CSE'), 'E1010', 'Assistant Professor', '2018-03-20'),
('f003-id', 'f003-user-id', (SELECT id FROM departments WHERE code='BBA'), 'E1003', 'Lecturer', '2021-02-12'),
('f004-id', 'f004-user-id', (SELECT id FROM departments WHERE code='LLB'), 'E1004', 'Associate Professor', '2016-09-01'),
('f005-id', 'f005-user-id', (SELECT id FROM departments WHERE code='PHR'), 'E1005', 'Lecturer', '2022-01-05'),
('f006-id', 'f006-user-id', (SELECT id FROM departments WHERE code='CE'), 'E1006', 'Assistant Professor', '2019-07-15'),
('f007-id', 'f007-user-id', (SELECT id FROM departments WHERE code='ENG'), 'E1007', 'Lecturer', '2023-01-20'),
('f008-id', 'f008-user-id', (SELECT id FROM departments WHERE code='ARC'), 'E1008', 'Lecturer', '2021-11-10'),
('f009-id', 'f009-user-id', (SELECT id FROM departments WHERE code='TE'), 'E1009', 'Lecturer', '2022-06-01');

-- Update Department Heads
UPDATE departments SET head_faculty_id = 'f001-id' WHERE code='CSE';
UPDATE departments SET head_faculty_id = 'f004-id' WHERE code='LLB';

-- 4. PROGRAMS
INSERT INTO programs (id, department_id, name, degree_level, duration_years, total_credits) VALUES
('prog-cse-id', (SELECT id FROM departments WHERE code='CSE'), 'B.Sc. in Computer Science & Engineering', 'BACHELOR', 4.0, 148.5),
('prog-eee-id', (SELECT id FROM departments WHERE code='EEE'), 'B.Sc. in Electrical & Electronic Engineering', 'BACHELOR', 4.0, 152.0),
('prog-bba-id', (SELECT id FROM departments WHERE code='BBA'), 'Bachelor of Business Administration', 'BACHELOR', 4.0, 126.0),
('prog-llb-id', (SELECT id FROM departments WHERE code='LLB'), 'Bachelor of Laws', 'BACHELOR', 4.0, 132.0),
('prog-phr-id', (SELECT id FROM departments WHERE code='PHR'), 'Bachelor of Pharmacy', 'BACHELOR', 4.0, 160.0),
('prog-eng-id', (SELECT id FROM departments WHERE code='ENG'), 'B.A. in English', 'BACHELOR', 4.0, 120.0),
('prog-ce-id', (SELECT id FROM departments WHERE code='CE'), 'B.Sc. in Civil Engineering', 'BACHELOR', 4.0, 155.0),
('prog-arc-id', (SELECT id FROM departments WHERE code='ARC'), 'Bachelor of Architecture', 'BACHELOR', 5.0, 180.0),
('prog-te-id', (SELECT id FROM departments WHERE code='TE'), 'B.Sc. in Textile Engineering', 'BACHELOR', 4.0, 150.0),
('prog-jmc-id', (SELECT id FROM departments WHERE code='JMC'), 'B.A. in Journalism & Media Communication', 'BACHELOR', 4.0, 124.0);

-- 5. BATCHES
INSERT INTO batches (id, batch_number, batch_initial, program_id) VALUES
('b-cse-67-id', '67', '241', 'prog-cse-id'),
('b-eee-60-id', '60', '241', 'prog-eee-id'),
('b-bba-55-id', '55', '242', 'prog-bba-id'),
('b-llb-40-id', '40', '241', 'prog-llb-id'),
('b-phr-30-id', '30', '243', 'prog-phr-id'),
('b-cse-68-id', '68', '242', 'prog-cse-id'),
('b-eng-25-id', '25', '241', 'prog-eng-id'),
('b-ce-15-id', '15', '241', 'prog-ce-id'),
('b-arc-10-id', '10', '241', 'prog-arc-id'),
('b-te-20-id', '20', '241', 'prog-te-id');

-- 6. SECTIONS
INSERT INTO sections (id, name, batch_id) VALUES
(UUID(), 'A', 'b-cse-67-id'),
(UUID(), 'B', 'b-cse-67-id'),
(UUID(), 'A', 'b-eee-60-id'),
(UUID(), 'A', 'b-bba-55-id'),
(UUID(), 'B', 'b-bba-55-id'),
(UUID(), 'A', 'b-llb-40-id'),
(UUID(), 'A', 'b-phr-30-id'),
(UUID(), 'A', 'b-cse-68-id'),
(UUID(), 'C', 'b-cse-67-id'),
(UUID(), 'A', 'b-eng-25-id');

-- 7. USERS (STUDENTS) - Password: password123
INSERT INTO users (id, name, email, password_hash, role, must_change_password, is_verified, is_active) VALUES
('s001-user-id', 'Kaium Ahmed', 'kaium@student.rbu.edu.bd', @pass, 'STUDENT', 0, 1, 1),
('s002-user-id', 'Jihad Hasan', 'jihad@student.rbu.edu.bd', @pass, 'STUDENT', 0, 1, 1),
('s003-user-id', 'Anika Tabassum', 'anika@student.rbu.edu.bd', @pass, 'STUDENT', 0, 1, 1),
('s004-user-id', 'Rakib Hossain', 'rakib@student.rbu.edu.bd', @pass, 'STUDENT', 0, 1, 1),
('s005-user-id', 'Nishat Tasnim', 'nishat@student.rbu.edu.bd', @pass, 'STUDENT', 0, 1, 1),
('s006-user-id', 'Sajid Islam', 'sajid@student.rbu.edu.bd', @pass, 'STUDENT', 0, 1, 1),
('s007-user-id', 'Mehraj Uddin', 'mehraj@student.rbu.edu.bd', @pass, 'STUDENT', 0, 1, 1),
('s008-user-id', 'Sabrina Eva', 'sabrina@student.rbu.edu.bd', @pass, 'STUDENT', 0, 1, 1),
('s009-user-id', 'Tawsif Khan', 'tawsif@student.rbu.edu.bd', @pass, 'STUDENT', 0, 1, 1),
('s010-user-id', 'Afroza Sultana', 'afroza@student.rbu.edu.bd', @pass, 'STUDENT', 0, 1, 1);

-- 8. STUDENTS
INSERT INTO students (id, user_id, program_id, student_id, registration_no, batch_id, current_semester, cgpa, admitted_at, status) VALUES
('s001-id', 's001-user-id', 'prog-cse-id', '0241150050000101', '241-15-101', 'b-cse-67-id', 7, 3.85, '2024-01-01', 'ACTIVE'),
('s002-id', 's002-user-id', 'prog-cse-id', '0241150050000102', '241-15-102', 'b-cse-67-id', 7, 3.92, '2024-01-01', 'ACTIVE'),
('s003-id', 's003-user-id', 'prog-eee-id', '0241160050000201', '241-16-201', 'b-eee-60-id', 7, 3.70, '2024-01-01', 'ACTIVE'),
('s004-id', 's004-user-id', 'prog-bba-id', '0242110050000301', '242-11-301', 'b-bba-55-id', 4, 3.50, '2024-05-10', 'ACTIVE'),
('s005-id', 's005-user-id', 'prog-llb-id', '0241120050000401', '241-12-401', 'b-llb-40-id', 7, 3.65, '2024-01-01', 'ACTIVE'),
('s006-id', 's006-user-id', 'prog-phr-id', '0243130050000501', '243-13-501', 'b-phr-30-id', 1, 0.00, '2024-09-15', 'ACTIVE'),
('s007-id', 's007-user-id', 'prog-cse-id', '0242150050000601', '242-15-601', 'b-cse-68-id', 4, 3.40, '2024-05-10', 'ACTIVE'),
('s008-id', 's008-user-id', 'prog-eng-id', '0241140050000701', '241-14-701', 'b-eng-25-id', 7, 3.55, '2024-01-01', 'ACTIVE'),
('s009-id', 's009-user-id', 'prog-ce-id', '0241170050000801', '241-17-801', 'b-ce-15-id', 7, 3.30, '2024-01-01', 'ACTIVE'),
('s010-id', 's010-user-id', 'prog-arc-id', '0241180050000901', '241-18-901', 'b-arc-10-id', 7, 3.45, '2024-01-01', 'ACTIVE');

-- 9. COURSES
INSERT INTO courses (id, department_id, course_code, title, credit_hours, course_type, is_active) VALUES
('c-001', (SELECT id FROM departments WHERE code='CSE'), 'CSE311', 'Database Management System', 3.0, 'THEORY', 1),
('c-002', (SELECT id FROM departments WHERE code='CSE'), 'CSE312', 'Database Management System Lab', 1.0, 'LAB', 1),
('c-003', (SELECT id FROM departments WHERE code='CSE'), 'CSE221', 'Algorithms', 3.0, 'THEORY', 1),
('c-004', (SELECT id FROM departments WHERE code='EEE'), 'EEE101', 'Electrical Circuits I', 3.0, 'THEORY', 1),
('c-005', (SELECT id FROM departments WHERE code='BBA'), 'ACC101', 'Financial Accounting', 3.0, 'THEORY', 1),
('c-006', (SELECT id FROM departments WHERE code='LLB'), 'LAW101', 'Constitutional Law', 3.0, 'THEORY', 1),
('c-007', (SELECT id FROM departments WHERE code='PHR'), 'PHR101', 'Inorganic Pharmacy I', 3.0, 'THEORY', 1),
('c-008', (SELECT id FROM departments WHERE code='CE'), 'CE101', 'Engineering Mechanics', 3.0, 'THEORY', 1),
('c-009', (SELECT id FROM departments WHERE code='ENG'), 'ENG101', 'English Composition', 3.0, 'THEORY', 1),
('c-010', (SELECT id FROM departments WHERE code='ARC'), 'ARC101', 'Design Studio I', 4.0, 'PROJECT', 1);

-- 10. SEMESTERS
INSERT INTO semesters (id, name, start_date, end_date, registration_deadline, is_active) VALUES
('sem-summer-26-id', 'Summer 2026', '2026-05-01', '2026-08-30', '2026-05-15', 1),
('sem-spring-26-id', 'Spring 2026', '2026-01-01', '2026-04-30', '2026-01-15', 0),
('sem-fall-25-id', 'Fall 2025', '2025-09-01', '2025-12-31', '2025-09-15', 0);

-- 11. COURSE_OFFERINGS
INSERT INTO course_offerings (id, course_id, semester_id, faculty_id, batch_id, section_id, seat_limit) VALUES
('offering-1', 'c-001', 'sem-summer-26-id', 'f001-id', 'b-cse-67-id', (SELECT id FROM sections WHERE batch_id='b-cse-67-id' LIMIT 1), 40),
('offering-2', 'c-002', 'sem-summer-26-id', 'f001-id', 'b-cse-67-id', (SELECT id FROM sections WHERE batch_id='b-cse-67-id' OFFSET 1 LIMIT 1), 40),
('offering-3', 'c-004', 'sem-summer-26-id', 'f002-id', 'b-eee-60-id', (SELECT id FROM sections WHERE batch_id='b-eee-60-id' LIMIT 1), 40),
('offering-4', 'c-005', 'sem-summer-26-id', 'f003-id', 'b-bba-55-id', (SELECT id FROM sections WHERE batch_id='b-bba-55-id' LIMIT 1), 40);

SET FOREIGN_KEY_CHECKS = 1;
