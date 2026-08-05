# Tasks - Convocation Eligibility Enforcement

- [x] **Backend Implementation**
    - [x] Update `StudentAcademicStandingResponse` DTO to include `requiredCredits`
    - [x] Update `ResultServiceImpl` to populate `requiredCredits` from student's program
- [x] **Frontend Implementation**
    - [x] Update `ConvocationApplication.jsx` to fetch and store `requiredCredits`
    - [x] Implement eligibility check logic (CGPA >= 2.50 and Credits >= Required)
    - [x] Add "Not Eligible" UI state with descriptive messaging
- [x] **Verification**
    - [x] Verify that ineligible students are blocked with the correct message
    - [x] Verify that eligible students can still apply
