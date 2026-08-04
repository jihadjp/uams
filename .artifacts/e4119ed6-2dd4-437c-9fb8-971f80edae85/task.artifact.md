# Tasks - Semester & Credit-based Fee Management

- [x] **Backend Implementation**
    - [x] Create `BatchSemesterFee` model and repository
    - [x] Update `Fee` model to include breakdown fields
    - [x] Update `FeeService` with sync and check logic
    - [x] Implement `syncSemesterFee` in `FeeServiceImpl`
    - [x] Integrate fee checks into `EnrollmentServiceImpl`
    - [x] Create/Update necessary DTOs and Controllers
- [x] **Frontend Implementation**
    - [x] Create Batch Fee Configuration page for Admins
    - [x] Update Advising & Student Registration pages with fee status/warnings
- [x] **Verification**
    - [x] Verify block when registration fee is unpaid
    - [x] Verify dynamic credit fee calculation on course add/drop
    - [x] Verify admin can set batch fees
