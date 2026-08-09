# UAMS Project Demo — Full Presentation Script (3 Members)

**Team:** You (Presenter 1), Jisan (Presenter 2), Mollah (Presenter 3)
**Estimated time:** 10–13 minutes (trim or expand as needed)
**Role split:**
- **You** → Introduction, architecture, tech stack, login flow
- **Mollah** → Student-side features (full walkthrough)
- **Jisan** → Faculty-side and Admin-side features
- **Closing** → Shared, led by you

> **Before you start — quick tips:**
> - Speak in sync with what's on screen. Never talk about a page before it's actually visible to the audience.
> - Keep a natural pace — pause for 1–2 seconds after clicking, let the page load, *then* speak.
> - If someone forgets a line, the next speaker should smoothly continue rather than creating an awkward silence.
> - When a teacher (sir/examiner) interrupts with a question mid-demo, whoever owns that section answers; the others stay quiet unless asked to add something.
> - Rehearse the **handover lines** (the sentence right before passing the laptop/mic to the next person) — those transitions make the biggest difference in how polished the demo feels.

---

## 🎬 PART 1 — Introduction & Problem Statement (You)

**What's on screen:** Title slide, or nothing yet (just standing in front of the audience)

**Script:**

> "Good morning/afternoon everyone. Today we're presenting our project — the **University Academic Management System**, or **UAMS** for short.
>
> Our team consists of three members: myself, [your name], along with Jisan and Mollah.
>
> **Why we built this:** Most universities handle admissions, course registration, attendance, results, fees, and notices through separate, disconnected systems — sometimes even manually on paper or spreadsheets. This creates duplication, inconsistency, and makes it hard for students, faculty, and administrators to get a single, reliable source of truth.
>
> **What UAMS does:** It's a single, centralized platform that manages the *entire* academic lifecycle of a university — from the moment a student is admitted, through course registration, attendance tracking, exams and results, fee payments, scholarship applications, all the way to convocation.
>
> We'll walk you through the system in three parts. First, I'll cover the overall architecture and show you the login flow. Then Mollah will demonstrate the complete student-side experience. Finally, Jisan will show you the faculty and admin-side features — how classes are managed and how the system is administered behind the scenes."

---

## 🎬 PART 2 — Architecture, Tech Stack & Login (You)

**What's on screen:** Terminal/IDE running the project, then the browser landing/login page

**Script:**

> "Before we log in, let me quickly explain what's running under the hood."
>
> *(Run the project — start the server, open the browser)*
>
> "Our tech stack is: **[Frontend — e.g. React/HTML-CSS-JS]** on the front end, **[Backend — e.g. Node.js/Express, Laravel, Django]** on the back end, and **MySQL** as our database.
>
> The database is built around **28 interconnected tables**, all normalized to Third Normal Form (3NF) to avoid data duplication and keep everything consistent. For example, `students`, `faculty`, `courses`, `course_offerings`, `enrollments`, and `results` are all linked through foreign keys — so when a student enrolls in a course, the system automatically knows which department, program, batch, and semester that connects back to.
>
> We designed the system around **four roles**: Admin, Faculty, Student, and Registrar. Every user starts as a row in a base `users` table, and depending on their role, they get an extended profile — a student gets a `students` record, a faculty member gets a `faculty` record — and each role is routed to a completely different dashboard with different permissions.
>
> *(Point at the login screen)*
> This is our **Login Page**. Notice it doesn't ask you to pick a role manually — the system reads the role from the account itself and redirects automatically. This prevents a student from accidentally landing on an admin page, and it's enforced both on the front end and validated on the back end for security.
>
> I'll now log in as a student, and hand it over to Mollah to walk you through everything a student can do."
>
> *(Log in with a student test account, wait for the dashboard to load, then hand over)*
> "Over to you, Mollah."

---

## 🎬 PART 3 — Student-Side Features — Full Walkthrough (Mollah)

**What's on screen:** Student Dashboard → Profile → Course Registration → Attendance → Exams/Results → Fees → Notices → Document Requests → Convocation (in that order, click through each as you talk)

**Script:**

> "Thank you. I'll now walk you through the complete student experience, page by page.
>
> ### 1. Student Dashboard
> This is the **Student Dashboard** — the first thing a student sees after logging in. It gives a quick summary: the student's current semester, their program and batch, CGPA, registration status, and any pending fee dues — basically a snapshot of where they stand right now, without having to dig through multiple pages.
>
> ### 2. Profile
> *(Click into Profile)*
> Here the student can view their personal information — name, email, contact number, guardian details, and their assigned academic advisor. This data comes from the `students` table joined with `users` and `guardians` in the backend.
>
> ### 3. Course Registration
> *(Click Course Registration)*
> This is one of the core features. Here, the student sees the list of courses being **offered this semester** — specifically, offerings that match their batch and section. Each course shows its credit hours, the assigned instructor, the schedule, and how many seats are still available.
>
> When the student clicks 'Enroll,' the system:
> - Checks if the seat limit hasn't been reached
> - Checks if the student has already completed the prerequisite course (if one is required)
> - Creates a new row in the `enrollments` table, linking the student's ID with that specific course offering's ID
>
> This is important — a student doesn't enroll in a 'course' directly, they enroll in a specific **course offering**, which represents that exact course being taught in this exact semester by this exact instructor.
>
> ### 4. Attendance
> *(Click Attendance)*
> Here the student can view their attendance percentage for every enrolled course, broken down by class date. If attendance falls below a certain threshold, this is where they'd notice it before it becomes a bigger problem.
>
> ### 5. Exams & Results
> *(Click Results)*
> This page shows marks for each exam component — quizzes, midterms, assignments, and the final exam — along with the weight each component carries toward the final grade. Once the semester is over, it also shows the computed letter grade and GPA for that course, and the cumulative CGPA.
>
> One important design decision: results are only visible here **after the faculty member has approved them** — we control this using an `is_results_approved` flag on the course offering. This prevents unverified or in-progress marks from being shown to students prematurely.
>
> ### 6. Fees
> *(Click Fees)*
> This shows the semester's registration fee and credit fee, how much has been paid, how much is due, and the due date. This links back to a rate defined per batch and semester, so different batches can be charged differently if needed.
>
> ### 7. Notices
> *(Click Notices)*
> Any announcement posted by an admin, registrar, or faculty member — either university-wide or targeted specifically to the student's department — appears here. The system also silently tracks which notices a student has already read.
>
> ### 8. Document Requests & Convocation
> *(Click Document Requests, then Convocation if available)*
> Finally, students can request official documents like transcripts or certificates, and — for final-year students — apply for convocation, providing their CGPA, completed credits, and gown size, which the administration later verifies and approves.
>
> That covers the entire student journey — from checking their dashboard, to registering for courses, tracking attendance, viewing results, and handling fees and documents, all in one connected system.
>
> Now I'll hand it over to Jisan, who'll show you what happens on the faculty and admin side."

---

## 🎬 PART 4 — Faculty-Side & Admin-Side Features — Full Walkthrough (Jisan)

**What's on screen:** Logout → Login as Faculty → Faculty Dashboard → My Courses → Attendance Marking → Result Entry → Course Evaluations → Logout → Login as Admin → Admin Dashboard → Manage Departments/Programs/Courses → Manage Semesters → Post Notice → Financial Aid / Fee Management

**Script:**

> "Thanks, Mollah. I'll now show you the other side of the system — how faculty manage their classes, and how administrators run the whole platform."
>
> *(Log out, log back in as a faculty account)*
>
> ### Faculty Side
>
> **1. Faculty Dashboard**
> This is the **Faculty Dashboard**. Instead of a student's view, a faculty member sees the list of course offerings they're currently teaching this semester, along with quick stats like total enrolled students per course.
>
> **2. My Courses → Attendance Marking**
> *(Click into a course, then Attendance)*
> Here, the instructor can mark attendance for every student enrolled in that offering — Present, Absent, or Late — for a specific class date. This writes directly into the `attendance` table, linked to each student's individual enrollment record, not just the course in general. That's important, because it means attendance is tracked per student, per course, per day.
>
> **3. Result Entry**
> *(Click Result Entry)*
> This is where a faculty member enters marks for each exam component they've created — say, the midterm or the final. Each entry is tied to a specific exam and a specific enrollment. Once all components are entered, the instructor can approve the results, which flips that `is_results_approved` flag we mentioned earlier — and that's the exact moment students can see their grades.
>
> **4. Course Evaluations (if applicable)**
> *(Click Evaluations, if the page exists)*
> Faculty can also view aggregated, anonymous feedback that students submitted about their teaching — ten rating questions plus optional comments — helping them understand how their course was received.
>
> *(Log out, log back in as admin)*
>
> ### Admin Side
>
> **5. Admin Dashboard**
> This is the **Admin Dashboard** — the control center of the entire system. From here, an administrator manages the structural data that everything else depends on.
>
> **6. Manage Departments / Programs / Courses**
> *(Click into Department management)*
> Here, an admin can create a new department, assign a head faculty member to it, create degree programs under that department, and define courses — including setting up prerequisite relationships between courses.
>
> **7. Manage Semesters & Batches**
> *(Click into Semester management)*
> This is where an admin creates a new academic semester, sets key deadlines — registration deadline, add/drop deadline, grade deadline — and moves the semester through its lifecycle status: from `UPCOMING`, to `REGISTRATION`, to `ONGOING`, and eventually `COMPLETED`. This single status field controls what actions are allowed system-wide — for example, students can only register for courses while the semester is in the `REGISTRATION` state.
>
> **8. Post a Notice**
> *(Click Notices → Create Notice)*
> An admin can post a system-wide notice, or target it to a specific department or role — for example, a notice only visible to students, or only to faculty in one department.
>
> **9. Financial Aid & Fee Oversight**
> *(Click Financial Aid or Fee management)*
> Finally, admins can review scholarship applications submitted by students, approve or reject them, and oversee the fee structure — setting the registration fee per batch, per semester.
>
> So to summarize this half: **faculty manage the day-to-day academic activity** — attendance and grading — while **admins manage the structural backbone** of the university — departments, programs, courses, semesters, and communications.
>
> Back to you for the closing."

---

## 🎬 PART 5 — Closing (You, with input from the team)

**Script:**

> **(You):** "So that was a complete walkthrough of UAMS — starting from admission, through course registration, attendance, exams and results, fee management, notices, and finally document requests and convocation.
>
> Throughout the project, we made sure to follow proper database design principles — our schema is normalized to Third Normal Form, every relationship is enforced through foreign keys with appropriate delete rules — cascading deletes where data should be cleaned up together, restrictions where deletion should be blocked, and nullification where a record should survive independently.
>
> We also made deliberate design decisions around role-based access — separating what a student, a faculty member, and an admin can each see and do — and around data integrity, like only revealing results once they're formally approved.
>
> We believe this project demonstrates not just a working application, but a well-thought-out data model that could realistically scale to handle a full university's operations.
>
> We're now open to your questions. Thank you."

---

## ❓ Anticipated Questions & Answer Ownership

| Likely Question | Who Answers | Key Talking Points |
|---|---|---|
| "Why separate `courses` and `course_offerings`?" | You | `courses` is the permanent catalog definition; `course_offerings` is a specific instance of that course being taught in a given semester by a given instructor — this lets the same course be reused across multiple semesters without duplication |
| "What happens in the backend when a student registers for a course?" | Mollah | A new row is inserted into `enrollments`, linking `student_id` and `offering_id`; the system checks seat availability and prerequisites before allowing it; a uniqueness constraint prevents duplicate enrollment in the same offering |
| "How does attendance/results actually get stored — per course or per student?" | Jisan | Both `attendance` and `results` are tied to the `enrollment_id`, not just the course — this means each row represents one specific student's attendance/result for one specific course offering |
| "What happens if you delete a faculty member who's currently teaching?" | Jisan | The deletion is blocked (`RESTRICT`) — the system won't let you delete a faculty member while they still have active course offerings assigned; you'd need to reassign or remove those first |
| "What happens if you delete a student?" | Mollah | All of their related data cascades and is deleted too — enrollments, fees, results, evaluations, document requests — since none of that data makes sense without the student record |
| "How is grading finalized?" | Jisan | Faculty enter marks per exam component tied to weight percentages; once complete, they approve results, which flips a visibility flag so students can then see their grades |
| "What tech stack did you use?" | You | *(Fill in your actual frontend, backend, and database choices)* |
| "Is the database normalized? To what level?" | You | Yes, designed to Third Normal Form (3NF) — no repeating groups, all non-key attributes depend only on the primary key, minimizing redundancy |
| "How do you prevent a student from seeing another student's data?" | Mollah/Jisan | Role-based access control enforced on the backend — every request is scoped to the logged-in user's own ID, not just hidden on the frontend |

---

## ✅ Final Checklist Before the Demo

- [ ] Run the full project end-to-end at least once beforehand to catch any errors before presenting live
- [ ] Prepare **three separate test accounts** in advance — one Student, one Faculty, one Admin — with realistic sample data already populated (don't demo with empty/blank data)
- [ ] Double-check your internet/localhost connection is stable
- [ ] Rehearse the handover lines as a team at least once — especially the moments where the laptop or mic changes hands
- [ ] Have a backup plan (screenshots or a recorded video) in case the live demo fails due to network or server issues
- [ ] Confirm who answers which anticipated question, so nobody hesitates during Q&A
- [ ] Time yourselves once in full — trim any section that runs long


