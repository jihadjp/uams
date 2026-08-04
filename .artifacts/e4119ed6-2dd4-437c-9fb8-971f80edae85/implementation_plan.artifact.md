# Implementation Plan - Semester & Credit-based Fee Management

The user wants to implement a payment-based course registration system.
1.  Each batch has a fixed **Registration Fee** per semester.
2.  Each credit costs **6500 BDT**.
3.  Students must pay the fixed Registration Fee *before* they are allowed to enroll in any courses.
4.  The remaining balance (credit fees) can be paid later (before final exams).

## Proposed Changes

### Backend Changes

#### [NEW] [BatchSemesterFee.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/model/BatchSemesterFee.java)
- Entity to store the fixed fee for a batch in a specific semester.
- Fields: `id`, `batch`, `semester`, `registrationFee`.

#### [MODIFY] [Fee.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/model/Fee.java)
- Add fields:
    - `registrationFee`: The fixed portion (from `BatchSemesterFee`).
    - `creditFee`: The variable portion (Credits Enrolled * 6500).
- `amountDue` will be calculated as `registrationFee + creditFee`.

#### [MODIFY] [FeeService.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/FeeService.java) & `FeeServiceImpl.java`
- Add method `syncSemesterFee(UUID studentId, UUID semesterId)`:
    - Calculates total enrolled credits for the semester.
    - Fetches `BatchSemesterFee` for the student's batch.
    - Updates the `Fee` record (or creates one if missing).
- Add method `isRegistrationPayed(UUID studentId, UUID semesterId)`:
    - Returns true if `Fee.amountPaid >= BatchSemesterFee.registrationFee`.

#### [MODIFY] [EnrollmentServiceImpl.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/EnrollmentServiceImpl.java)
- In `registerCourse`:
    - Before allowing registration, call `feeService.isRegistrationPayed`.
    - If false, throw `RuntimeException("Registration blocked: Semester registration fee not paid.")`.
    - After saving enrollment, call `feeService.syncSemesterFee` to update the total amount due.
- In `dropCourse`:
    - After dropping, call `feeService.syncSemesterFee` to reduce the total amount due.

---

### Frontend Changes

#### [NEW] Batch Fee Config Page
- Admin page to set the `registrationFee` for each batch in the upcoming semester.

#### [MODIFY] [AdvisorRegistration.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/faculty/AdvisorRegistration.jsx) & [CourseRegistration.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/student/CourseRegistration.jsx)
- Display a warning/error if the registration fee is not paid.
- Show the breakdown of fees (Registration vs Credits).

## Open Questions

> [!IMPORTANT]
> - **Retakes**: Should retake courses also cost 6500/credit? (Assuming yes for now).
> - **Initial Fee Generation**: When should the `Fee` record be created? (Suggesting: Create it with `amountDue = registrationFee` as soon as the semester starts or when the student first tries to pay).

## Verification Plan

### Manual Verification
1.  Admin sets Batch 67 Registration Fee to **15,000 BDT** for Spring 2024.
2.  Student from Batch 67 attempts to register for a course *without paying*. System should block them.
3.  Student pays **15,000 BDT**.
4.  Student registers for 3 courses (Total 9 credits).
5.  Check Fee record:
    - Registration Fee: 15,000
    - Credit Fee: 9 * 6500 = 58,500
    - Total Due: 73,500
    - Amount Paid: 15,000
6.  Student drops a 3-credit course. Total Due should decrease to 54,000.
