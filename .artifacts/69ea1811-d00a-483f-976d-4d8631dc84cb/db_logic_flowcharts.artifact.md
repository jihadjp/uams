# UAMS: Database Logic Flowcharts

Use these Mermaid diagrams to visually explain your complex SQL logic during the presentation. These are perfect for Slide 14, 15, and 16.

---

## ⚡ 1. Trigger: Attendance Warning Flow
*Explaining `trg_attendance_low_warning`*

```mermaid
flowchart TD
    Start([Attendance Marked]) --> Insert[Insert Record into attendance Table]
    Insert --> Calc[Calculate Percentage for Enrollment ID]
    Calc --> Threshold{Classes >= 5?}
    Threshold -- No --> End([End])
    Threshold -- Yes --> CheckPct{Percentage < 75%?}
    CheckPct -- No --> End
    CheckPct -- Yes --> Notice[Auto-Insert Low Attendance Notice]
    Notice --> End
```

---

## ⚙️ 2. Procedure: Result Publishing Workflow
*Explaining `sp_publish_results`*

```mermaid
flowchart TD
    Start([Registrar Calls Procedure]) --> Input[Input: Course Offering ID]
    Input --> VerifyMarks{All Students have Final Marks?}
    VerifyMarks -- No --> Error[Throw Error: Incomplete Marks]
    VerifyMarks -- Yes --> Publish[Set published_at = CURRENT_TIMESTAMP]
    Publish --> Approve[Set is_results_approved = TRUE in Offering]
    Approve --> Complete[Update Enrollment Status to 'COMPLETED']
    Complete --> Success([Success: Results Live for Students])
```

---

## 📊 3. View: Dynamic GPA Calculation
*Explaining `v_student_semester_summary`*

```mermaid
flowchart LR
    Data[(Raw Marks Data)] --> Join[Join with Grading Policies]
    Join --> Match{Mark BETWEEN min AND max?}
    Match --> Points[Extract Grade Point]
    Points --> Weighted[Multiply by Credit Hours]
    Weighted --> Agg[Sum All Weighted Points]
    Agg --> Div[Divide by Total Semester Credits]
    Div --> GPA([Final Semester GPA])
```

---

## 🛡 4. Trigger: Enrollment Clearance Check
*Explaining `trg_enrollment_requires_clearance`*

```mermaid
flowchart TD
    Start([Student Clicks Enroll]) --> Check[Trigger Intercepts INSERT]
    Check --> Query[Query semester_clearance Table]
    Query --> Status{registration_cleared == TRUE?}
    Status -- Yes --> Allow[Allow Database Insertion]
    Status -- No --> Block[SIGNAL SQLSTATE: Throw Error]
    Block --> UI[Frontend Displays: Registration Not Cleared]
```

---

> [!TIP]
> **Slide Design Tip**: When putting these on a slide, keep the diagram on one side and the actual SQL code snippet on the other. This shows that you understand the "Logic" (Flowchart) and the "Syntax" (Code).
