<div align="center">

<img src="frontend/public/images/logo.png" alt="UAMS Logo" width="120" />

# 🎓 University Academic Management System (UAMS)

**A full-stack academic ERP for universities — course registration, fee clearance, attendance, exams, results, and a fully normalized MySQL database with triggers, procedures, and views.**

[![MySQL](https://img.shields.io/badge/MySQL-8.0.16%2B-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://dev.mysql.com/doc/refman/8.0/en/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.0-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/21/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

[Features](#-key-features) • [Screenshots](#-screenshots) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [Database](#-database-design) • [Installation](#-installation) • [API](#-api-overview) • [Team](#-team)

</div>

---

## 📑 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🖼️ Screenshots](#-screenshots)
- [🧰 Tech Stack](#-tech-stack)
- [🏗️ Architecture](#-architecture)
- [🗄️ Database Design](#-database-design)
- [🚀 Installation](#-installation)
- [▶️ Usage](#-usage)
- [📂 Project Structure](#-project-structure)
- [🔌 API Overview](#-api-overview)
- [🧪 Testing & Verification](#-testing--verification)
- [🛠️ Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
- [👥 Team](#-team)
- [🙏 Acknowledgements](#-acknowledgements)

---

## 🌟 Overview

**UAMS (University Academic Management System)** is a complete academic ERP that digitizes the day-to-day operations of a university. It supports three first-class user roles — **Admin / Registrar**, **Faculty**, and **Student** — each with their own dashboard, workflows, and permission boundaries.

The project was built as a **DBMS Lab project** with a *production-grade twist*: the database isn't just a place to store rows — business rules are enforced at the **schema**, **trigger**, and **stored-procedure** layers. The most exciting example is the *fee-clearance → registration → seat-safety* chain, which guarantees that a financially uncleared student **cannot** register, and that the last seat in a course section **can never be sold twice** (even under concurrent traffic).

> **TL;DR** — A modern, full-stack university portal backed by a real, normalized, trigger-driven MySQL 8 schema and a Spring Boot 4 / React 18 frontend.

---

## ✨ Key Features

### 👨‍🎓 For Students
- 🔐 Secure login with forced password change on first sign-in
- 📚 **Course Registration** with automatic prerequisite + seat-availability + fee-clearance checks
- 📊 **Live Results** & **Final Results** with auto-calculated grade & grade-point
- 🕒 **Routine / Class Schedule** and **Academic Calendar** views
- 💸 **Fee ledger** with real-time status (Paid / Partial / Unpaid)
- ✅ **Semester Clearance** workflow
- 🎫 Apply for **Transcript / Certificate / Convocation**
- 🏠 Hall management, transport card, laptop scheme, scholarship & financial aid
- 📝 Teaching evaluation, mentor meetings, attendance self-view

### 👨‍🏫 For Faculty
- 🗂️ **My Courses** with roster & schedule
- 📝 **Attendance Marking** (per session, per offering)
- 🧪 **Exam Management** (create exams, set total marks)
- 🎯 **Marks Entry** — grade & grade-point auto-computed by trigger
- 📤 **Publish Results** with a single transaction over the whole offering
- 👥 **Advisee list** and **Advisor Registration** approval
- 📈 Student-results analytics for assigned advisees

### 🛡️ For Admin / Registrar
- 🏛️ Manage **Departments, Programs, Batches, Semesters**
- 📖 Manage **Courses & Course Offerings** (with seat caps)
- 👥 Manage **Students, Faculty, Registrars** (full CRUD + detail view)
- 💰 **Batch Fee Management** & **Fee Collection Ledger**
- 📄 **Document Requests** & **Convocation** management
- 📢 **Notices** (role-targeted)
- 💸 **Financial Aid** workflow
- ✅ **Result Approval** (publish or reject faculty submissions)
- 📊 Dashboards with KPIs (students, faculty, fees, results, etc.)

### 🗄️ Database-Engineered Highlights
- ✅ **3NF schema** with PK / FK / UNIQUE / ENUM / **CHECK** constraints
- ⚡ **3 triggers** — auto-grading, cross-table marks validation, fee-status derivation, enrollment gatekeeping, seat-counter sync, published-result protection
- 🔁 **3 stored procedures** — semester GPA, transactional+locked enrollment, batch result publication
- 👁️ **3 views** — transcript, attendance summary, fee collection, dept performance, course difficulty
- 🧩 **28 tables**, **~1,330 realistic seed rows**, every table ≥ 20 rows
- 🔐 **5 least-privilege DB roles** (designed for the project; assign in your own MySQL via `CREATE USER` + `GRANT`)
- 🛡️ Race-condition-safe enrollment via `FOR UPDATE` row locking

---

## 🖼️ Screenshots

> Drop your screenshots into the [`/screenshots`](screenshots) folder using the file names below. They will render here automatically.

### 🔐 Authentication

| Login | Forgot Password | Change Password |
| :---: | :---: | :---: |
| ![Login](screenshots/01-login.png) | ![Forgot Password](screenshots/02-forgot-password.png) | ![Change Password](screenshots/03-change-password.png) |

### 🎓 Student Portal

**Student Dashboard**

![Student Dashboard](screenshots/04-student-dashboard.png)

![Student Dashboard](screenshots/04-student-dashboard-dark.png)

**Course Registration & Academic Life**

|                             Course Registration                             | Live Results | Routine |
|:---------------------------------------------------------------------------:| :---: | :---: |
| ![Course Registration](screenshots/05-student-course-registration-dark.png) | ![Live Results](screenshots/06-student-live-results-dark.png) | ![Routine](screenshots/07-student-routine-dark.png) |
|   ![Course Registration](screenshots/05-student-course-registration.png)    | ![Live Results](screenshots/06-student-live-results.png) | ![Routine](screenshots/07-student-routine.png) |

**Fees, Attendance, Services**

| Fees & Ledger |                       Teaching Evaluation                       |                              Transcript Request                               |
| :---: |:-----------------------------------------------------:|:-----------------------------------------------------------------------------:|
| ![Fees](screenshots/08-student-fees-dark.png) | ![Attendance](screenshots/09-teaching-evaluation-dark.png) |           ![Transcript](screenshots/10-student-transcript-dark.png)           |
| ![Fees](screenshots/08-student-fees.png) | ![Attendance](screenshots/09-teaching-evaluation.png) | ![Transcript](screenshots/10-student-transcript.png) |

### 👨‍🏫 Faculty Portal

**Faculty Dashboard**

![Faculty Dashboard](screenshots/11-faculty-dashboard.png)

![Faculty Dashboard](screenshots/11-faculty-dashboard-dark.png)

**Courses, Attendance Marking & Marks Entry**

| My Courses | Attendance Marking | Marks Entry |
| :---: | :---: | :---: |
| ![My Courses](screenshots/12-faculty-my-courses-dark.png) | ![Attendance Marking](screenshots/13-faculty-attendance-dark.png) | ![Marks Entry](screenshots/14-faculty-marks-entry-dark.png) |
| ![My Courses](screenshots/12-faculty-my-courses.png) | ![Attendance Marking](screenshots/13-faculty-attendance.png) | ![Marks Entry](screenshots/14-faculty-marks-entry.png) |

|                           Publish Results                           | Advisee List |
|:-------------------------------------------------------------------:| :---: |
| ![Publish Results](screenshots/15-faculty-publish-results-dark.png) | ![Advisee List](screenshots/16-faculty-advisees-dark.png) |
|   ![Publish Results](screenshots/15-faculty-publish-results.png)    | ![Advisee List](screenshots/16-faculty-advisees.png) |

### 🛡️ Admin / Registrar Portal

**Admin Dashboard**

![Admin Dashboard](screenshots/17-admin-dashboard.png)

![Admin Dashboard](screenshots/17-admin-dashboard-dark.png)

**Operations**

| Student List | Student Detail | Faculty List |
| :---: | :---: | :---: |
| ![Student List](screenshots/18-admin-students-dark.png) | ![Student Detail](screenshots/19-admin-student-detail-dark.png) | ![Faculty List](screenshots/20-admin-faculty-dark.png) |
| ![Student List](screenshots/18-admin-students.png) | ![Student Detail](screenshots/19-admin-student-detail.png) | ![Faculty List](screenshots/20-admin-faculty.png) |

|                        Course Offerings                        | Batch & Fee Mgmt | Result Approval |
|:--------------------------------------------------------------:| :---: | :---: |
| ![Course Offerings](screenshots/21-admin-course-offerings-dark.png) | ![Batch Fees](screenshots/22-admin-batch-fees-dark.png) | ![Result Approval](screenshots/23-admin-result-approval-dark.png) |
| ![Course Offerings](screenshots/21-admin-course-offerings.png) | ![Batch Fees](screenshots/22-admin-batch-fees.png) | ![Result Approval](screenshots/23-admin-result-approval.png) |

| Notices | Document Requests | Convocation |
| :---: | :---: | :---: |
| ![Notices](screenshots/24-admin-notices-dark.png) | ![Document Requests](screenshots/25-admin-documents-dark.png) | ![Convocation](screenshots/26-admin-convocation-dark.png) |
| ![Notices](screenshots/24-admin-notices.png) | ![Document Requests](screenshots/25-admin-documents.png) | ![Convocation](screenshots/26-admin-convocation.png) |

### 🗄️ Database & ERD

**Entity-Relationship Diagram (Chen notation)** [📄 Download PDF](erd/Schema%20Diagram.pdf)

![ER Diagram](erd/ER%20Diagram.png)

> *Print or screenshot the full ERD for the report — it covers all 28 tables and their relationships.*

---

## 🧰 Tech Stack

### Frontend
| Layer | Technology |
| :--- | :--- |
| Framework | **React 18.3** (Vite 5) |
| Routing | **React Router 6** |
| State | **Zustand** |
| Styling | **Tailwind CSS 3.4** |
| Animations | **Framer Motion 11** |
| Forms | **React Hook Form 7** |
| Charts | **Recharts 2** |
| Icons | **Lucide React** |
| HTTP | **Axios 1.7** |
| Notifications | **React Hot Toast** |

### Backend
| Layer | Technology |
| :--- | :--- |
| Language | **Java 21** |
| Framework | **Spring Boot 4.1** |
| Persistence | **Spring Data JPA** (Hibernate) |
| Security | **Spring Security + JWT (jjwt 0.12.6)** |
| Validation | **Jakarta Bean Validation** |
| Mail | **Spring Boot Starter Mail** |
| DB Driver | **MySQL Connector/J** |
| Build | **Maven** (`mvnw`) |
| Utilities | **Lombok** |
| Monitoring | **Spring Boot Actuator** |

### Database
| Layer | Technology |
| :--- | :--- |
| RDBMS | **MySQL 8.0.16+** (CHECK constraints required) |
| Schema | **3NF**, 28 tables, PK / FK / UNIQUE / ENUM / CHECK |
| Logic | **9 triggers**, **3 stored procedures**, **5 views** |
| Roles | **5 least-privilege users** (optional) |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    React 18 + Vite Frontend                  │
│   Student Portal │ Faculty Portal │ Admin / Registrar        │
│        (Zustand + React Router + Tailwind)                   │
└──────────────────────────┬───────────────────────────────────┘
                           │  REST + JWT (Bearer)
                           ▼
┌──────────────────────────────────────────────────────────────┐
│            Spring Boot 4.1 REST API  (Java 21)               │
│   Spring Security │ JPA / Hibernate │ Bean Validation        │
└──────────────────────────┬───────────────────────────────────┘
                           │  JDBC
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                       MySQL 8.0.16+                          │
│   28 Tables │ 9 Triggers │ 3 Procedures │ 5 Views │ 5 Roles  │
└──────────────────────────────────────────────────────────────┘
```

The **3-layer separation** is intentional:
1. The **DB layer** owns invariants (fee-clearance gating, grade calculation, seat counters, immutability of published results).
2. The **API layer** owns workflows, security, validation, and orchestration.
3. The **UI layer** owns user experience, presentation, and feedback.

---

## 🗄️ Database Design

### Entity-Relationship Diagram

The full **Chen-notation ERD** is at [`erd/erd.svg`](erd/erd.svg). You can also open the high-resolution PNG ([`erd/erd.png`](erd/erd.png)) or PDF ([`erd/erd.pdf`](erd/erd.pdf)).

![ER Diagram](erd/erd.svg)

### Schema Modules

| Module | Tables |
| :--- | :--- |
| Identity | `users`, `students`, `faculty`, `registrars` |
| Academic Structure | `departments`, `programs`, `batches`, `semesters`, `courses` |
| Course Lifecycle | `course_offerings`, `enrollments`, `exams`, `results`, `attendance` |
| Finance | `fees`, `financial_aid`, `scholarships` |
| Student Services | `hall_management`, `transport_cards`, `laptop_scheme`, `career_hub` |
| Communication | `notices`, `documents`, `convocation` |
| Pedagogy | `mentor_meetings`, `teaching_evaluations` |

### Database Logic Inventory

| Type | Count | Examples |
| :--- | :---: | :--- |
| Tables | **28** | All 3NF, with CHECK constraints |
| Triggers | **9** | `trg_results_before_insert` (auto-grade), `trg_enrollments_before_insert` (fee-clearance gate), `trg_course_offerings_seat_sync` (seat counter), `trg_fees_status_update` (status derivation) |
| Stored Procedures | **3** | `sp_calculate_semester_gpa`, `sp_enroll_student` (with `FOR UPDATE` lock), `sp_publish_semester_results` (transactional batch) |
| Views | **5** | `vw_student_transcript`, `vw_attendance_summary`, `vw_fee_collection`, `vw_department_performance`, `vw_course_difficulty` |
| Roles | **5** | `uams_admin`, `uams_registrar`, `uams_faculty`, `uams_student`, `uams_readonly` |

> For a complete walkthrough of every file → rubric component, see the original [`database/`](database) section below.

---

## 🚀 Installation

### Prerequisites

Make sure you have the following installed:

| Tool | Version | Notes |
| :--- | :--- | :--- |
| **Node.js** | ≥ 18.x | For the React frontend |
| **npm** | ≥ 9.x | (or `pnpm` / `yarn`) |
| **Java JDK** | **21** | The backend is built with JDK 21 |
| **Maven** | ≥ 3.9 | The repo includes `mvnw` (Maven Wrapper) |
| **MySQL Server** | **≥ 8.0.16** | CHECK constraint support is required |

### 1. Clone the repository

```bash
git clone https://github.com/jihadjp/uams.git
cd uams
```

### 2. Set up the database

The repo includes the schema, seed data, triggers, procedures, and views as separate SQL files in [`database/`](database). Run them in order:

**Linux / macOS / WSL:**
```bash
cd database
mysql -u root -p < uams.sql          # full schema (drop + create + 28 tables)
mysql -u root -p < seed_data.sql     # ~1,330 realistic rows (idempotent)
mysql -u root -p < triggers.sql      # 9 triggers
mysql -u root -p < procedures.sql    # 3 stored procedures
mysql -u root -p < views.sql         # 5 views
```

**Windows (PowerShell):**
```powershell
cd database
Get-Content uams.sql, seed_data.sql, triggers.sql, procedures.sql, views.sql | mysql -u root -p
```

**Or step by step:**
```bash
mysql -u root -p < database/uams.sql          # full schema
mysql -u root -p < database/seed_data.sql     # seed data
mysql -u root -p < database/triggers.sql      # triggers
mysql -u root -p < database/procedures.sql    # procedures
mysql -u root -p < database/views.sql         # views
```

> ⚠️ **`uams` is created on first run.** If you re-run the schema on an existing DB, it will drop and recreate the tables. The seed file is idempotent and can be re-run safely.

### 3. Configure the backend

Edit `backend/src/main/resources/application-dev.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/uams
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
```

### 4. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

The API will be available at **http://localhost:8080**.

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## ▶️ Usage

### Default Demo Credentials

The seed inserts demo accounts. **All passwords force a change on first login** (`must_change_password = 1`).

| Role | Identifier | Password |
| :--- | :--- | :--- |
| Admin | `admin` | `admin123` |
| Registrar | `registrar` | `registrar123` |
| Faculty | `EMP-0001` | `faculty123` |
| Student | `231-15-111` | `student123` |

> Replace before deploying anywhere public.

### Workflow Walkthrough

1. **Log in** as a student → see the dashboard, register for courses (gated by fee clearance + seat availability + prerequisites).
2. **Log in** as faculty → mark attendance, enter marks (grade + grade-point are auto-calculated), then **publish** results.
3. **Log in** as admin/registrar → approve results, manage batches, fees, notices, convocation, etc.

---

## 📂 Project Structure

```
uams/
├── 📁 backend/                  # Spring Boot 4.1 REST API (Java 21)
│   ├── 📁 src/main/java/...     # Controllers, services, repositories, entities
│   ├── 📁 src/main/resources/   # application.properties
│   ├── pom.xml
│   └── mvnw, mvnw.cmd
│
├── 📁 frontend/                 # React 18 + Vite + Tailwind
│   ├── 📁 public/
│   │   ├── 📁 images/logo.png
│   │   └── 📁 videos/campus-bg.mp4
│   ├── 📁 src/
│   │   ├── 📁 api/              # 25+ Axios API modules
│   │   ├── 📁 components/
│   │   ├── 📁 layouts/          # Admin / Faculty / Student
│   │   ├── 📁 pages/
│   │   │   ├── 📁 admin/        # 27 admin pages
│   │   │   ├── 📁 faculty/      # 10 faculty pages
│   │   │   ├── 📁 student/      # 22 student pages
│   │   │   ├── 📁 common/       # Profile, notices, settings
│   │   │   └── 📁 auth/         # Login, forgot/change password
│   │   ├── 📁 routes/           # ProtectedRoute
│   │   ├── 📁 store/            # Zustand stores
│   │   └── App.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── 📁 database/                 # MySQL 8.0.16+
│   ├── uams.sql                 # Full schema (28 tables, 3NF, CHECK)
│   ├── seed_data.sql            # ~1,330 rows, idempotent
│   ├── triggers.sql             # 3 triggers
│   ├── procedures.sql           # 3 stored procedures
│   └── views.sql                # 3 views
│
├── 📁 erd/
│   ├── erd.svg                  # Chen-notation ERD (vector)
│   ├── erd.png                  # High-res PNG
│   ├── erd.pdf                  # Printable PDF
│   ├── erd_model.mwb            # MySQL Workbench model
│   └── ss.sql                   # ERD-derived SQL
│
├── 📁 screenshots/              # ⬅ drop your app screenshots here
│
├── Project_Report.md            # Detailed viva-ready report
├── ex.md                        # Extended notes
├── online_server.md             # Online deployment notes
└── README.md                    # ← you are here
```

---

## 🔌 API Overview

The backend is a **REST + JWT** API. All protected endpoints expect `Authorization: Bearer <token>`.

| Group | Sample endpoints |
| :--- | :--- |
| **Auth** | `POST /api/auth/login`, `POST /api/auth/change-password`, `POST /api/auth/forgot-password` |
| **Students** | `GET /api/students`, `GET /api/students/{id}`, `POST /api/students`, `PUT /api/students/{id}` |
| **Faculty** | `GET /api/faculty`, `GET /api/faculty/{id}`, `POST /api/faculty` |
| **Courses** | `GET /api/courses`, `POST /api/courses`, `PUT /api/courses/{id}` |
| **Offerings** | `GET /api/course-offerings`, `POST /api/course-offerings` |
| **Enrollments** | `POST /api/enrollments` (uses `sp_enroll_student` under the hood) |
| **Results** | `GET /api/results`, `POST /api/results` (auto-grade via trigger) |
| **Attendance** | `POST /api/attendance/mark`, `GET /api/attendance/offering/{id}` |
| **Fees** | `GET /api/fees`, `POST /api/fees/pay` (status derived by trigger) |
| **Notices** | `GET /api/notices`, `POST /api/notices` |
| **Dashboard** | `GET /api/dashboard/admin`, `GET /api/dashboard/faculty`, `GET /api/dashboard/student` |

> Use Spring Boot Actuator at `/actuator/health` to verify the service is up.

---

## 🧪 Testing & Verification

The seed generator includes a structural sanity checker:

```bash
cd database
python3 tools/verify_seed.py
```

It verifies columns, primary keys, foreign keys, and the clearance rule.

Regenerate the seed any time:

```bash
python3 tools/generate_seed.py
```

---

## 🛠️ Troubleshooting

| Error | Cause | Fix |
| :--- | :--- | :--- |
| `ERROR 1364: Field 'batch_id' doesn't have a default value` | Schema was created by the Spring app (`ddl-auto=update`), whose tables have extra NOT NULL FK columns | Re-run `database/uams.sql` to recreate the canonical schema |
| `ERROR 1054: Unknown column 'term' ...` | Old script lacks `term`, `academic_year`, `course_type`, `seats_taken` | Re-run `database/uams.sql` (the canonical schema has all of them) |
| `ERROR 1265: Data truncated for column 'target_role'` | Old script's `notices.target_role` ENUM has no `'REGISTRAR'` | Use the canonical `uams.sql` (its ENUM is wide enough) |
| `ERROR 1062: Duplicate entry ...` | Seed was run twice on existing data | Re-run `database/seed_data.sql` — it is idempotent |
| `ERROR 1045: Access denied` | Wrong credentials | Use an account with DDL rights (default loader user: `root`) |
| `Trigger already exists` on re-run | — | `triggers.sql`, `procedures.sql`, `views.sql` all start with `DROP ... IF EXISTS`; simply re-run |
| CHECK constraints are ignored | MySQL < 8.0.16 | Upgrade to MySQL 8+ (XAMPP ≥ 8.x or MySQL Installer 8.x) |

---

## 🤝 Contributing

Contributions are welcome!

1. **Fork** the repo
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a **Pull Request**

Please make sure to:
- Follow the existing code style (Tailwind on the frontend, standard Spring Boot conventions on the backend)
- Update the README/screenshots if you change UI flow
- Add SQL seed entries if you introduce new tables

---

## 📜 License

This project is licensed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## 👥 Team

|  |  |
| :---: | :---: |
| **Md. JIHAD HOSSEN** | **Team** |
| [![GitHub](https://img.shields.io/badge/GitHub-jihadjp-181717?style=flat-square&logo=github)](https://github.com/jihadjp) | University Academic Management System |

> *Built as a DBMS Lab project with a production-grade twist.*

---

## 🙏 Acknowledgements

- The **MySQL** documentation team — for an excellent RDBMS.
- The **Spring** and **React** communities — for the tools that made this possible.
- **Lucide** for the beautiful open-source icons used throughout the UI.
- **Vercel** for the frontend hosting configuration (`vercel.json`).
- All open-source contributors whose libraries we used.

---

<div align="center">

### ⭐ If you find this project useful, please consider giving it a star!

**Made with ❤️ for cleaner academic data.**

</div>