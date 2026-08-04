# Tasks - Reverting to Section-based Course Offerings

- [x] **Backend Implementation**
    - [x] Restore `section` field in `CourseOffering.java`
    - [x] Update `CourseOfferingRequest` and `CourseOfferingResponse` DTOs
    - [x] Update `CourseOfferingRepository` uniqueness checks
    - [x] Update `CourseOfferingServiceImpl` to handle sections
    - [x] Update `EnrollmentServiceImpl` and `ResultServiceImpl` mappings
- [x] **Frontend Implementation**
    - [x] Restore Section dropdown in `CourseOfferingForm.jsx`
    - [x] Restore Section column in `CourseOfferingList.jsx`
    - [x] Fix Advisor Registration logic
        - [x] Correct API path for section assignment
        - [x] Implement section-aware bulk registration
- [x] **Verification**
    - [x] Verify build and data fetching
    - [x] Verify section-based enrollment workflow
