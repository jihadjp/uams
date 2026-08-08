# UAMS: Entity-Relationship Diagram (ERD)

This document provides a technical Mermaid ER diagram and a summary of the 28 tables in the UAMS database.

## 1. Visual ER Diagram (Mermaid)

```mermaid
erDiagram
    USERS ||--o| STUDENTS : "is a"
    USERS ||--o| FACULTY : "is a"
    DEPARTMENTS ||--o{ PROGRAMS : "offers"
    DEPARTMENTS ||--o{ COURSES : "owns"
    FACULTY ||--o{ STUDENTS : "advises"
    PROGRAMS ||--o{ STUDENTS : "enrolls"
    PROGRAMS ||--o{ BATCHES : "contains"
    BATCHES ||--o{ SECTIONS : "has"
    STUDENTS ||--o{ ENROLLMENTS : "makes"
    COURSES ||--o{ COURSE_OFFERINGS : "is offered as"
    COURSE_OFFERINGS ||--o{ ENROLLMENTS : "has"
    FACULTY ||--o{ COURSE_OFFERINGS : "teaches"
    ENROLLMENTS ||--o{ ATTENDANCE : "tracks"
    ENROLLMENTS ||--o{ RESULTS : "has"
    EXAMS ||--o{ RESULTS : "records"
    COURSE_OFFERINGS ||--o{ EXAMS : "includes"
    STUDENTS ||--o{ FEES : "pays"
    STUDENTS ||--o{ SEMESTER_CLEARANCE : "receives"
    USERS ||--o{ NOTICES : "posts"
    NOTICES ||--o{ NOTICE_VIEWS : "tracked in"
    STUDENTS ||--o{ DOCUMENT_REQUESTS : "applies for"
    STUDENTS ||--o{ CONVOCATION_APPLICATIONS : "applies for"
    STUDENTS ||--o{ FINANCIAL_AID_APPLICATIONS : "applies for"
    FINANCIAL_AID_CIRCULARS ||--o{ FINANCIAL_AID_APPLICATIONS : "related to"
    STUDENTS }|--|| GUARDIANS : "belongs to"
```

## 2. Table Groups

### Core Identity & Hierarchy
- `users`: Central authentication and profile data.
- `departments`: Academic units (e.g., CSE, EEE).
- `programs`: Degrees offered (e.g., BSc in CSE).
- `semesters`: Academic terms (e.g., Spring 2024).

### Academic Entities
- `students`: Detailed student records linked to users.
- `faculty`: Academic staff records linked to users.
- `courses`: The course catalog.
- `batches`: Student year/cohort groups.
- `sections`: Specific class divisions.

### Operations
- `course_offerings`: Courses assigned to faculty/batch in a semester.
- `enrollments`: Connection between students and course offerings.
- `attendance`: Daily presence tracking.
- `exams`: Assessment definitions (Mid, Final, Quiz).
- `results`: Marks obtained by students in exams.

### Financial & Admin
- `fees`: Tuition and registration fee records.
- `semester_clearance`: Multi-tier (Reg/Mid/Final) clearance status.
- `notices`: System-wide or role-targeted announcements.
- `document_requests`: Transcripts and certificates.
- `convocation_applications`: Graduation ceremony requests.
- `financial_aid_circulars` & `applications`: Scholarship management.

---

## 3. Existing ERD Files
You can also find professional diagrams already generated in your project folder:
- **Image**: [erd.png](file:///E:/Project/DBMS/uams/erd/erd.png)
- **PDF**: [erd.pdf](file:///E:/Project/DBMS/uams/erd/erd.pdf)
- **Vector**: [erd.svg](file:///E:/Project/DBMS/uams/erd/erd.svg)
- **MySQL Model**: [erd_model.mwb](file:///E:/Project/DBMS/uams/erd/erd_model.mwb)

> [!IMPORTANT]
> **Presentation Tip**: Use the **Mermaid diagram** above for your slides if you want a clean, stylized look. Use the **MySQL Workbench Model** if the teacher asks to see the technical physical schema.
