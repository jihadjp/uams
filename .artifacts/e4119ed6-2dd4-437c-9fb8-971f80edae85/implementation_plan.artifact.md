# Implementation Plan - Convocation Eligibility Logic

Update the convocation application process to enforce strict academic eligibility criteria. Students must have completed all required credits for their program and maintained a minimum CGPA of 2.50 to be eligible to apply.

## Proposed Changes

### Backend Enhancements

#### [MODIFY] [StudentAcademicStandingResponse.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/dto/StudentAcademicStandingResponse.java)
- Add `private BigDecimal requiredCredits;` to the DTO.

#### [MODIFY] [ResultServiceImpl.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/ResultServiceImpl.java)
- In `getStudentAcademicStanding`, fetch the student's `Program` to get its `totalCredits`.
- Populate the `requiredCredits` field in the response.

---

### Frontend Enhancements

#### [MODIFY] [ConvocationApplication.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/student/ConvocationApplication.jsx)
- Update `fetchInitialStanding` to store `requiredCredits` from the API response.
- Add an `eligibility` state to track if the student meets both criteria:
    - `cgpa >= 2.50`
    - `creditsCompleted >= requiredCredits`
- If ineligible:
    - Replace the application form with a clear message: **"You are not eligible to apply for convocation."**
    - Show specific reasons (e.g., "Minimum CGPA 2.50 required" or "All credits must be completed").
- Ensure the eligibility check is also performed in the `history` view if needed, or simply prevent new applications.

## Verification Plan

### Manual Verification
1.  **Ineligible (Low CGPA)**: Use a student account with CGPA < 2.50. Navigate to Convocation. Verify the "Not Eligible" message appears.
2.  **Ineligible (Incomplete Credits)**: Use a student account with `creditsCompleted < requiredCredits`. Verify the "Not Eligible" message appears.
3.  **Eligible**: Use a student account that meets both criteria. Verify the application form is accessible.
4.  **Application History**: Verify that existing applications (if any) are still visible even if the student's current status changes.
