# UAMS Presentation Master Playbook

This is your team's ultimate guide to a successful project defense. It includes a synchronized script, screen-action cues, and timing for [You], Mollah, and Jisan.

---

## 🛠 Preparation Checklist (10 Minutes Before)

- [ ] **React App**: Have the frontend running at `localhost:5173`.
- [ ] **Spring Boot**: Have the backend running at `localhost:8080`.
- [ ] **Database**: Open MySQL Workbench with the `../../../database` folder ready.
- [ ] **Documentation**: Have your **ER Diagram (PDF/Image)** and **Project Report** open in separate tabs.
- [ ] **Logins**: Pre-fill login credentials for an Admin, a Faculty (Mollah's role), and a Student (Jisan's role) in separate browser windows or tabs.

---

## 🎤 The Script (Total: 15 Minutes)

### Part 1: The Core & Admin Control (Speaker: [You])
**Time: 0:00 - 5:00**

> [!TIP]
> **Tone**: Confident, authoritative, and technical.

**0:00 - 1:00 (Introduction)**
*   **Action**: Show the **Landing Page** of the UAMS website.
*   **Script**: "Good morning everyone. We are here to present **UAMS — The University Academic Management System**. My name is [Your Name], and I am joined by my colleagues Mollah and Jisan. UAMS is a full-stack, enterprise-grade solution built to digitize Royal Bengal University's entire ecosystem. We moved away from fragmented manual records to a unified 3NF-compliant MySQL engine."

**1:00 - 2:30 (Database Integrity)**
*   **Action**: Open your **ER Diagram**.
*   **Script**: "Our database isn't just a container; it's a rule-enforcing engine. We designed a schema with **28 interrelated tables** normalized to **3rd Normal Form**. This eliminates anomalies. One major highlight was resolving the circular dependency between Faculty and Departments—we handled this by creating the tables first and then applying constraints using `ALTER TABLE`. Our backend is powered by **Spring Boot 3** with **JWT Security**, ensuring every request is authenticated and authorized."

**2:30 - 5:00 (Admin & Registrar Demo)**
*   **Action**: Login as **Admin**. Navigate to **User Management** and **Department Setup**.
*   **Script**: "As the Admin, I manage the foundation. I can create Departments, Programs, and configure academic calendars. Notice our **Auto-Credential Generation**: when I add a student or faculty, the system generates secure credentials and emails them automatically. We also implemented a **Result Approval Workflow**. Faculty can't just publish grades; they must be verified and approved by the Registrar here before they become 'Official'. I also handle high-level tasks like **Convocation management** and **Financial Aid circulars**."

---

### Part 2: Faculty & Academic Governance (Speaker: Mollah)
**Time: 5:00 - 10:00**

> [!TIP]
> **Tone**: Detailed, classroom-focused, and logic-driven.

**5:00 - 7:30 (Governance & Advisor Role)**
*   **Action**: Switch to the **Faculty Dashboard**. Show the **Advisee List**.
*   **Script**: "Thank you. For Faculty, UAMS is where the actual teaching management happens. I can see my assigned courses and my list of student advisees. One critical feature I implemented is **Advisor Approval**. In a real university, students can't just pick any course; the system checks prerequisites and requires my approval before the registration is finalized. This maintains academic standards."

**7:30 - 10:00 (Classroom Automation & Triggers)**
*   **Action**: Open the **database/triggers.sql** file in your IDE/Text Editor.
*   **Script**: "In the classroom, I mark attendance and enter marks. But the real magic is in our **SQL Triggers**. I implemented `trg_check_seat_limit` which blocks enrollment at the database level if a section is full. I also created `trg_attendance_low_warning` — this trigger automatically posts a notification to the student if their attendance falls below 75%. This is 'Smart Governance' directly in the database layer."

---

### Part 3: Student Experience & Technical Mastery (Speaker: Jisan)
**Time: 10:00 - 15:00**

> [!TIP]
> **Tone**: Enthusiastic, user-centric, and technically deep.

**10:00 - 12:30 (Student Life & Finance)**
*   **Action**: Login as **Student**. Show the **Dashboard**, **Routine**, and **Financial Ledger**.
*   **Script**: "Finally, the Student portal. Here, I have a 360-degree view. I can see my routine, my **3-tier Clearance status** (Registration, Mid, and Final), and my **Live Financial Ledger**. Students can apply for scholarships, hall management, and even the **Laptop scheme**. We made sure that every student service is integrated into one dashboard."

**12:30 - 14:00 (Stored Procedures & Analytics)**
*   **Action**: Open **database/procedures.sql**. Highlight `sp_calculate_student_cgpa`.
*   **Script**: "Technically, how do we handle 20,000 results? We use **Stored Procedures**. I developed `sp_calculate_student_cgpa` which uses a **MySQL Cursor** to iterate through all completed courses, matches marks against the `grading_policies` table, and outputs a real-time CGPA. This is significantly faster than calculating it in the application layer."

**14:00 - 15:00 (Conclusion)**
*   **Action**: Show the **Admin Dashboard** with Analytics charts (Recharts).
*   **Script**: "In conclusion, UAMS is a robust, production-ready system. We’ve demonstrated 3NF compliance, advanced SQL automation, and a secure full-stack architecture. We’ve achieved 93% fee collection in our simulations and 100% data integrity. Thank you for your time, we are now ready for your questions."
