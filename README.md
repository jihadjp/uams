# UAMS — DBMS Lab Project Database Package

Everything the viva/report needs, mapped 1:1 to the course rubric.
**Requires MySQL 8.0.16+** (CHECK constraints are enforced only from 8.0.16).

> ⚠️ **IMPORTANT — `uams` gets dropped & recreated.** Run `00_reset.sql` +
> `01_schema.sql` (or simply the loader script), which **deletes everything
> currently in the `uams` database** before rebuilding it for the lab.
> That's the point: it kills every "old layout" error in one shot
> (1364 default-value / 1054 unknown-column / 1265 data-truncated).
> The Spring Boot app recreates its own tables on next start
> (`spring.jpa.hibernate.ddl-auto=update`), and `02_seed_data.sql` also
> contains a self-healing compatibility patch if you cannot reset.

## Files → rubric mapping

| File | Contains | Rubric component |
| --- | --- | --- |
| `00_reset.sql` | `DROP` + `CREATE DATABASE uams` — the guaranteed-clean starting point | setup |
| `load_all.bat` / `load_all.sh` | one-double-click loader: 00 → 01 → 02 → 03 → 04 → 05 | setup |
| `01_schema.sql` | 14 tables, PK/FK/UNIQUE/ENUM/**CHECK**, indexes | **B** (schema + constraints) |
| `02_seed_data.sql` | **~1,330 realistic rows, every table ≥ 20**; idempotent (compat patch + truncate, safe to re-run) | **C** (populate) |
| `03_triggers.sql` | **9 triggers**: auto-grading, cross-table marks validation, fee-status derivation, enrollment gatekeeping, seat counter sync, published-result protection | **C** (composite method) |
| `04_procedures.sql` | **3 procedures**: semester GPA, transactional+locked enrollment, batch result publication with CGPA recompute | **C** (composite + transactions) |
| `05_views.sql` | **5 views**: transcript, attendance summary, fee collection, dept performance, course difficulty | **C** (composite) |
| `06_queries.sql` | 20 labeled queries: INSERT/UPDATE/DELETE, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT, 2/3/4-table JOINs, aggregates, correlated/IN/EXISTS/derived/scalar subqueries, functions, UNION | **C** (SQL queries) |
| `07_analysis.sql` | 6 hypotheses with evidence queries + findings | **D** (investigation) |
| `08_roles.sql` | 5 least-privilege DB users + grants (optional) | **C** (roles/privileges) |
| `ER_CONCEPTUAL.svg` | **Chen-notation ERD** (sir's requirement) — print/screenshot for the report | **B / E** |
| `ER_DIAGRAM.md` | Schema-vs-ERD explainer + crow's-foot mermaid diagram + conversion mapping + 3NF | **B / E** |
| `tools/generate_erd_svg.py` | deterministic generator for `ER_CONCEPTUAL.svg` | reproducibility |
| `tools/generate_seed.py` | deterministic generator for `02_seed_data.sql` | reproducibility |
| `tools/verify_seed.py` | structural sanity check (columns, PKs, FKs, clearance rule) | reproducibility |

## Load order (viva setup, ~1 minute)

**Easiest — use the loader** (it runs everything below in the right order):

```bat
:: Windows — double-click, or run in a terminal:
load_all.bat
```
```bash
# Linux / macOS / WSL:
bash load_all.sh
```

**Or step by step** (run from this `database/` folder):

```bash
mysql -u root -p < 00_reset.sql        # drop + recreate `uams` (recommended)
mysql -u root -p < 01_schema.sql       # tables + constraints
mysql -u root -p < 02_seed_data.sql    # all demo data (idempotent)
mysql -u root -p < 03_triggers.sql     # triggers
mysql -u root -p < 04_procedures.sql   # procedures
mysql -u root -p < 05_views.sql        # views
mysql -u root -p uams < 08_roles.sql   # optional: roles/privileges marks
```

Then open 06/07 and run queries one by one for the report screenshots.

Regenerate the seed any time: `python3 tools/generate_seed.py`
(verify with `python3 tools/verify_seed.py`).

## Troubleshooting (the errors you actually hit)

| Error | Why it happens | Fix |
| --- | --- | --- |
| `ERROR 1364: Field 'batch_id' doesn't have a default value` | `uams` was created by the **Spring app** (`ddl-auto=update`), whose `students`/`course_offerings` tables have extra NOT NULL FK columns our layout doesn't use | Run the loader / `00_reset.sql` first. If you can't reset, no worry — **02's compatibility patch now auto-makes those columns NULL** before inserting |
| `ERROR 1054: Unknown column 'term' ...` | `uams` came from the **old script** (`backend/university_academic_management_schema.sql`), which lacks `term`, `academic_year`, `course_type`, `seats_taken`, … | Same cure: reset, or let 02's patch add the missing columns automatically |
| `ERROR 1265: Data truncated for column 'target_role'` | Old script's `notices.target_role` ENUM has no `'REGISTRAR'` value | 02's patch widens the ENUM automatically |
| `ERROR 1062: Duplicate entry ...` | 02 was run twice on old data | 02 now `TRUNCATE`s the 14 tables first — just re-run it |
| `ERROR 1045: Access denied` | Wrong user/password or no privileges | Use an account with DDL rights (default loader user: `root`) |
| `Trigger already exists` / `procedure already exists` on re-run | — | 03/04/05 all start with `DROP ... IF EXISTS`; simply re-run |
| MySQL < 8.0.16 ignores CHECK constraints | Upgrade to MySQL 8+ for full marks | XAMPP ≥ 8.x / MySQL Installer 8.x |

## Viva demo script (copy-paste ready)

```sql
USE uams;

-- 0) Prove the scale & every-table-≥20 requirement
SELECT 'users' t, COUNT(*) FROM users UNION ALL
SELECT 'departments', COUNT(*) FROM departments UNION ALL
SELECT 'enrollments', COUNT(*) FROM enrollments UNION ALL
SELECT 'results', COUNT(*) FROM results UNION ALL
SELECT 'attendance', COUNT(*) FROM attendance;

-- 1) TRIGGER: marks can never exceed the exam's total marks
SET @enr := (SELECT id FROM enrollments WHERE status='REGISTERED' LIMIT 1);
SET @exm := (SELECT id FROM exams LIMIT 1);
INSERT INTO results (id, enrollment_id, exam_id, marks_obtained)
VALUES (UUID(), @enr, @exm, 99999);
-- ERROR 1644 (45000): marks exceed exam total marks  <-- rule enforced

-- 1b) TRIGGER: a LEGAL mark gets grade + grade_point automatically
SET @exm20 := (SELECT id FROM exams WHERE total_marks = 20 LIMIT 1);
INSERT INTO results (id, enrollment_id, exam_id, marks_obtained)
VALUES (UUID(), @enr, @exm20, 16);
SELECT marks_obtained, grade, grade_point FROM results
 WHERE enrollment_id = @enr AND exam_id = @exm20;   -- 16/20 = 80% -> A+ 4.00

-- 2) TRIGGER + UPDATE: paying a bill flips status & stamps paid_at
UPDATE fees SET amount_paid = amount_due
 WHERE id = (SELECT x.id FROM (SELECT id FROM fees WHERE status='PARTIAL'
             ORDER BY created_at DESC LIMIT 1) x);
SELECT status, paid_at FROM fees WHERE status='PAID' ORDER BY paid_at DESC LIMIT 1;

-- 3) TRIGGER: blocked enrollment — student whose fee is NOT cleared
SET @blocked := (SELECT id FROM students WHERE is_registration_cleared = 0 LIMIT 1);
SET @offrg  := (SELECT id FROM course_offerings LIMIT 1);
INSERT INTO enrollments (id, student_id, offering_id) VALUES (UUID(), @blocked, @offrg);
-- ERROR 1644 (45000): registration not cleared  <-- business rule fires

-- 4) PROCEDURE: semester GPA (OUT parameter)
SET @sid := (SELECT id FROM students WHERE registration_no = '231-15-111');
SET @sem := (SELECT id FROM semesters WHERE term='FALL' AND academic_year=2025);
CALL sp_calculate_semester_gpa(@sid, @sem, @gpa);
SELECT @gpa AS fall_2025_gpa;

-- 5) PROCEDURE + TRANSACTION + LOCK: safe enrollment end-to-end
INSERT INTO course_offerings (id, course_id, semester_id, faculty_id, target_batch)
SELECT UUID(), c.id, s.id, f.id, '54'
  FROM courses c, semesters s, faculty f
 WHERE c.course_code='CSE331' AND s.term='FALL' AND s.academic_year=2026
   AND f.employee_id='EMP-0001' LIMIT 1;
SET @newoff := (SELECT id FROM course_offerings ORDER BY created_at DESC LIMIT 1);
-- pick a cleared student who has actually PASSED the CSE221 prerequisite:
SET @stu := (
  SELECT e.student_id FROM enrollments e
   JOIN course_offerings po ON po.id = e.offering_id
   JOIN courses pc ON pc.id = po.course_id AND pc.course_code = 'CSE221'
   JOIN results r ON r.enrollment_id = e.id AND r.is_final_result = 1
   JOIN students s ON s.id = e.student_id
  WHERE e.status = 'COMPLETED' AND r.grade_point >= 2.00
    AND s.is_registration_cleared = 1
  LIMIT 1);
SELECT seats_taken FROM course_offerings WHERE id=@newoff;          -- BEFORE
CALL sp_enroll_student(@stu, @newoff, 'REGULAR');
SELECT seats_taken FROM course_offerings WHERE id=@newoff;          -- AFTER (+1)

-- 5b) The same call again -> duplicate blocked, transaction rolls back
CALL sp_enroll_student(@stu, @newoff, 'REGULAR');
-- ERROR 1644 (45000): already registered for this course section

-- 6) VIEW: transcript lens (only published, final rows)
SELECT * FROM vw_student_transcript WHERE registration_no='221-15-101';

-- 7) Big finale: publish the whole ONGOING semester in ONE transaction
SET @cur := (SELECT id FROM semesters WHERE status='ONGOING');
CALL sp_publish_semester_results(@cur);
SELECT * FROM vw_department_performance;   -- CGPAs moved
```

## EP attributes — where each is demonstrated (for the report)

- **EP1 (depth of knowledge / K-levels):** credit-weighted GPA mathematics,
  trigger-maintained derived data, 3NF justification, cross-table business
  rules encoded as database logic.
- **EP2 (conflicting requirements):** seat-limit enforcement vs. concurrent
  registration (solved with `FOR UPDATE` row locking + trigger counters);
  audit-immutability of published results vs. correctability of draft data;
  normalization vs. performance (`seats_taken` denormalization trade-off);
  fee clearance gate vs. student convenience.
- **EP4 (infrequently encountered issues):** race conditions in seat
  allocation, MySQL trigger limitations (no self-table reads, CASCADE does
  not fire triggers), atomic batch publication over thousands of rows.
- **USP suggestion:** *fee-clearance → registration → seat-safety chain* —
  a student's financial clearance status physically gates course registration
  at the **database** level (not just the UI), and the last seat can never be
  sold twice. Present this as the project's signature feature, backed by
  `sp_enroll_student` + `trg_enrollments_before_insert`.

## Notes

- Seed `password_hash` values are **demo placeholders**; the portal forces a
  password change on first login (`must_change_password = 1`).
- Grading scale lives in exactly two places that must stay in sync:
  `03_triggers.sql` (runtime) and `tools/generate_seed.py` (historical data).
- The schema matches the app's JPA entities for all core columns; columns the
  lab adds (`seats_taken`, `course_type`, extended `semesters` fields, CHECKs)
  are harmless to the app (`spring.jpa.hibernate.ddl-auto=update` only ever
  adds, never removes).