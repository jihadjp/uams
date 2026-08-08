-- ============================================================
-- UAMS — Triggers
-- University Academic Management System
-- ============================================================
USE uams;

DELIMITER $$

-- ------------------------------------------------------------
-- Trigger 1: After attendance insert — log low attendance warning
-- When attendance falls below 75%, write a notice for the student
-- (Matches report: attendance threshold trigger)
-- ------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_attendance_low_warning $$
CREATE TRIGGER trg_attendance_low_warning
    AFTER INSERT ON attendance
    FOR EACH ROW
BEGIN
    DECLARE v_total INT DEFAULT 0;
    DECLARE v_attended INT DEFAULT 0;
    DECLARE v_pct DECIMAL(5,2) DEFAULT 0;
    DECLARE v_student_user_id CHAR(36);
    DECLARE v_student_name VARCHAR(150);
    DECLARE v_course_code VARCHAR(20);
    DECLARE v_offering_id CHAR(36);

    -- Only evaluate when we have some records
    SELECT
        COUNT(*),
        SUM(CASE WHEN status IN ('PRESENT', 'LATE') THEN 1 ELSE 0 END)
    INTO v_total, v_attended
    FROM attendance
    WHERE enrollment_id = NEW.enrollment_id;

    IF v_total >= 5 THEN
        SET v_pct = ROUND(100.0 * v_attended / v_total, 2);

        IF v_pct < 75.00 THEN
            -- Resolve student user and course for the notice
    SELECT u.id, u.name, c.course_code, e.offering_id
    INTO v_student_user_id, v_student_name, v_course_code, v_offering_id
    FROM enrollments e
             JOIN students s ON s.id = e.student_id
             JOIN users u ON u.id = s.user_id
             JOIN course_offerings co ON co.id = e.offering_id
             JOIN courses c ON c.id = co.course_id
    WHERE e.id = NEW.enrollment_id
        LIMIT 1;

    -- Insert a targeted notice (posted_by = student themselves as system proxy
    -- In production, prefer a system admin user id)
    IF v_student_user_id IS NOT NULL THEN
                INSERT INTO notices (
                    id, title, content, posted_by,
                    target_role, category, created_at
                ) VALUES (
                    UUID(),
                    CONCAT('Low Attendance Warning: ', v_course_code),
                    CONCAT(
                        'Dear ', v_student_name,
                        ', your attendance in ', v_course_code,
                        ' has fallen to ', v_pct,
                        '%. University policy requires at least 75%. ',
                        'Please attend remaining classes regularly.'
                    ),
                    v_student_user_id,
                    'STUDENT',
                    'Attendance',
                    CURRENT_TIMESTAMP
                );
END IF;
END IF;
END IF;
END $$

-- ------------------------------------------------------------
-- Trigger 2: Prevent enrollment if registration not cleared
-- for the semester of the offering
-- ------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_enrollment_requires_clearance $$
CREATE TRIGGER trg_enrollment_requires_clearance
    BEFORE INSERT ON enrollments
    FOR EACH ROW
BEGIN
    DECLARE v_semester_id CHAR(36);
    DECLARE v_cleared BOOLEAN DEFAULT FALSE;

    SELECT semester_id INTO v_semester_id
    FROM course_offerings
    WHERE id = NEW.offering_id
        LIMIT 1;

    IF v_semester_id IS NOT NULL THEN
    SELECT registration_cleared INTO v_cleared
    FROM semester_clearance
    WHERE student_id = NEW.student_id
      AND semester_id = v_semester_id
        LIMIT 1;

    IF v_cleared IS NULL OR v_cleared = FALSE THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Enrollment blocked: student is not registration-cleared for this semester.';
END IF;
END IF;
END $$

-- ------------------------------------------------------------
-- Trigger 3: Auto-set fee paid_at when amount_paid covers total
-- ------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_fee_auto_paid_at $$
CREATE TRIGGER trg_fee_auto_paid_at
    BEFORE UPDATE ON fees
    FOR EACH ROW
BEGIN
    IF NEW.amount_paid >= (NEW.registration_fee + NEW.credit_fee)
       AND (OLD.amount_paid < (OLD.registration_fee + OLD.credit_fee)
            OR OLD.paid_at IS NULL) THEN
        SET NEW.paid_at = CURRENT_TIMESTAMP;
END IF;

-- If payment reduced below total, clear paid_at
IF NEW.amount_paid < (NEW.registration_fee + NEW.credit_fee) THEN
        SET NEW.paid_at = NULL;
END IF;
END $$

DELIMITER ;
