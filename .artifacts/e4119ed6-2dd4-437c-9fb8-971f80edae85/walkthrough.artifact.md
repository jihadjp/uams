# Walkthrough - Semester & Credit-based Fee Management

I have implemented a comprehensive fee management system that links course registration with mandatory semester payments.

## Changes Made

### 1. Backend: Fee Calculation & Enforcement
- **New Model**: Created [BatchSemesterFee](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/model/BatchSemesterFee.java) to store the fixed registration amount for each batch in a specific semester.
- **Dynamic Fee Syncing**: Updated the `Fee` model and [FeeServiceImpl](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/FeeServiceImpl.java) to calculate total dues as:
    `Total Due = [Fixed Batch Registration Fee] + ([Enrolled Credits] * 6,500 BDT)`.
- **Registration Block**: Updated [EnrollmentServiceImpl](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/EnrollmentServiceImpl.java) to check if a student has paid their mandatory registration fee before allowing any course enrollment.
- **Auto-Sync**: Every time a student adds or drops a course, the system automatically recalculates their total outstanding credit fees in real-time.

### 2. Frontend: Admin Configuration
- **Batch Fee Management**: Created a new page [BatchFeeManagement.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/admin/BatchFeeManagement.jsx) where admins can set the registration fee for every batch (e.g., Batch 67 = 15,000 BDT, Batch 68 = 18,000 BDT).
- **Navigation**: Added "Batch Fee Config" to the Admin/Registrar sidebar under Academic Setup.

### 3. Frontend: Enhanced Registration Experience
- **Advisor Registration**:
    - Added a **Fee Breakdown** (Registration vs. Credit Fees) in the student header.
    - Added a prominent **Warning Banner** if the student hasn't paid their registration fee, explaining why registration is locked.
- **Student Portal**:
    - Updated [CourseRegistration.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/student/CourseRegistration.jsx) with a detailed fee status grid.
    - Students now see a clear instruction to pay their registration fee to unlock enrollment.

## Verification Results

### Fee enforcement logic:
1.  **Block Unpaid**: Confirmed that `registerCourse` throws an error if the student's `amountPaid` is less than the batch's `registrationFee`.
2.  **Dynamic Calculation**: Verified that enrolling in a 3-credit course adds `19,500 BDT` (3 * 6500) to the student's `amountDue`.
3.  **Drop Adjustment**: Verified that dropping a course correctly deducts the corresponding credit fee from the total dues.

## Pricing Parameters
> [!IMPORTANT]
> - **Cost per Credit**: Fixed at **6,500 BDT**.
> - **Registration Unlock**: Payment of the **Fixed Registration Fee** is required to start registration.
> - **Final Clearance**: Remaining credit fees must be paid before final exams (standard ERP policy).
