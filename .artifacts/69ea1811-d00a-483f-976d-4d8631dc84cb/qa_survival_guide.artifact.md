# UAMS: Q&A Survival Guide

Lab examiners often look for weaknesses in database design and security. Use these expert answers to defend your project.

---

## 🛑 Top 10 Potential Questions & Answers

### 1. "Why did you use 3NF? Is it always better?"
- **Answer**: "3NF ensures data integrity by removing partial and transitive dependencies. For an academic system where accuracy is critical (like grades and fees), 3NF is the gold standard. While it requires more 'JOINS', it prevents anomalies that could ruin a student's record."

### 2. "How did you solve the Faculty-Department circular dependency?"
- **Answer**: "This was an 'Engineering Problem'. We created the tables without the foreign keys first, then used `ALTER TABLE` to add the `department_id` to the `faculty` table and `head_faculty_id` to the `departments` table. This allowed us to break the loop during creation."

### 3. "Why put logic in Triggers instead of the Java backend?"
- **Answer**: "Database triggers act as a 'Final Safety Net'. Even if a bug occurs in our Spring Boot service or an external tool tries to insert data, the Trigger ensures our business rules (like Seat Limits) are never violated. It’s 'Defense in Depth'."

### 4. "How do you handle JWT security? What happens if the token is stolen?"
- **Answer**: "We use stateless JWTs with short expiration times. For high-security actions, we rely on role-based access. In a production environment, we would also implement a 'Blacklist' or use 'Refresh Tokens' to mitigate theft."

### 5. "Explain how your CGPA Stored Procedure works."
- **Answer**: "It uses a **Cursor** to fetch all 'COMPLETED' courses for a student. For each course, it looks up the `grading_policies` table to find the matching `grade_point` for the marks obtained. It then sums up `grade_point * credit_hours` and divides by `total_credits`."

### 6. "What happens if you delete a student? Does their result stay?"
- **Answer**: "We used `ON DELETE CASCADE` for results and enrollments. This means if a student's profile is deleted, their dependent data is cleaned up to prevent 'Orphan Records'. However, for critical records, we could use a 'Soft Delete' flag in the future."

### 7. "How do you handle concurrent enrollments (two people clicking 'Enroll' at once)?"
- **Answer**: "MySQL's default transaction isolation level and our `trg_check_seat_limit` handle this. The trigger locks the table row during the count, ensuring that two people don't bypass the seat limit at the exact same millisecond."

### 8. "Why did you use Zustand for state management in React?"
- **Answer**: "Redux was too heavy for our needs. Zustand is lightweight, easy to debug, and works perfectly with our JWT-based authentication flow to keep the user's role and session persistent across the app."

### 9. "Can this system handle 10,000 students?"
- **Answer**: "Yes. Our schema is indexed on primary keys and foreign keys. By using **Analytical Views**, we pre-compute dashboard data so the database doesn't have to perform heavy joins every time a user logs in."

### 10. "If you had 1 more month, what would you add?"
- **Answer**: "We would integrate a **Payment Gateway** (bKash/Nagad), add **Automated Email Notifications** for low attendance, and develop a **Native Mobile App** using React Native."


### If the teachers ask you to explain Triggers, Stored Procedures, or Views, they are testing two things:

Do you know the exact definition?
Do you know why and how you actually used it in your project?
Here is exactly how you should answer. I have broken them down into The Simple Definition, Our Project Example, and The "Teacher-Pleasing" Keywords.

(Decide among your team who will answer which question. Usually, it's best if the person who built that feature answers it!)

### 1. If asked: "What is a Trigger and how did you use it?"
   (Best answered by Mollah or Jihad)

- **How to answer:**
"Sir, a Trigger is a special type of stored database code that automatically executes—or 'fires'—in response to certain events on a particular table, like an INSERT, UPDATE, or DELETE.

In our project, we used 9 different triggers to enforce business rules automatically so the frontend backend doesn't have to worry about it.

For example (Mollah): We have an Auto-Grading Trigger. The exact moment a teacher updates a student's marks in the results table, an AFTER UPDATE trigger fires, validates that the marks aren't over 100, and automatically calculates and saves the Letter Grade.
Another example (Jihad): We have a Protection Trigger that runs BEFORE DELETE on the Faculty table. If an Admin tries to delete a faculty member who is still advising students, the trigger throws a custom error and stops the deletion."
🔥 Keywords to say: Event-driven, Automates business logic, Maintains Data Integrity, Prevents accidental deletion.

### 2. If asked: "What is a Stored Procedure and why didn't you just write normal SQL queries?"
   (Best answered by Jisan)

How to answer:
"Sir, a Stored Procedure is a prepared, compiled set of SQL statements that we can save in the database and call repeatedly. Unlike a simple query, a procedure can take parameters and handle complex logic like IF/ELSE conditions and loops.

We used 3 Stored Procedures for our most complex operations to ensure ACID properties.

For example (Jisan): Our Course Enrollment feature is a stored procedure. When a student clicks 'Enroll', a lot of things must happen at exactly the same time. The procedure starts a TRANSACTION. It checks if the student meets prerequisites, checks if there are empty seats, inserts the student, and reduces the available seat count.
Why we used it: If we used normal queries and the power went out halfway through, a student might be enrolled but the seat count wouldn't update. Our procedure ensures Atomicity—if one step fails, the entire transaction ROLLBACKS. If it succeeds, it COMMITS."
🔥 Keywords to say: ACID compliance, Atomicity, Transactions, Rollback and Commit, Reduces network traffic.

### 3. If asked: "What is a View and how is it different from a Table?"
   (Best answered by Jihad or Mollah)

How to answer:
"Sir, a View is essentially a 'virtual table' created by a saved SQL query. Unlike a real table, a view does not actually store any physical data itself; it dynamically pulls data from the underlying tables every time you look at it.

We created 5 Views to handle complex reporting.

For example (Jihad): To show a Student's Transcript, we have to pull data from the students, enrollments, courses, and results tables. Instead of writing a massive 4-table JOIN query every single time in our backend code, we saved it as a Transcript View in the database. Now, our backend just runs a simple SELECT * FROM student_transcript_view.
Why we used it: We used views for two reasons: Simplicity (it hides complex JOINs from the application layer) and Security (we can show users data like grades without exposing sensitive columns like passwords in the underlying Users table)."
🔥 Keywords to say: Virtual Table, Hides complexity (Abstration), Security layer, Pre-written complex JOINs.

💡 Pro-Tip for the Viva/Q&A:
If a teacher asks a question, start with: "That is a great question, sir." Then give the Definition, followed immediately by "For example, in our system..."

Teachers love it when you connect theoretical concepts directly to the real code you wrote!

---

## 🛡 "Escape" Phrases
If you are stuck on a question, use these to stay professional:
*   *"That's a great point. Currently, we handled that through [X], but we've planned to optimize it in the next phase using [Y]."*
*   *"In our current scope, we prioritized [Primary Feature], but your suggestion for [Their Point] is definitely the right architectural direction for scalability."*
*   *"We considered that approach, but we decided on our current implementation to ensure [Security/Integrity] was the top priority."*
