# UAMS: Deep Dive into Database Logic

This document explains the "Technical Engine" of your project—the SQL Triggers, Stored Procedures, and Views that automate the university's business rules.

---

## ⚡ 1. SQL Triggers (`triggers.sql`)
*Triggers are automated scripts that act as a "Final Safety Net" for data integrity.*

### `trg_attendance_low_warning`
- **When**: After an attendance record is inserted.
- **Logic**: It calculates the student's current attendance percentage for that specific course offering.
- **Outcome**: If the attendance is **< 75%** (monitored after 5 classes), it automatically creates a warning record in the `notices` table.
- **Presentation Tip**: Highlight this as "Automated Student Alerting."

### `trg_enrollment_requires_clearance`
- **When**: Before a student is enrolled in a course.
- **Logic**: It checks the `semester_clearance` table to see if `registration_cleared` is `TRUE`.
- **Outcome**: If the student hasn't paid fees or hasn't been cleared by the Registrar, the database **blocks** the enrollment and throws an error: *"Enrollment blocked: student is not registration-cleared."*

### `trg_fee_auto_paid_at`
- **When**: Before a fee record is updated.
- **Logic**: Compares `amount_paid` against `registration_fee + credit_fee`.
- **Outcome**: Automatically manages the `paid_at` timestamp. If the payment is complete, the date is set; if the payment is reversed, the date is cleared.

---

## ⚙️ 2. Stored Procedures (`procedures.sql`)
*Procedures are complex functions called to handle multi-step academic processes.*

### `sp_publish_results`
- **The Workflow**: Marks are entered by Faculty → Stays 'Pending' → Registrar calls this procedure → Grades go 'Live'.
- **Security Check**: It counts the number of students enrolled vs. the number of final marks entered. If even **one** student's mark is missing, it refuses to publish.
- **Outcome**: Sets `published_at` for all results and moves enrollment status from `REGISTERED` to `COMPLETED`.

### `sp_clear_student_registration`
- **Purpose**: Automates the Registrar's "Clearance" task.
- **Internal Logic**: Calculates `(registration_fee + credit_fee - amount_paid)`.
- **Outcome**: If the balance is `0`, it marks the student as cleared for the semester. If there is even 1 Taka outstanding, it blocks the clearance.

---

## 📊 3. Analytical Views (`views.sql`)
*Views are pre-computed virtual tables that power the Dashboards without slowing down the system.*

### `v_student_semester_summary` (The CGPA Engine)
- **Complexity**: This view performs a "Nested Select" on the `grading_policies` table. It looks at a student's marks (e.g., 85) and dynamically finds the matching grade point (4.0).
- **Usage**: Powers the Student Dashboard showing **Semester GPA** and **Credits Earned**.

### `v_offering_attendance_summary`
- **Faculty Tool**: Instead of looking at individual attendance sheets, this view aggregates data for an entire section.
- **Metrics**: Displays `total_students`, `present_count`, and a calculated `attendance_percentage`.

### `v_student_fee_status`
- **Registrar Dashboard**: Combines student profiles with financial data.
- **Calculation**: Dynamically generates an `outstanding` column and a `payment_status` label (PAID/PARTIAL/UNPAID) based on the payment ratio.

---

> [!IMPORTANT]
> **Key Point for Defense**: Mention that you chose to put this logic in the **Database Layer** rather than the Java code to ensure that even if the website has a bug, the university's academic rules are **never** violated.
