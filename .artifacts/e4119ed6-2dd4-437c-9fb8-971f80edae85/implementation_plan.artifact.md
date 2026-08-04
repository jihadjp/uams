# Implementation Plan - Fix Student Live Results Display

The user reported that courses are not displaying correctly on the student's "Live Results" page. This plan covers backend improvements to data integrity and frontend updates for a better user experience.

## Proposed Changes

### Backend Changes

#### [MODIFY] [ResultServiceImpl.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/ResultServiceImpl.java)
- **Filter Out Dropped Courses**: Update `getLiveResults` to filter out enrollments with `DROPPED` status.
- **Null Safety in Mapping**: Add defensive null checks in `mapToLiveResult` to prevent `NullPointerException` if some relations (Course, Offering, Section, Faculty) are missing or inconsistent.

### Frontend Changes

#### [MODIFY] [LiveResults.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/student/LiveResults.jsx)
- **Auto-fetch for Active Semester**: Update `fetchData` to call `fetchResults` automatically once the student profile and semesters are loaded, instead of requiring a manual "Search" click for the current semester.
- **Use Active Semester**: Prioritize selecting the "Active" semester in the dropdown by default instead of just taking the first one in the list.
- **Loading State Feedback**: Improve visual feedback when no results are found after a search.

## Verification Plan

### Manual Verification
1.  Log in as a student.
2.  Navigate to **Academic Management > Live Results**.
3.  Verify that courses for the active semester load automatically.
4.  Verify that courses dropped in previous or current semesters do not appear in the list.
5.  Verify that clicking "View Result" correctly expands and shows the breakdown (Attendance, Quizzes, Midterm).
6.  Change the semester in the dropdown and click "Search" to verify historical data display.
