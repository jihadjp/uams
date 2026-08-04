# Implementation Plan - Reverting to Section-based Course Offerings

The user correctly identified that "Batch-based" offerings fail when different sections of the same batch have different teachers for the same course. We will move to a professional approach where courses are offered per **Section**, and students are enrolled based on their assigned section.

## Proposed Changes

### Backend Changes

#### [MODIFY] [CourseOffering.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/model/CourseOffering.java)
- Restore `@ManyToOne @JoinColumn(name = "section_id") private Section section;`.

#### [MODIFY] [CourseOfferingRequest.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/dto/CourseOfferingRequest.java)
- Restore `private UUID sectionId;`.

#### [MODIFY] [CourseOfferingResponse.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/dto/CourseOfferingResponse.java)
- Restore `private UUID sectionId;` and `private String section;`.

#### [MODIFY] [CourseOfferingRepository.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/repository/CourseOfferingRepository.java)
- Restore uniqueness check with `sectionId`: `existsByCourseIdAndSemesterIdAndBatchIdAndSectionId`.

#### [MODIFY] [CourseOfferingServiceImpl.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/CourseOfferingServiceImpl.java)
- Update `createOffering`, `updateOffering`, and `mapToResponse` to handle the `section` field.

#### [MODIFY] [EnrollmentServiceImpl.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/EnrollmentServiceImpl.java)
- Update `mapToResponse` to use `offering.getSection().getName()`.

#### [MODIFY] [ResultServiceImpl.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/ResultServiceImpl.java)
- Update `mapToLiveResult` to use `offering.getSection().getName()`.

---

### Frontend Changes

#### [MODIFY] [AdvisorRegistration.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/faculty/AdvisorRegistration.jsx)
- **Fix API Path**: Change `/api/students/...` to `/students/...`.
- **Bulk Register Logic**: Update `handleBulkRegister` to only fetch and register offerings that match the student's assigned `sectionId`.
- **UI**: Re-add the "Section" badge/display in the available offerings cards.

#### [MODIFY] [CourseOfferingForm.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/admin/CourseOfferingForm.jsx)
- Re-add the **Section** selection dropdown.
- Ensure it filters sections based on the selected **Batch**.

#### [MODIFY] [CourseOfferingList.jsx](file:///E:/Project/DBMS/uams/frontend/src/pages/admin/CourseOfferingList.jsx)
- Re-add the **Section** column to the offerings table.

## Verification Plan

### Manual Verification
1.  **Planning**: Create two DBMS offerings for Batch 67: one for Section A (Teacher X) and one for Section B (Teacher Y).
2.  **Advising**:
    *   Open a student from Batch 67.
    *   Assign them to **Section A**.
    *   Click **"Register All Available"**.
    *   Verify they are enrolled in Teacher X's offering, NOT Teacher Y's.
3.  **Data Fetch**: Verify that the "Assign Section" call no longer fails (status 200).
