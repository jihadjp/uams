# UAMS 15-Minute Team Presentation Script

This script is designed for a 3-member team presentation (15 minutes total). Each member has approximately 5 minutes.

---

## Slide 1: Title & Introduction
**[Visuals]**: Project Title (UAMS), Royal Bengal University Logo, Group Member Names ([You], Mollah, Jisan).

**[Speaker: You]** (0:00 - 1:00)
"Good morning, honorable examiners and fellow students. Today, our team is excited to present the **University Academic Management System**, or **UAMS**. Developed for Royal Bengal University, UAMS is a comprehensive, database-driven solution designed to replace fragmented, manual processes with a unified digital ecosystem.

My name is [Your Name], and I will be discussing our core DBMS engine and the Administrative module. My colleague Mollah will then cover Faculty operations, and Jisan will conclude with the Student experience and technical outcomes."

---

## Slide 2: The Engineering Problem & DBMS Core
**[Visuals]**: **[PLACEHOLDER: ER Diagram Image]**, 28 Tables highlighted, "3NF" in bold.

**[Speaker: You]** (1:00 - 3:30)
"At the heart of UAMS is a robust MySQL database. We designed a schema consisting of **28 interrelated tables**, fully normalized to the **Third Normal Form (3NF)**. Why 3NF? Because in a university system, data anomalies can be catastrophic. By ensuring each non-key attribute is dependent only on the primary key, we eliminate update, insertion, and deletion anomalies.

One of our biggest engineering challenges was resolving **circular dependencies**. For example, a Faculty belongs to a Department, but a Department is headed by a Faculty member. In SQL, you can't create these foreign keys simultaneously. We solved this by creating the tables first, then using `ALTER TABLE` to add the constraints once all entities existed.

As you can see on the ER diagram, our schema is divided into logical modules:
- **Core Entities**: Users, Departments, Programs.
- **Academic Hierarchy**: Semesters, Batches, Sections, and Courses.
- **Transactional Records**: Enrollments, Attendance, Exams, and Results.
Every relationship is enforced with referential integrity—using `CASCADE` for things like user profile deletions and `RESTRICT` for critical academic records to prevent accidental loss of student history."

---

## Slide 3: Admin & Registrar – The Control Center
**[Visuals]**: **[PLACEHOLDER: Admin Dashboard Screenshot]**, Bullet points of features.

**[Speaker: You]** (3:30 - 6:00)
"As the Admin and Registrar, you have the 'God View' of the system. We focused on making high-stakes administrative tasks as frictionless as possible.
1. **User Management**: We implemented an automated onboarding flow. When an account is created, the system auto-generates credentials and notifies the user via email. This includes handling different roles like Registrar, Faculty, and Students, each with unique permission sets.
2. **Academic Setup**: We provide full control over the university hierarchy. An admin can set up a new department, define its programs, and then drill down into batches and sections.
3. **Course & Fee Configuration**: This is where the Registrar maps courses to semesters and configures the `batch_semester_fees`. We handle everything from registration fees to credit-hour-based pricing.
4. **Administrative Workflows**: We’ve built integrated modules for Financial Aid management, Document requests—like transcripts and certificates—and even Convocation applications.
Finally, the Admin oversees the **Result Approval Workflow**. Faculty can enter marks, but results only go live for students once the Registrar or Admin gives the final approval. This dual-verification ensures that grade sheets are 100% accurate before they become official records.

I’ll now hand over to Mollah to discuss how our Faculty members interact with this data."

---

## Slide 4: Faculty – Academic Governance
**[Visuals]**: **[PLACEHOLDER: Faculty Dashboard Screenshot]**, "Advisor Approval" icon.

**[Speaker: Mollah]** (6:00 - 8:30)
"Thank you. For our Faculty members, UAMS serves as a primary workplace. Upon logging in, a Faculty member sees their assigned courses and their list of student advisees.

A key feature here is the **Advisor Approval System**. Students cannot simply register for any course; their advisor must review and approve their registration based on prerequisites and academic standing. This ensures students stay on the right path toward graduation. Behind the scenes, we use complex joins between the `students`, `enrollments`, and `course_offerings` tables to present this data to the advisor.

Faculty also have access to the **Student Result Browser**, allowing them to monitor the progress of their advisees over time and provide better academic counseling. This is where the 'Advisee List' becomes more than just a table; it's a tool for academic governance."

---

## Slide 5: Classroom Operations & Automation
**[Visuals]**: **[PLACEHOLDER: Attendance Marking Screenshot]**, Snippet of `trg_check_seat_limit` code.

**[Speaker: Mollah]** (8:30 - 11:00)
"In the classroom, UAMS streamlines daily tasks. Faculty mark attendance digitally, which instantly updates the student's attendance percentage. This information is critical, as our system flags students whose attendance falls below 75%.

For examinations, our system handles the full lifecycle: from marks entry to final result publishing. But what makes UAMS powerful is the **Database-Level Automation**.

We implemented **Triggers** to handle business rules that the application shouldn't have to worry about. For example:
- **Seat Limit Enforcement**: Our `trg_check_seat_limit` trigger runs before every insertion into the `enrollments` table. It counts the current students in a section and compares it to the `seat_limit` in `course_offerings`. If it's full, the database throws an exception.
- **Data Protection**: We have triggers like `trg_prevent_faculty_deletion` which stops the system from deleting a faculty member if they still have active student advisees.

This 'Database-First' approach to logic ensures that even if a bug exists in the frontend, the data remains consistent and valid. I will now hand over to Jisan for the Student perspective."

---

## Slide 6: Student Experience – Academics & Finance
**[Visuals]**: **[PLACEHOLDER: Student Dashboard Screenshot]**, CGPA Graph, Routine Table.

**[Speaker: Jisan]** (11:00 - 13:00)
"Thank you, Mollah. For students, UAMS is a self-service portal. The dashboard provides a real-time view of their **CGPA tracking**, class routines, and academic calendars.

Students can track their **Clearance Status** across three dimensions: Registration, Midterm, and Final Exams. This transparency reduces administrative friction. Finanically, students have a **Live Ledger**. They can view their dues, apply for scholarships or waivers, and track their payment history.

When it comes to results, students don't just see a number; they get **Official Grade Sheets** and can provide valuable feedback through our **Teaching Evaluation** module. This creates a feedback loop that helps the university maintain quality."

---

## Slide 7: Student Life & Technical Mastery
**[Visuals]**: **[PLACEHOLDER: UML System Architecture Diagram]**, Icons for Laptop, Hall, Career.

**[Speaker: Jisan]** (13:00 - 15:00)
"UAMS goes beyond just grades. We've included **Student Life Services** to support the holistic university experience:
- **Career Development Hub** for job placements and internships.
- **Hall Management** and **Transport Card** systems for campus logistics.
- A **Laptop Scheme** tracker, **Mentor Meeting** scheduling, and **Facility** bookings.

Technically, how do we handle all this? We use **Stored Procedures** for heavy lifting. Our `sp_calculate_student_cgpa` procedure is a highlight—it uses a cursor to iterate through a student's entire enrollment history, matching marks against the `grading_policies` table to calculate cumulative standing in milliseconds.

We also use **Analytical Views** to power our dashboards. Instead of complex joins running every time a student logs in, our views like `vw_attendance_summary` and `vw_student_transcript` provide a real-time snapshot.

Architecturally, our system uses **Spring Boot 3** for the backend REST API, **JWT** for secure, role-based sessions, and **React 18** for a responsive, modern frontend. In conclusion, UAMS is a complete engineering solution that handles the complexity of university life through robust 3NF design and intelligent automation. Thank you for your time, and we are now open for questions."
