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

---

## 🛡 "Escape" Phrases
If you are stuck on a question, use these to stay professional:
*   *"That's a great point. Currently, we handled that through [X], but we've planned to optimize it in the next phase using [Y]."*
*   *"In our current scope, we prioritized [Primary Feature], but your suggestion for [Their Point] is definitely the right architectural direction for scalability."*
*   *"We considered that approach, but we decided on our current implementation to ensure [Security/Integrity] was the top priority."*
