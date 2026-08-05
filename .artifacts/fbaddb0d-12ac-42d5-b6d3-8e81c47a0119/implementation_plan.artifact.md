# Implementation Plan - Fix Guardian Relation Save Issue

The user reported that the "Guardian Relation" (Specify Relation) is not being saved. Investigation revealed that the `guardianOtherRelation` field is missing from the profile data returned by the backend, causing it to be lost or not displayed in the frontend.

## User Review Required

> [!IMPORTANT]
> The fix involves adding the missing field to the profile retrieval logic and ensuring it's correctly updated during profile saves.

## Proposed Changes

### Backend

#### [MODIFY] [ProfileServiceImpl.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/ProfileServiceImpl.java)
- In `getMyProfile`, add `guardianOtherRelation` to the `studentData` map.
- In `updateProfile`, improve the logic for updating guardian information to be more robust and clear `otherRelation` if the relation is not `OTHER`.

## Verification Plan

### Manual Verification
1. Login as a student.
2. Go to the profile page.
3. Update Guardian Relation to "Other" and specify a relation (e.g., "Uncle").
4. Save changes and refresh the page.
5. Verify that "Other" and "Uncle" are still displayed correctly.
6. Change relation to "Father" and save.
7. Refresh and verify that "Father" is displayed and "Specify Relation" field is gone (and ideally cleared in DB).
