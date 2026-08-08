# UAMS — University Academic Management System

UAMS is a full-stack web platform for running the day-to-day academic life of a university. It serves four user roles — **Admin**, **Registrar**, **Faculty**, and **Student** — each with a dedicated portal, dashboards, and workflows covering everything from admissions-style record keeping to course registration, attendance, exams, results, fees, financial aid, and convocation.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Backend | Spring Boot (Java 21), Spring Data JPA, Spring MVC REST API |
| Security | Spring Security + JWT (JJWT), role-based access control |
| Database | MySQL (JPA/Hibernate + SQL schema) |
| Mail | Spring Mail (account credentials, password reset) |
| File Handling | Multipart uploads (up to 10 MB), local file-storage service |
| Frontend | React 18 + Vite, Tailwind CSS, Framer Motion, Lucide icons |
| State & Data | Zustand stores, Axios API client, React Router v6, React Hook Form |
| UI Extras | Recharts (analytics charts), React Hot Toast (notifications) |
| Deployment | Dockerfile + Railway-ready backend (dev/prod profiles), Vercel-ready frontend |

## Core Platform Features

- **JWT authentication** — login, change password, and forgot-password flows backed by email delivery.
- **Role-based access control** — four roles (Admin, Registrar, Faculty, Student) with protected routes on the frontend and secured endpoints on the backend.
- **Auto-generated credentials** — a password-generator service issues initial passwords for new accounts, delivered by email.
- **Profile management** — users manage their own profiles; students go through a guided "Complete Profile" flow (including guardian details).
- **Notice board** — targeted announcements by role, with per-user read/view tracking (`NoticeView`).
- **Dashboards with analytics** — role-specific dashboards with stat cards and charts (Recharts).
- **Academic calendar** — semester events and key dates managed centrally and visible to students.
- **Dark-mode-ready, animated UI** — Tailwind styling with Framer Motion transitions, responsive layouts, and collapsible role-based sidebars.

## Admin & Registrar Portal

Admins and Registrars share the institution-management console:

- **User management**
  - Students: full CRUD, search, detail views, and onboarding with auto-generated credentials.
  - Faculty: CRUD, detail views, department assignment.
  - Registrars: create and manage registrar accounts (Admin only).
- **Academic setup**
  - **Departments** — manage university departments.
  - **Programs** — degrees/programs offered under departments.
  - **Batches & Sections** — intake batches with section management.
  - **Courses** — course catalog with credits and course types (theory/lab, etc.).
  - **Semesters** — semester lifecycle management with status and term tracking.
  - **Course offerings** — schedule courses per semester/section, assign faculty (drives registration and routines).
  - **Batch fee configuration** — per-batch fee structures for billing.
- **Result approval** — review and approve results published by faculty before they go live to students.
- **Financial aid management** — review and process student scholarship/waiver/financial-aid applications.
- **Document requests** — process student requests for certificates and transcripts.
- **Convocation management** — manage convocation events and graduate applications.
- **Notice board management** — publish announcements targeted at specific roles.

## Faculty Portal

- **Faculty dashboard** — overview of assigned courses, students, and pending tasks.
- **My Courses** — view course offerings assigned for the current semester.
- **My Advisees** — advisor view of assigned students.
- **Advisor registration** — review/approve student course registrations as an academic advisor.
- **Attendance marking** — record and manage class attendance per offering/section.
- **Exam management & marks entry** — create exams (midterm, final, etc.) and enter marks per assessment.
- **Result entry & publishing** — compute results, submit them for approval, and publish to students.
- **Student results** — browse individual student performance across their courses.
- **Notice board, profile, and account settings.**

## Student Portal

### Academic Management
- **Student dashboard** — at-a-glance academic standing, CGPA progress, and announcements.
- **Academic calendar** — view official semester events and deadlines.
- **Course registration** — enroll in offered courses for the semester, subject to clearance and advisor approval.
- **Registration / exam clearance** — clearance status tracking for registration and exams.
- **Class routine** — weekly timetable generated from enrollments and offerings.
- **Attendance** — view personal attendance records per course.
- **Live results** — see marks as soon as assessments are graded, before formal publication.
- **Academic results** — official semester results and grade sheets with color-coded grades and GPA/CGPA.
- **Certificates & transcripts** — request official documents and track request status.
- **Convocation application** — apply for graduation/convocation ceremonies.
- **Teaching evaluation** — submit end-of-semester evaluations of faculty teaching.

### Financial Services
- **Payment ledger** — view fee invoices, dues, and payment history.
- **Scholarship & waiver** — browse financial-aid circulars and submit scholarship/waiver applications.

### Student Life & Services
- **Career development** — curated hub linking to career portals and professional-development resources.
- **Transport card application** — apply for university transport passes.
- **Hall management** — residential hall/seat services.
- **Laptop scheme** — university laptop program application.
- **Mentor meeting** — book and track meetings with assigned mentors.
- **Facilities** — campus facilities information hub.

## Backend Domain Model

The system models 20+ entities — `User`, `Student`, `Faculty`, `Guardian`, `Department`, `Program`, `Batch`, `Section`, `Course`, `CourseOffering`, `Semester`, `Enrollment`, `Attendance`, `Exam`, `Result`, `Fee`, `Notice`, `NoticeView`, `AcademicCalendar`, and `CalendarEvent` — with typed enums for attendance status, course type, enrollment status/type, exam type, fee status, semester status/term, student status, guardian relation, and user role. Each domain is exposed through a dedicated REST controller (auth, students, faculty, departments, programs, batches, courses, offerings, semesters, enrollments, attendance, exams, results, fees, notices, calendar, profile, and dashboards).

> **Note:** The student-services modules (transport, hall, laptop scheme, mentor meetings) and some financial-aid/evaluation flows are wired on the frontend through dedicated API modules and UI pages; their backend endpoints are being rolled out incrementally on top of the core academic engine.
