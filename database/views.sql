-- ============================================================
-- UAMS — Views
-- University Academic Management System
-- ============================================================
USE uams;

-- ------------------------------------------------------------
-- View 1: Student semester summary (GPA + credits)
-- Used by student dashboard and advisor portal
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW v_student_semester_summary AS
SELECT
    s.id AS student_pk,
    s.student_id,
    s.registration_no,
    u.name AS student_name,
    sem.id AS semester_id,
    sem.name AS semester_name,
    sem.term,
    sem.academic_year,
    COUNT(DISTINCT e.id) AS total_enrollments,
    COUNT(DISTINCT CASE WHEN e.status = 'COMPLETED' THEN e.id END) AS completed_courses,
    ROUND(
            SUM(
                    CASE
                        WHEN r.is_final_result = TRUE AND r.marks_obtained IS NOT NULL
                            THEN (
                            SELECT gp.grade_point
                            FROM grading_policies gp
                            WHERE r.marks_obtained BETWEEN gp.min_marks AND gp.max_marks
                            LIMIT 1
                ) * c.credit_hours
                ELSE 0
            END
        )
                /
            NULLIF(SUM(
                           CASE
                               WHEN r.is_final_result = TRUE AND r.marks_obtained IS NOT NULL
                                   THEN c.credit_hours
                               ELSE 0
                               END
                   ), 0)
        , 2) AS semester_gpa,
    SUM(
            CASE
                WHEN r.is_final_result = TRUE AND r.marks_obtained IS NOT NULL
                    THEN c.credit_hours
                ELSE 0
                END
    ) AS credits_earned
FROM students s
         JOIN users u ON u.id = s.user_id
         JOIN enrollments e ON e.student_id = s.id
         JOIN course_offerings co ON co.id = e.offering_id
         JOIN courses c ON c.id = co.course_id
         JOIN semesters sem ON sem.id = co.semester_id
         LEFT JOIN results r ON r.enrollment_id = e.id AND r.is_final_result = TRUE
GROUP BY
    s.id, s.student_id, s.registration_no, u.name,
    sem.id, sem.name, sem.term, sem.academic_year;

-- ------------------------------------------------------------
-- View 2: Course offering attendance summary
-- Helps faculty see attendance % per offering
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW v_offering_attendance_summary AS
SELECT
    co.id AS offering_id,
    c.course_code,
    c.title AS course_title,
    sem.name AS semester_name,
    f.employee_id AS faculty_employee_id,
    uf.name AS faculty_name,
    COUNT(DISTINCT e.id) AS total_students,
    COUNT(a.id) AS total_attendance_records,
    SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) AS present_count,
    SUM(CASE WHEN a.status = 'ABSENT' THEN 1 ELSE 0 END) AS absent_count,
    SUM(CASE WHEN a.status = 'LATE' THEN 1 ELSE 0 END) AS late_count,
    ROUND(
            100.0 * SUM(CASE WHEN a.status IN ('PRESENT', 'LATE') THEN 1 ELSE 0 END)
                / NULLIF(COUNT(a.id), 0)
        , 2) AS attendance_percentage
FROM course_offerings co
         JOIN courses c ON c.id = co.course_id
         JOIN semesters sem ON sem.id = co.semester_id
         JOIN faculty f ON f.id = co.faculty_id
         JOIN users uf ON uf.id = f.user_id
         LEFT JOIN enrollments e ON e.offering_id = co.id AND e.status = 'REGISTERED'
         LEFT JOIN attendance a ON a.enrollment_id = e.id
GROUP BY
    co.id, c.course_code, c.title, sem.name,
    f.employee_id, uf.name;

-- ------------------------------------------------------------
-- View 3: Fee collection status per student per semester
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW v_student_fee_status AS
SELECT
    s.student_id,
    u.name AS student_name,
    sem.name AS semester_name,
    sem.academic_year,
    f.registration_fee,
    f.credit_fee,
    (f.registration_fee + f.credit_fee) AS total_due,
    f.amount_paid,
    (f.registration_fee + f.credit_fee - f.amount_paid) AS outstanding,
    CASE
        WHEN f.amount_paid >= (f.registration_fee + f.credit_fee) THEN 'PAID'
        WHEN f.amount_paid > 0 THEN 'PARTIAL'
        ELSE 'UNPAID'
        END AS payment_status,
    f.due_date,
    f.paid_at
FROM fees f
         JOIN students s ON s.id = f.student_id
         JOIN users u ON u.id = s.user_id
         JOIN semesters sem ON sem.id = f.semester_id;
