# UAMS Database — একটা ছাত্রের গল্প দিয়ে পুরো সিস্টেম বোঝা

## কেন এইভাবে লিখলাম?

আগেরবার টেবিল ধরে ধরে ভাগ করে বুঝিয়েছিলাম। এবার একটু অন্যভাবে করি — একজন কাল্পনিক ছাত্র **"রাফি"**-কে নিয়ে ভর্তি থেকে গ্র্যাজুয়েশন পর্যন্ত একটা গল্প বলি। রাফির জার্নি অনুসরণ করলে দেখবেন প্রতিটা টেবিল **কখন, কেন** ব্যবহার হচ্ছে সেটা এমনিতেই বোঝা যাবে — মুখস্থ করতে হবে না।

---

## ধাপ ১ — রাফি প্রথম সিস্টেমে ঢুকলো

রাফি ভর্তি হওয়ার আগে তার একটা ইমেইল, নাম, পাসওয়ার্ড দিয়ে অ্যাকাউন্ট খোলা হলো। এটা যায় **`users`** টেবিলে, আর তার `role` সেট হয় `STUDENT`।

> **মনে রাখার মতো কথা:** `users` টেবিল হলো "সবার প্রথম দরজা"। প্রশাসক, শিক্ষক, ছাত্র, রেজিস্ট্রার — সবাই এই একই দরজা দিয়ে ঢোকে। তারপর যার যার role অনুযায়ী তাকে আলাদা ঘরে (`faculty` বা `students`) পাঠানো হয়।

এখন রাফির role যেহেতু STUDENT, তার জন্য **`students`** টেবিলে একটা নতুন প্রোফাইল খোলা হলো, আর সেটা `users`-এর সাথে `user_id` দিয়ে ১:১ যুক্ত করা হলো।

---

## ধাপ ২ — রাফি কোথায় ভর্তি হলো?

রাফি ভর্তি হলো **Computer Science Department**-এ, **"BSc in CSE"** প্রোগ্রামে, **"Fall 2024" batch**-এ, আর তাকে **Section B**-তে রাখা হলো।

এই চারটা জিনিসের সম্পর্কটা একটা বাক্সের ভেতরে বাক্সের মতো:

```
Department (Computer Science)
   └── Program (BSc in CSE)
          └── Batch (Fall 2024)
                 └── Section (Section B)
```

তাহলে `students` টেবিলে রাফির রো-তে এখন চারটা foreign key বসে গেলো: `program_id`, `batch_id`, `section_id` — আর department-টা program-এর মধ্য দিয়ে পরোক্ষভাবে (indirectly) যুক্ত থাকলো।

রাফির একজন **advisor** (উপদেষ্টা শিক্ষক)-ও ঠিক করা হলো — সেটা **`faculty`** টেবিল থেকে একজনকে বেছে `advisor_id` হিসেবে বসানো হলো। আর তার অভিভাবকের তথ্য গেলো **`guardians`** টেবিলে, `guardian_id` দিয়ে যুক্ত।

---

## ধাপ ৩ — রাফির ভর্তির ফি

ভর্তি হওয়ার সময় রাফিকে ফি দিতে হয়। এখানে দুটো টেবিলের পার্থক্য বোঝা জরুরি:

- **`batch_semester_fees`** — এটা হলো "রেট কার্ড" — মানে "Fall 2024 batch"-এর ছাত্রদের এই সেমিস্টারে কত ফি লাগবে, সেই নিয়মটা এখানে লেখা থাকে (batch + semester ধরে)।
- **`fees`** — এটা হলো রাফির **নিজের আসল বিল** — সে কত দিয়েছে, কবে দিয়েছে, বাকি কত আছে।

> **সহজ উপমা:** `batch_semester_fees` হলো দোকানের "প্রাইস ট্যাগ", আর `fees` হলো রাফির নিজের "রশিদ (receipt)"।

---

## ধাপ ৪ — রাফি এবার ক্লাস নিতে শুরু করলো

এখানে আসল মজাটা শুরু হয়। প্রথমে বুঝতে হবে দুটো জিনিসের তফাত:

- **`courses`** — এটা কোর্সের "সংজ্ঞা", যেমন "CS201 — Data Structures"। এটা সবসময় একই থাকে, চাই এটা কেউ পড়ুক বা না পড়ুক।
- **`course_offerings`** — এটা হলো "এই সেমিস্টারে বাস্তবে ক্লাসটা হচ্ছে" — CS201, Fall 2024, পড়াচ্ছেন Dr. Karim, Section B-এর জন্য, রুম নাম্বার সহ।

রাফি যখন এই ক্লাসটা নিতে চাইলো, তখন তৈরি হলো একটা **`enrollments`** রো — এটাই হলো "রাফি + এই course_offering" — এই দুইয়ের মাঝের সেতু (bridge)।

> **মনে রাখুন:** `courses` হলো রান্নার রেসিপি বই-এর একটা পাতা। `course_offerings` হলো আজ রান্নাঘরে সত্যিই রান্না হচ্ছে। আর `enrollments` হলো রাফির প্লেট — সে এই রান্নাটা খাচ্ছে।

---

## ধাপ ৫ — সেমিস্টার চলতে থাকলো: হাজিরা, পরীক্ষা, রেজাল্ট

রাফির `enrollment`-টাকে কেন্দ্র করে এখন তিনটা জিনিস চলতে থাকে:

1. প্রতিদিন ক্লাসে এলে **`attendance`** টেবিলে একটা রো যোগ হয় (Present/Absent/Late)।
2. সেমিস্টারে যতগুলো পরীক্ষা হয় (Quiz, Midterm, Final...) — সেগুলো সংজ্ঞায়িত থাকে **`exams`** টেবিলে, course_offering-এর সাথে যুক্ত।
3. রাফি প্রতিটা exam-এ যে নম্বর পায়, সেটা যায় **`results`** টেবিলে — এখানে `enrollment_id` আর `exam_id` দুটোই যুক্ত থাকে।

**পুরো চেইনটা যদি একসাথে দেখি:**

```
রাফি (students)
   → এনরোল করলো (enrollments)
        → এই কোর্স-অফারিং-এ (course_offerings)
             → যেটার আন্ডারে আছে (courses)
        → এই এনরোলমেন্টের জন্য পরীক্ষা হলো (exams)
             → নম্বর উঠলো (results)
        → প্রতিদিনের হাজিরা রেকর্ড হলো (attendance)
```

সেমিস্টার শেষে রাফি চাইলে সেই কোর্স আর শিক্ষকের ওপর একটা মূল্যায়ন (survey) দিতে পারে — সেটা যায় **`evaluations`** টেবিলে (১০টা প্রশ্নের উত্তর + মন্তব্য)।

---

## ধাপ ৬ — সেমিস্টার শেষে ছাড়পত্র (clearance)

সেমিস্টার শেষ হওয়ার আগে রাফিকে তিনটা ধাপ পার হতে হয় — রেজিস্ট্রেশন ক্লিয়ার, মিডটার্ম ক্লিয়ার, ফাইনাল এক্সাম ক্লিয়ার। এই তিনটা true/false ফ্ল্যাগ থাকে **`semester_clearance`** টেবিলে, রাফি আর সেই নির্দিষ্ট semester ধরে।

আর পুরো সেমিস্টারটা কবে শুরু, কবে শেষ, কবে রেজিস্ট্রেশনের ডেডলাইন — এসব থাকে **`semesters`** টেবিলে। এই টেবিলটার একটা `status` আছে যেটা বদলাতে থাকে:

```
UPCOMING → REGISTRATION → ONGOING → FINAL_EXAMS → GRADING → COMPLETED
```

আর সেমিস্টারের ভেতরে বিভিন্ন গুরুত্বপূর্ণ তারিখ (যেমন "Add/Drop শেষ হবে ১৫ তারিখ") থাকে **`calendar_events`** টেবিলে, যেটা **`academic_calendars`**-এর মধ্য দিয়ে সেমিস্টারের সাথে যুক্ত।

---

## ধাপ ৭ — রাফি একটা নোটিশ দেখলো

ডিপার্টমেন্ট একটা নোটিশ দিলো "মিডটার্ম রুটিন প্রকাশিত" — এটা যায় **`notices`** টেবিলে, কে পোস্ট করলো (`posted_by`, একজন `user`) সেটাও সাথে থাকে। রাফি নোটিশটা খুললে **`notice_views`** টেবিলে একটা রেকর্ড হয় — "রাফি এই নোটিশটা দেখেছে"।

---

## ধাপ ৮ — রাফির আর্থিক সমস্যা হলো, স্কলারশিপে আবেদন করলো

ইউনিভার্সিটি একটা স্কলারশিপ ঘোষণা করলো — সেটা **`financial_aid_circulars`** টেবিলে। রাফি সেটাতে আবেদন করলো — সেই আবেদন যায় **`financial_aid_applications`** টেবিলে, যেটা রাফি (`student_id`) আর সার্কুলার (`circular_id`) দুটোর সাথেই যুক্ত।

---

## ধাপ ৯ — চার বছর পর, রাফি গ্র্যাজুয়েট হতে চলেছে

শেষ ধাপে দুটো জিনিস ঘটে:

- রাফি তার সার্টিফিকেট/ট্রান্সক্রিপ্টের জন্য আবেদন করে — যায় **`document_requests`** টেবিলে।
- রাফি কনভোকেশনে অংশ নিতে চায় — আবেদন করে **`convocation_applications`** টেবিলে, সাথে তার CGPA আর completed credits-ও উল্লেখ থাকে।

---

## এই গল্পের বাইরে যে টেবিলগুলো — এগুলো "পটভূমি" হিসেবে কাজ করে

সব টেবিল রাফির গল্পে সরাসরি আসেনি, কারণ কিছু টেবিল হলো **স্থায়ী রেফারেন্স ডেটা** — এগুলো কোনো নির্দিষ্ট ছাত্রের জন্য না, পুরো সিস্টেমের জন্য একবার সেট করা থাকে:

- **`grading_policies`** — কত নম্বর পেলে কোন গ্রেড (A+, A, B... ) হবে, এটা আগে থেকেই ঠিক করা আছে। কোনো foreign key নেই এখানে, কারণ এটা শুধু একটা লুকআপ টেবিল।
- **`faculty`** এবং **`departments`** — এগুলো প্রশাসনিক কাঠামো, প্রতিটা ছাত্রের গল্পে পরোক্ষভাবে (indirectly) জড়িত থাকে অ্যাডভাইজার আর ডিপার্টমেন্টের মাধ্যমে।

---

## এক নজরে — কোন টেবিল ডিলিট হলে কী হয়?

এটা সবচেয়ে গুরুত্বপূর্ণ অংশ, sir প্রায়ই এই প্রশ্ন করেন viva-তে:

| যদি ডিলিট হয়... | তাহলে কী হবে |
|---|---|
| একজন `user` | তার `faculty`/`student` প্রোফাইল, পোস্ট করা নোটিশ — সব **CASCADE** হয়ে ডিলিট হয়ে যাবে |
| একজন `student` | তার এনরোলমেন্ট, ফি, রেজাল্ট, আবেদন — সবকিছু **CASCADE** হয়ে মুছে যাবে |
| একজন `faculty` যিনি ক্লাস পড়াচ্ছেন | ডিলিট **করা যাবে না** (`RESTRICT`) — আগে তাকে ক্লাস থেকে সরাতে হবে |
| একটা `exam` | তার সাথে যুক্ত `results` মুছে যাবে না, শুধু `exam_id` **NULL** হয়ে যাবে (নম্বরের রেকর্ড সংরক্ষিত থাকে) |
| একটা `course` (prerequisite হিসেবে ব্যবহৃত) | যেসব কোর্স একে prerequisite হিসেবে ব্যবহার করছিলো, তাদের সেই লিংক **NULL** হয়ে যাবে, কোর্স ডিলিট হবে না |

---

## সারমর্ম — এক লাইনে যদি sir জিজ্ঞেস করেন

> **"রাফি প্রথমে একজন `user` হিসেবে ঢোকে, তারপর `student` প্রোফাইল পায়। সে একটা department-program-batch-section কাঠামোর ভেতরে বসে, কোর্সে এনরোল করে, পরীক্ষা দেয়, রেজাল্ট পায়, ফি দেয়, আর শেষে গ্র্যাজুয়েট হয় — এই পুরো জার্নিতে `semesters` টেবিল সময়ের হিসাব রাখে, আর প্রতিটা ধাপে foreign key আর delete rule (CASCADE/SET NULL/RESTRICT) দিয়ে ডেটার নিরাপত্তা আর সম্পর্ক বজায় রাখা হয়।"**



# UAMS Database — Full Table Reference

A deep dive into all 28 tables: what each one represents, every important column, and its keys/constraints.

---

## 1. `users`
**What it represents:** The single identity table for every human in the system — admins, faculty, students, and registrars all start life as a row here.

| Column | Notes |
|---|---|
| `id` CHAR(36) **PK** | UUID identity |
| `name`, `email` (UNIQUE) | Email is the login handle |
| `password_hash` | Never store plaintext |
| `role` ENUM | `ADMIN`, `FACULTY`, `STUDENT`, `REGISTRAR` — drives which "profile" table (`faculty`/`students`) the row gets extended into |
| `phone`, `date_of_birth`, `gender`, `blood_group`, `profile_image` | Personal/demographic fields |
| `is_verified`, `is_active`, `must_change_password` | Account-state flags, default `FALSE`/`TRUE`/`TRUE` |
| `created_at`, `updated_at` | Auto timestamps |

**Why it matters:** It's the root of a "table-per-type" pattern — `faculty` and `students` don't duplicate name/email/password, they just extend `users` via a 1:1 FK.

---

## 2. `departments`
**What it represents:** Academic departments (e.g. Computer Science, EEE).

| Column | Notes |
|---|---|
| `id` **PK** | |
| `name`, `code` (UNIQUE), `dept_number` (UNIQUE) | Human-readable and short-code identifiers |
| `faculty_division` | Broader grouping (e.g. "Faculty of Engineering") |
| `head_faculty_id` **FK → faculty.id** (`SET NULL`) | Added via `ALTER TABLE` *after* `faculty` exists, resolving the chicken-and-egg problem (a department needs a faculty head, but faculty need a department to belong to) |

**Why it matters:** This is the top of the org-chart. Almost every academic/staffing table traces back to a department eventually.

---

## 3. `semesters`
**What it represents:** A single academic term (e.g. "Fall 2025").

| Column | Notes |
|---|---|
| `id` **PK** | |
| `name`, `term` ENUM(`SPRING`,`SUMMER`,`FALL`), `academic_year` | |
| `start_date`, `end_date` | Term boundaries |
| `registration_deadline`, `add_drop_deadline`, `grade_deadline` | Key operational cutoff dates |
| `status` ENUM | `UPCOMING → REGISTRATION → ONGOING → FINAL_EXAMS → GRADING → COMPLETED` — a state machine driving what actions are allowed system-wide |

**Why it matters:** `semesters` is the time dimension. Fees, offerings, clearance, calendars — nearly every transactional table is scoped to a semester.

---

## 4. `guardians`
**What it represents:** A parent/guardian contact record for a student.

| Column | Notes |
|---|---|
| `id` **PK** | |
| `name`, `phone` | |
| `relation` ENUM(`FATHER`,`MOTHER`,`BROTHER`,`SISTER`,`OTHER`) | |
| `other_relation` | Free-text fallback when `relation = OTHER` |

**Why it matters:** Independent table, optionally linked from `students`. One guardian *could* be shared across siblings since there's no uniqueness constraint tying a guardian to one student.

---

## 5. `grading_policies`
**What it represents:** A static grade-scale lookup (marks → letter grade → GPA points).

| Column | Notes |
|---|---|
| `id` INT AUTO_INCREMENT **PK** | |
| `min_marks`, `max_marks` DECIMAL(5,2) | Range for this grade band |
| `grade` VARCHAR(5) | e.g. `A+`, `B-`, `F` |
| `grade_point` DECIMAL(3,2) | e.g. `4.00` |
| `remarks` | e.g. "Outstanding", "Fail" |

**Why it matters:** Seeded with 10 fixed rows (A+ down to F) at schema creation. It has **no foreign keys in or out** — the app layer looks up a student's `marks_obtained` against this range to compute a letter grade logically, not via a DB relationship.

---

## 6. `financial_aid_circulars`
**What it represents:** An announced scholarship/aid program (e.g. "Need-Based Aid 2025").

| Column | Notes |
|---|---|
| `id` **PK** | |
| `title`, `description`, `eligibility_criteria`, `benefit_details` | |
| `deadline` | Application cutoff |
| `is_active` | Whether it's currently open |

**Why it matters:** Independent table; students apply against it via `financial_aid_applications`.

---

## 7. `faculty`
**What it represents:** The staff/teaching-profile extension of a `users` row.

| Column | Notes |
|---|---|
| `id` **PK** | |
| `user_id` **FK → users.id** UNIQUE, `CASCADE` | 1:1 link — deleting the user deletes the faculty profile |
| `department_id` **FK → departments.id**, `RESTRICT` | Can't delete a department while faculty are still assigned to it |
| `employee_id` UNIQUE | Staff ID number |
| `designation` | e.g. "Assistant Professor" |
| `academic_status` DEFAULT `'ACTIVE'` | |
| `administrative_position` | Optional extra role, e.g. "Dean" |
| `joined_at` | |

**Why it matters:** This is a hub — it's referenced by `departments.head_faculty_id`, `students.advisor_id`, and `course_offerings.faculty_id`.

---

## 8. `programs`
**What it represents:** A degree program (e.g. "BSc in Computer Science").

| Column | Notes |
|---|---|
| `id` **PK** | |
| `department_id` **FK → departments.id**, `CASCADE` | Deleting the department deletes its programs |
| `name`, `degree_level` | e.g. "Undergraduate" |
| `duration_years` DECIMAL(3,1), `total_credits` DECIMAL(5,2) | Program-level requirements |

**Why it matters:** Sits between `departments` and `batches` in the hierarchy — a department can run several programs, and each program has its own intake batches.

---

## 9. `courses`
**What it represents:** A course catalog entry (e.g. "CS101 — Intro to Programming"), independent of when it's actually taught.

| Column | Notes |
|---|---|
| `id` **PK** | |
| `department_id` **FK → departments.id**, `CASCADE` | |
| `course_code` UNIQUE | e.g. `CS101` |
| `title`, `credit_hours` DECIMAL(3,1) | |
| `prerequisite_course_id` **FK → courses.id (self-reference)**, `SET NULL` | A course can require one prior course; if that prerequisite gets deleted the link just clears rather than blocking |
| `course_type` ENUM(`THEORY`,`LAB`,`PROJECT`,`RESEARCH`) | |
| `is_active`, `description` | |

**Why it matters:** The catalog-level definition. `course_offerings` is where a course actually gets scheduled into a real semester/class.

---

## 10. `academic_calendars`
**What it represents:** The event calendar container for one semester.

| Column | Notes |
|---|---|
| `id` **PK** | |
| `semester_id` **FK → semesters.id** UNIQUE, `CASCADE` | Strict 1:1 — each semester gets exactly one calendar |
| `academic_year`, `duration` | |

**Why it matters:** A thin wrapper table whose only real job is to be the parent of `calendar_events`.

---

## 11. `batches`
**What it represents:** An intake cohort within a program (e.g. "Spring 2023 Batch" of the CS program).

| Column | Notes |
|---|---|
| `id` **PK** | |
| `batch_number`, `batch_initial` | |
| `program_id` **FK → programs.id**, `CASCADE` | |
| **UNIQUE** (`batch_number`, `program_id`) | Batch numbers only need to be unique *within* a program |

**Why it matters:** Middle layer of the `programs → batches → sections` hierarchy; also referenced directly by `students`, `course_offerings`, and `batch_semester_fees`.

---

## 12. `calendar_events`
**What it represents:** A single dated entry inside a semester's calendar (e.g. "Add/Drop Deadline").

| Column | Notes |
|---|---|
| `id` **PK** | |
| `calendar_id` **FK → academic_calendars.id**, `CASCADE` | |
| `title`, `date_value` VARCHAR(100), `order_index` INT | Note `date_value` is a string, not a `DATE` type — likely to allow flexible text like "TBD" or date ranges |

---

## 13. `sections`
**What it represents:** A subdivision of a batch (e.g. Section A / Section B) for scheduling/grouping.

| Column | Notes |
|---|---|
| `id` **PK** | |
| `name`, `batch_id` **FK → batches.id**, `CASCADE` | |
| **UNIQUE** (`name`, `batch_id`) | Section names only unique within their batch |

---

## 14. `batch_semester_fees`
**What it represents:** A rate table — the registration fee for a given (batch, semester) combination.

| Column | Notes |
|---|---|
| `id` **PK** | |
| `batch_id` **FK → batches.id**, `CASCADE` | |
| `semester_id` **FK → semesters.id**, `CASCADE` | |
| `registration_fee` DECIMAL(10,2) | |
| **UNIQUE** (`batch_id`, `semester_id`) | One rate per batch per semester |

**Why it matters:** This is a *reference/pricing* table, not a billing record. It's not FK-linked to the actual `fees` table — the app presumably reads this rate and then writes the real charge into `fees`.

---

## 15. `students`
**What it represents:** The student-profile extension of a `users` row — the single biggest hub in the schema.

| Column | Notes |
|---|---|
| `id` **PK** | |
| `user_id` **FK → users.id** UNIQUE, `CASCADE` | |
| `program_id` **FK → programs.id**, `RESTRICT` | Program can't be deleted while students are enrolled in it |
| `advisor_id` **FK → faculty.id**, `SET NULL`, optional | Assigned advisor |
| `batch_id` **FK → batches.id**, `SET NULL`, optional | |
| `section_id` **FK → sections.id**, `SET NULL`, optional | |
| `guardian_id` **FK → guardians.id**, `SET NULL`, optional | |
| `student_id`, `registration_no` — both UNIQUE | Institution-issued identifiers, distinct from the internal `id` |
| `current_semester` INT DEFAULT 1 | |
| `is_registration_cleared`, `has_received_laptop` BOOLEAN | Operational flags |
| `status` ENUM(`ACTIVE`,`GRADUATED`,`DROPPED`,`SUSPENDED`) | |
| `admitted_at` DATE | |

**Why it matters:** Seven other tables cascade-delete off `students.id`: `enrollments`, `fees`, `semester_clearance`, `evaluations`, `document_requests`, `convocation_applications`, `financial_aid_applications`. Deleting a student wipes their entire academic history.

---

## 16. `course_offerings`
**What it represents:** A specific *scheduled instance* of a course — "CS101, Fall 2025, taught by Dr. X, Section A."

| Column | Notes |
|---|---|
| `id` **PK** | |
| `course_id` **FK → courses.id**, `CASCADE` | |
| `semester_id` **FK → semesters.id**, `CASCADE` | |
| `faculty_id` **FK → faculty.id**, `RESTRICT` | Faculty can't be deleted while still teaching an offering |
| `batch_id`, `section_id` — both `SET NULL`, optional | An offering can target a specific batch/section, or be left open |
| `schedule_info` VARCHAR(255) | Free-text time/room info |
| `seat_limit` INT DEFAULT 40 | |
| `is_results_approved` BOOLEAN | Gate flag — results likely aren't visible to students until this is `TRUE` |

**Why it matters:** This is where `courses` meets `semesters` meets `faculty`. `enrollments`, `exams`, and `evaluations` all cascade off this table.

---

## 17. `enrollments`
**What it represents:** The many-to-many junction: "this student is taking this course offering."

| Column | Notes |
|---|---|
| `id` **PK** | |
| `student_id` **FK → students.id**, `CASCADE` | |
| `offering_id` **FK → course_offerings.id**, `CASCADE` | |
| `status` ENUM(`REGISTERED`,`DROPPED`,`COMPLETED`) | |
| `enrollment_type` ENUM(`REGULAR`,`RETAKE`,`IMPROVEMENT`) | Distinguishes a first attempt from a retake/GPA-improvement attempt |
| **UNIQUE** (`student_id`, `offering_id`) | Can't enroll twice in the same offering |

**Why it matters:** The transactional core of the whole system — `attendance` and `results` both hang directly off a specific enrollment row, not off the student or course independently.

---

## 18. `exams`
**What it represents:** One graded component within a course offering (a quiz, a midterm, the final, etc.).

| Column | Notes |
|---|---|
| `id` **PK** | |
| `offering_id` **FK → course_offerings.id**, `CASCADE` | |
| `exam_type` ENUM — 10 values: `QUIZ`, `MIDTERM`, `MIDTERM_IMPROVEMENT`, `FINAL`, `ASSIGNMENT`, `PRESENTATION`, `PROJECT_SHOW`, `LAB_REPORT`, `LAB_EVALUATION`, `ATTENDANCE` | |
| `title`, `exam_date` | |
| `total_marks` DECIMAL(6,2) | |
| `weight_percent` DECIMAL(5,2) DEFAULT 0 | How much this component counts toward the final grade |

---

## 19. `fees`
**What it represents:** The actual billing record for one student in one semester.

| Column | Notes |
|---|---|
| `id` **PK** | |
| `student_id` **FK → students.id**, `CASCADE` | |
| `semester_id` **FK → semesters.id**, `CASCADE` | |
| `registration_fee`, `credit_fee`, `amount_paid` DECIMAL(10,2) DEFAULT 0 | |
| `due_date`, `paid_at` (nullable) | |
| **UNIQUE** (`student_id`, `semester_id`) | One fee record per student per semester |

---

## 20. `notices`
**What it represents:** An announcement posted to some or all users.

| Column | Notes |
|---|---|
| `id` **PK** | |
| `title`, `content` | |
| `posted_by` **FK → users.id**, `CASCADE` | Author |
| `target_role` ENUM(`ALL`,`STUDENT`,`FACULTY`,`REGISTRAR`) DEFAULT `ALL` | Audience filter |
| `department_id` **FK → departments.id**, `SET NULL`, optional | Can be scoped to one department |
| `category` DEFAULT `'General'` | |

---

## 21. `semester_clearance`
**What it represents:** A checklist per student per semester tracking whether they've cleared registration/midterm/final gates.

| Column | Notes |
|---|---|
| `id` **PK** | |
| `student_id`, `semester_id` — both `CASCADE` | |
| `registration_cleared`, `midterm_cleared`, `final_exam_cleared` BOOLEAN | Three sequential gates |
| **UNIQUE** (`student_id`, `semester_id`) | |

---

## 22. `evaluations`
**What it represents:** A student's course/instructor evaluation survey response.

| Column | Notes |
|---|---|
| `id` **PK** | |
| `student_id` **FK → students.id**, `CASCADE` | |
| `offering_id` **FK → course_offerings.id**, `CASCADE` | |
| `q1` … `q10` INT NOT NULL | Ten fixed Likert-style rating questions |
| `comments` TEXT | Free-text feedback |
| **UNIQUE** (`student_id`, `offering_id`) | One evaluation per student per offering |

---

## 23. `document_requests`
**What it represents:** A student's request for an official document (transcript, certificate, etc.).

| Column | Notes |
|---|---|
| `id` **PK** | |
| `student_id` **FK → students.id**, `CASCADE` | |
| `document_type` ENUM(`TRANSCRIPT`,`PROVISIONAL_CERTIFICATE`,`MAIN_CERTIFICATE`,`TESTIMONIAL`,`MEDIUM_OF_INSTRUCTION`) | |
| `status` ENUM(`PENDING`,`PROCESSING`,`READY_FOR_PICKUP`,`COMPLETED`,`REJECTED`) DEFAULT `PENDING` | |
| `fee_amount`, `is_paid` | |
| `request_note`, `admin_note` | Student-side and staff-side notes |

---

## 24. `convocation_applications`
**What it represents:** A graduating student's application to attend convocation.

| Column | Notes |
|---|---|
| `id` **PK** | |
| `student_id` **FK → students.id**, `CASCADE` | |
| `cgpa` DECIMAL(3,2), `credits_completed` DECIMAL(5,2) | Eligibility snapshot at time of application |
| `convocation_year`, `gown_size`, `guest_count` DEFAULT 0 | Logistics |
| `fee_amount`, `is_paid` | |
| `status` ENUM(`PENDING`,`VERIFIED`,`APPROVED`,`REJECTED`) | |
| **UNIQUE** (`student_id`, `convocation_year`) | One application per student per year |

---

## 25. `financial_aid_applications`
**What it represents:** A student's application against a specific aid circular.

| Column | Notes |
|---|---|
| `id` **PK** | |
| `student_id` **FK → students.id**, `CASCADE` | |
| `circular_id` **FK → financial_aid_circulars.id**, `CASCADE` | |
| `justification` TEXT, `monthly_income` | |
| `status` ENUM(`PENDING`,`REVIEWING`,`APPROVED`,`REJECTED`) | |
| `admin_remarks` | |
| **UNIQUE** (`student_id`, `circular_id`) | Can't apply twice to the same circular |

---

## 26. `attendance`
**What it represents:** A per-class-date attendance mark tied to one enrollment.

| Column | Notes |
|---|---|
| `id` **PK** | |
| `enrollment_id` **FK → enrollments.id**, `CASCADE` | |
| `class_date` DATE, `status` ENUM(`PRESENT`,`ABSENT`,`LATE`) | |
| `marked_at` TIMESTAMP | |
| **UNIQUE** (`enrollment_id`, `class_date`) | One attendance mark per enrollment per day |

---

## 27. `results`
**What it represents:** Marks scored on a specific exam component, tied to an enrollment.

| Column | Notes |
|---|---|
| `id` **PK** | |
| `enrollment_id` **FK → enrollments.id**, `CASCADE` | |
| `exam_id` **FK → exams.id**, `SET NULL`, optional | If the exam record is later deleted, the result survives with a null exam reference rather than disappearing |
| `marks_obtained` DECIMAL(6,2) | |
| `is_final_result` BOOLEAN | Distinguishes a component score from the finalized aggregate grade |
| `published_at` TIMESTAMP NULL | Gates visibility to the student |

---

## 28. `notice_views`
**What it represents:** A read-receipt junction between `notices` and `users`.

| Column | Notes |
|---|---|
| `id` **PK** | |
| `notice_id` **FK → notices.id**, `CASCADE` | |
| `user_id` **FK → users.id**, `CASCADE` | |
| `viewed_at` TIMESTAMP | |
| **UNIQUE** (`notice_id`, `user_id`) | A user can only "view" a notice once (viewing again just wouldn't insert a duplicate) |

---

### Quick mental model
- **Identity root:** `users` → extended 1:1 into `faculty` / `students`
- **Org hierarchy:** `departments → programs → batches → sections`
- **Academic catalog:** `courses` (static) vs `course_offerings` (a scheduled instance per semester)
- **Time spine:** `semesters` touches almost everything transactional
- **Transaction core:** `enrollments` (student × offering) → `attendance` / `results` / `exams`
- **Student-service leaves:** `fees`, `semester_clearance`, `evaluations`, `document_requests`, `convocation_applications`, `financial_aid_applications` — all hang directly off `students`, cascade-deleted with them
- **Reference-only tables (no FK ties):** `grading_policies`



# UAMS (University Academic Management System) — Database Schema Constraints Overview

আপনার এই সম্পূর্ণ UAMS ডেটাবেস স্কিমাতে মোট **২৮টি টেবিল** তৈরি করা হয়েছে। নিচে ক্রমানুসারে কোন টেবিলে **`ON DELETE CASCADE`** ব্যবহার করা হয়েছে এবং কোন টেবিলে অন্য রুল (**`RESTRICT`** বা **`SET NULL`**) ব্যবহার করা হয়েছে, তার পুরো তালিকা দেওয়া হলো:

---

### ১. `users` টেবিল
* এটি একটি স্বাধীন (Independent) টেবিল। এখানে কোনো ফরেন কি নেই, তাই `ON DELETE` ব্যবহারের প্রশ্ন আসে না। তবে অন্যান্য টেবিল এই টেবিলটিকে প্যারেন্ট হিসেবে ব্যবহার করে।

### ২. `departments` টেবিল
* **`faculty_id` (head_faculty_id):** `ON DELETE SET NULL` (ডিপার্টমেন্টের প্রধান বা হেড শিক্ষক ডিলিট হলে কলামটি ফাঁকা/NULL হয়ে যাবে, ডিপার্টমেন্ট ডিলিট হবে না)।

### ৩. `semesters` টেবিল
* স্বাধীন টেবিল।

### ৪. `guardians` টেবিল
* স্বাধীন টেবিল।

### ৫. `grading_policies` টেবিল
* স্বাধীন টেবিল।

### ৬. `financial_aid_circulars` টেবিল
* স্বাধীন টেবিল।

### ৭. `faculty` টেবিল
* **`user_id`:** `ON DELETE CASCADE` (users টেবিল থেকে ইউজার ডিলিট হলে সংশ্লিষ্ট ফ্যাকাল্টি রেকর্ডও ডিলিট হয়ে যাবে)।
* **`department_id`:** `ON DELETE RESTRICT` (কোনো ডিপার্টমেন্টের আন্ডারে শিক্ষক থাকলে সেই ডিপার্টমেন্ট সরাসরি ডিলিট করা যাবে না)।

### ৮. `programs` টেবিল
* **`department_id`:** `ON DELETE CASCADE` (ডিপার্টমেন্ট ডিলিট হলে তার অধীনস্থ প্রোগ্রামগুলো ডিলিট হয়ে যাবে)।

### ৯. `courses` টেবিল
* **`department_id`:** `ON DELETE CASCADE` (ডিপার্টমেন্ট ডিলিট হলে কোর্স ডিলিট হয়ে যাবে)।
* **`prerequisite_course_id`:** `ON DELETE SET NULL` (পূর্বশর্ত বা প্রিরিকুইজিট কোর্সটি ডিলিট হলে এই ফিল্ডটি NULL হয়ে যাবে)।

### ১০. `academic_calendars` টেবিল
* **`semester_id`:** `ON DELETE CASCADE` (সেমিস্টার ডিলিট হলে ক্যালেন্ডার ডিলিট হয়ে যাবে)।

### ১১. `batches` টেবিল
* **`program_id`:** `ON DELETE CASCADE` (প্রোগ্রাম ডিলিট হলে ব্যাচ ডিলিট হয়ে যাবে)।

### ১২. `calendar_events` টেবিল
* **`calendar_id`:** `ON DELETE CASCADE` (একাডেমিক ক্যালেন্ডার ডিলিট হলে ইভেন্টগুলো ডিলিট হয়ে যাবে)।

### ১৩. `sections` টেবিল
* **`batch_id`:** `ON DELETE CASCADE` (ব্যাচ ডিলিট হলে সেকশন ডিলিট হয়ে যাবে)।

### ১৪. `batch_semester_fees` টেবিল
* **`batch_id`:** `ON DELETE CASCADE` (ব্যাচ ডিলিট হলে ফি ডিলিট হবে)।
* **`semester_id`:** `ON DELETE CASCADE` (সেমিস্টার ডিলিট হলে ফি ডিলিট হবে)।

### ১৫. `students` টেবিল
* **`user_id`:** `ON DELETE CASCADE` (ইউজার ডিলিট হলে স্টুডেন্ট রেকর্ড ডিলিট হবে)।
* **`program_id`:** `ON DELETE RESTRICT` (প্রোগ্রামে স্টুডেন্ট থাকলে প্রোগ্রাম ডিলিট আটকাবে)।
* **`advisor_id`:** `ON DELETE SET NULL` (শিক্ষক/অ্যাডভাইজার ডিলিট হলে অ্যাডভাইজার আইডি NULL হবে)।
* **`batch_id`:** `ON DELETE SET NULL` (ব্যাচ ডিলিট হলে ব্যাচ আইডি NULL হবে)।
* **`section_id`:** `ON DELETE SET NULL` (সেকশন ডিলিট হলে সেকশন আইডি NULL হবে)।
* **`guardian_id`:** `ON DELETE SET NULL` (অভিভাবক ডিলিট হলে অভিভাবক আইডি NULL হবে)।

### ১৬. `course_offerings` টেবিল
* **`course_id`:** `ON DELETE CASCADE` (কোর্স ডিলিট হলে অফারিং ডিলিট হবে)।
* **`semester_id`:** `ON DELETE CASCADE` (সেমিস্টার ডিলিট হলে অফারিং ডিলিট হবে)।
* **`faculty_id`:** `ON DELETE RESTRICT` (ফ্যাকাল্টি ডিলিট আটকাবে যদি তার কোর্স অফারিং থাকে)।
* **`batch_id`:** `ON DELETE SET NULL` (ব্যাচ ডিলিট হলে NULL হবে)।
* **`section_id`:** `ON DELETE SET NULL` (সেকশন ডিলিট হলে NULL হবে)।

### ১৭. `enrollments` টেবিল
* **`student_id`:** `ON DELETE CASCADE` (স্টুডেন্ট ডিলিট হলে তার সব এনরোলমেন্ট বা কোর্স বুকিং ডিলিট হয়ে যাবে)।
* **`offering_id`:** `ON DELETE CASCADE` (কোর্স অফারিং ডিলিট হলে এনরোলমেন্ট ডিলিট হবে)।

### ১৮. `exams` টেবিল
* **`offering_id`:** `ON DELETE CASCADE` (কোর্স অফারিং ডিলিট হলে পরীক্ষা বা এক্সাম রেকর্ড ডিলিট হবে)।

### ১৯. `fees` টেবিল
* **`student_id`:** `ON DELETE CASCADE` (স্টুডেন্ট ডিলিট হলে ফি রেকর্ড ডিলিট হবে)।
* **`semester_id`:** `ON DELETE CASCADE` (সেমিস্টার ডিলিট হলে ফি রেকর্ড ডিলিট হবে)।

### ২০. `notices` টেবিল
* **`posted_by (user_id)`:** `ON DELETE CASCADE` (যে ইউজার নোটিশ দিয়েছে সে ডিলিট হলে নোটিশ ডিলিট হবে)।
* **`department_id`:** `ON DELETE SET NULL` (ডিপার্টমেন্ট ডিলিট হলে নোটিশের ডিপার্টমেন্ট আইডি NULL হবে)।

### ২১. `semester_clearance` টেবিল
* **`student_id`:** `ON DELETE CASCADE` (স্টুডেন্ট ডিলিট হলে ক্লিয়ারেন্স রেকর্ড ডিলিট হবে)।
* **`semester_id`:** `ON DELETE CASCADE` (সেমিস্টার ডিলিট হলে ক্লিয়ারেন্স রেকর্ড ডিলিট হবে)।

### ২২. `evaluations` টেবিল
* **`student_id`:** `ON DELETE CASCADE` (স্টুডেন্ট ডিলিট হলে ইভ্যালুয়েশন/ফিডব্যাক ডিলিট হবে)।
* **`offering_id`:** `ON DELETE CASCADE` (কোর্স অফারিং ডিলিট হলে ইভ্যালুয়েশন ডিলিট হবে)।

### ২৩. `document_requests` টেবিল
* **`student_id`:** `ON DELETE CASCADE` (স্টুডেন্ট ডিলিট হলে তার করা ডকুমেন্টের আবেদন ডিলিট হবে)।

### ২৪. `convocation_applications` টেবিল
* **`student_id`:** `ON DELETE CASCADE` (স্টুডেন্ট ডিলিট হলে কনভোকেশনের আবেদন ডিলিট হবে)।

### ২৫. `financial_aid_applications` টেবিল
* **`student_id`:** `ON DELETE CASCADE` (স্টুডেন্ট ডিলিট হলে আর্থিক সহায়তার আবেদন ডিলিট হবে)।
* **`circular_id`:** `ON DELETE CASCADE` (সার্কুলার ডিলিট হলে আবেদন ডিলিট হবে)।

### ২৬. `attendance` টেবিল
* **`enrollment_id`:** `ON DELETE CASCADE` (এনরোলমেন্ট ডিলিট হলে ওই শিক্ষার্থীর উপস্থিতির বা অ্যাটেনডেন্সের রেকর্ড ডিলিট হবে)।

### ২৭. `results` টেবিল
* **`enrollment_id`:** `ON DELETE CASCADE` (এনরোলমেন্ট ডিলিট হলে রেজাল্ট ডিলিট হবে)।
* **`exam_id`:** `ON DELETE SET NULL` (পরীক্ষা বা এক্সাম ডিলিট হলে রেজাল্টের এক্সাম আইডি NULL হবে)।

### ২৮. `notice_views` টেবিল
* **`notice_id`:** `ON DELETE CASCADE` (নোটিশ ডিলিট হলে কে কে দেখেছে তার রেকর্ড ডিলিট হবে)।
* **`user_id`:** `ON DELETE CASCADE` (ইউজার ডিলিট হলে তার নোটিশ দেখার হিস্ট্রি ডিলিট হবে)।