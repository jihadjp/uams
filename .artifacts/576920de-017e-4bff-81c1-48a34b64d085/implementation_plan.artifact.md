# Implementation Plan - Professional Student Evaluation System

This plan outlines the implementation of a professional student evaluation system where students can provide feedback on faculty members. The system ensures student privacy by hiding individual data from faculty while allowing administrators and registrars to monitor performance via aggregate ratings.

## User Review Required

> [!IMPORTANT]
> - **Student Privacy**: Faculty members will not have access to evaluation endpoints or views.
> - **Persistence**: Once submitted, an evaluation cannot be edited or resubmitted.
> - **Scoring**: A 10-question evaluation using a 5-point scale (1-5). The system automatically calculates the average rating.

## Proposed Changes

### 1. Database & Schema

#### [MODIFY] [university_academic_management_schema.sql](file:///E:/Project/DBMS/uams/backend/university_academic_management_schema.sql)
- Add `evaluations` table with columns for 10 specific questions (`q1` to `q10`), `average_rating`, `comments`, and a unique constraint on `(student_id, offering_id)`.

#### [NEW] [Evaluation.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/model/Evaluation.java)
- Entity to map the `evaluations` table.

### 2. Backend Implementation

#### [NEW] [Evaluation DTOs](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/dto/)
- `EvaluationRequest.java`: For submission.
- `EvaluationResponse.java`: Detailed view for Admin.
- `FacultyEvaluationSummary.java`: Aggregate stats (Total evaluations, overall average rating).

#### [NEW] [EvaluationRepository.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/repository/EvaluationRepository.java)
- Custom queries to calculate average ratings per faculty and check student submission status.

#### [NEW] [EvaluationService.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/EvaluationService.java) & [Impl](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/EvaluationServiceImpl.java)
- Logic to calculate average ratings and prevent double submissions.

#### [NEW] [EvaluationController.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/controller/EvaluationController.java)
- `POST /api/evaluations`: Student submission.
- `GET /api/evaluations/my-offerings`: List current offerings with submission status.
- `GET /api/evaluations/faculty/{facultyId}`: Stats for Admin/Registrar.

### 3. Frontend Implementation

#### [NEW] [evaluationApi.js](file:///E:/Project/DBMS/uams/frontend/src/api/evaluationApi.js)
- API wrapper for the new endpoints.

#### [MODIFY] [TeachingEvaluation.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/student/TeachingEvaluation.jsx)
- Replace mock data with real course enrollments.
- Implement the 10-question radio button group.
- Handle submission and update button state to "Done" (disabled).

#### [MODIFY] [FacultyDetail.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/admin/FacultyDetail.jsx)
- Add a "Teaching Performance" section (visible only to Admin/Registrar) showing the aggregate rating.

## Verification Plan

### Automated Tests
- Backend: Unit test to verify the average rating calculation (sum of q1...q10 divided by 10).

### Manual Verification
1. Login as a **Student**.
2. Navigate to **Teaching Evaluation**.
3. Select a course, fill the 10 questions, and submit.
4. Verify the button changes to "Done" and is disabled.
5. Try to access the submission API again manually to ensure the unique constraint/service logic blocks it.
6. Login as an **Admin**.
7. Go to **Faculty List** and click on a faculty member.
8. Verify the "Teaching Performance" section shows the correct aggregate rating.
9. Verify that a **Faculty** user cannot see their own ratings via the UI.
