# Implementation Plan - Simplified Faculty Marks Entry System

Redesign the grading system to remove the manual creation of assessments by faculty. The system will automatically provide fixed slots for standard assessments (Quizzes, Midterm, Final) and allow direct marks entry in a matrix view.

## Proposed Changes

### Backend Enhancements

#### [MODIFY] [ResultService.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/ResultService.java)
- Add `List<LiveResultResponse> getMarksMatrix(UUID offeringId);` to fetch a matrix of students and their marks across all standard exams.
- Add `void saveMarksMatrix(UUID offeringId, List<LiveResultResponse> matrix);` to save all marks at once.

#### [MODIFY] [ResultServiceImpl.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/ResultServiceImpl.java)
- Implement `ensureStandardExams(UUID offeringId)`:
    - Checks if standard exams (Quiz 1-3, Midterm, Final, Attendance) exist for the offering.
    - If not, auto-creates them with default weights (Quiz: 5% each, Midterm: 30%, Final: 50%, Attendance: 5%).
- Implement `getMarksMatrix`:
    - Calls `ensureStandardExams`.
    - Returns a list of `LiveResultResponse` objects containing marks for each slot.
- Implement `saveMarksMatrix`:
    - Iterates through the matrix and saves `Result` records for each enrollment and corresponding exam slot.

#### [MODIFY] [ResultController.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/controller/ResultController.java)
- Add `GET /offering/{offeringId}/matrix` endpoint.
- Add `POST /offering/{offeringId}/matrix` endpoint.

---

### Frontend Enhancements

#### [MODIFY] [ExamManagement.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/faculty/ExamManagement.jsx)
- Completely redesign the UI to be a **Direct Marks Entry** page.
- Remove the "Add Exam" button and individual assessment cards.
- Show a spreadsheet-style table:
    - **Rows**: List of enrolled students.
    - **Columns**: Student Name, Quiz 1, Quiz 2, Quiz 3, Midterm, Final.
    - **Inputs**: Editable numeric fields for marks.
- Add a "Save Changes" button at the bottom that sends the entire matrix to the backend.
- Keep a link to the Attendance page for the "Attendance" slot.

#### [MODIFY] [LiveResults.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/student/LiveResults.jsx)
- Ensure students see these slots consistently.

## Verification Plan

### Manual Verification
1.  **Faculty Access**: Log in as a Faculty member. Select a course.
2.  **Auto-Initialization**: Verify that standard columns (Q1, Q2, Q3, Mid, Final) appear automatically without clicking "Add Exam".
3.  **Marks Entry**: Enter marks for several students across different columns. Click "Save".
4.  **Persistence**: Refresh the page and verify the marks are still there.
5.  **Student View**: Log in as a student enrolled in that course. Verify that the marks are visible in the "Live Results" page.
