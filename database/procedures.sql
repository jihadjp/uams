-- ============================================================
-- UAMS — Stored Procedures
-- University Academic Management System
-- ============================================================
USE uams;

DELIMITER $$

-- ------------------------------------------------------------
-- Procedure 1: Publish results for a course offering
-- Only after marks exist; marks offering as approved
-- Matches report: sp_publish_results
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_publish_results $$
CREATE PROCEDURE sp_publish_results(
    IN p_offering_id CHAR(36),
    OUT p_message VARCHAR(255)
)
    proc_body: BEGIN
    DECLARE v_exam_count INT DEFAULT 0;
    DECLARE v_result_count INT DEFAULT 0;
    DECLARE v_enrollment_count INT DEFAULT 0;
    DECLARE v_already_approved BOOLEAN DEFAULT FALSE;

    -- Check offering exists and approval status
SELECT is_results_approved
INTO v_already_approved
FROM course_offerings
WHERE id = p_offering_id;

IF v_already_approved IS NULL THEN
        SET p_message = 'Course offering not found.';
        LEAVE proc_body;
END IF;

    IF v_already_approved = TRUE THEN
        SET p_message = 'Results already approved for this offering.';
        LEAVE proc_body;
END IF;

    -- Count exams and enrollments for this offering
SELECT COUNT(*) INTO v_exam_count
FROM exams
WHERE offering_id = p_offering_id;

SELECT COUNT(*) INTO v_enrollment_count
FROM enrollments
WHERE offering_id = p_offering_id
  AND status = 'REGISTERED';

IF v_exam_count = 0 THEN
        SET p_message = 'No exams found for this offering. Cannot publish.';
        LEAVE proc_body;
END IF;

    IF v_enrollment_count = 0 THEN
        SET p_message = 'No active enrollments for this offering.';
        LEAVE proc_body;
END IF;

    -- Count final results entered
SELECT COUNT(*) INTO v_result_count
FROM results r
         JOIN enrollments e ON e.id = r.enrollment_id
WHERE e.offering_id = p_offering_id
  AND r.is_final_result = TRUE
  AND r.marks_obtained IS NOT NULL;

IF v_result_count < v_enrollment_count THEN
        SET p_message = CONCAT(
            'Incomplete marks: ', v_result_count, ' of ',
            v_enrollment_count, ' students have final results.'
        );
        LEAVE proc_body;
END IF;

    -- Publish: set published_at and approve offering
UPDATE results r
    JOIN enrollments e ON e.id = r.enrollment_id
    SET r.published_at = CURRENT_TIMESTAMP
WHERE e.offering_id = p_offering_id
  AND r.is_final_result = TRUE
  AND r.published_at IS NULL;

UPDATE course_offerings
SET is_results_approved = TRUE
WHERE id = p_offering_id;

-- Mark enrollments completed
UPDATE enrollments
SET status = 'COMPLETED'
WHERE offering_id = p_offering_id
  AND status = 'REGISTERED';

SET p_message = CONCAT(
        'Results published successfully for offering. ',
        v_result_count, ' final results released.'
    );
END $$

-- ------------------------------------------------------------
-- Procedure 2: Calculate attendance percentage for one enrollment
-- Returns percentage based on PRESENT + LATE vs total records
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_get_attendance_percentage $$
CREATE PROCEDURE sp_get_attendance_percentage(
    IN p_enrollment_id CHAR(36),
    OUT p_percentage DECIMAL(5,2),
    OUT p_total_classes INT,
    OUT p_attended INT
)
BEGIN
SELECT
    COUNT(*),
    SUM(CASE WHEN status IN ('PRESENT', 'LATE') THEN 1 ELSE 0 END)
INTO p_total_classes, p_attended
FROM attendance
WHERE enrollment_id = p_enrollment_id;

IF p_total_classes IS NULL OR p_total_classes = 0 THEN
        SET p_percentage = 0.00;
        SET p_total_classes = 0;
        SET p_attended = 0;
ELSE
        SET p_percentage = ROUND(100.0 * p_attended / p_total_classes, 2);
END IF;
END $$

-- ------------------------------------------------------------
-- Procedure 3: Clear a student for registration in a semester
-- (sets semester_clearance.registration_cleared = TRUE)
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_clear_student_registration $$
CREATE PROCEDURE sp_clear_student_registration(
    IN p_student_id CHAR(36),
    IN p_semester_id CHAR(36),
    OUT p_message VARCHAR(255)
)
    proc_body: BEGIN
    DECLARE v_fee_outstanding DECIMAL(12,2) DEFAULT 0;
    DECLARE v_exists INT DEFAULT 0;

    -- Check student exists
    IF NOT EXISTS (SELECT 1 FROM students WHERE id = p_student_id) THEN
        SET p_message = 'Student not found.';
        LEAVE proc_body;
END IF;

    -- Check outstanding fees for this semester
SELECT COALESCE(
               (registration_fee + credit_fee - amount_paid), 0
       )
INTO v_fee_outstanding
FROM fees
WHERE student_id = p_student_id
  AND semester_id = p_semester_id
    LIMIT 1;

IF v_fee_outstanding > 0 THEN
        SET p_message = CONCAT(
            'Cannot clear registration. Outstanding fee: ',
            v_fee_outstanding
        );
        LEAVE proc_body;
END IF;

    -- Upsert clearance row
SELECT COUNT(*) INTO v_exists
FROM semester_clearance
WHERE student_id = p_student_id
  AND semester_id = p_semester_id;

IF v_exists = 0 THEN
        INSERT INTO semester_clearance (
            id, student_id, semester_id,
            registration_cleared, midterm_cleared, final_exam_cleared
        ) VALUES (
            UUID(), p_student_id, p_semester_id,
            TRUE, FALSE, FALSE
        );
ELSE
UPDATE semester_clearance
SET registration_cleared = TRUE
WHERE student_id = p_student_id
  AND semester_id = p_semester_id;
END IF;

    -- Also set flag on student record
UPDATE students
SET is_registration_cleared = TRUE
WHERE id = p_student_id;

SET p_message = 'Student registration cleared successfully.';
END $$

DELIMITER ;
