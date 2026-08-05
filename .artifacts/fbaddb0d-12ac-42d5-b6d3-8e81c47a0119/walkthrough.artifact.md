# Walkthrough - Fixed Guardian Relation Save Issue

I have fixed the issue where the "Specify Relation" (Guardian Other Relation) was not being saved or displayed correctly in the user profile.

## Changes Made

### Backend

#### [ProfileServiceImpl.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/ProfileServiceImpl.java)
- **Profile Loading**: Added `guardianOtherRelation` to the data returned in `getMyProfile`. Previously, this field was missing, causing the frontend to load an empty value even if it was stored in the database.
- **Profile Update**: Improved the guardian update logic:
    - It now correctly sets `guardianOtherRelation` when the relation is `OTHER`.
    - It automatically clears the `otherRelation` field if the user switches to a standard relation (like FATHER or MOTHER), keeping the database clean.
    - Added better error handling for invalid relation values.

## Verification Results

### Manual Verification
- Verified that `guardianOtherRelation` is now correctly returned from the `/api/profile/me` endpoint.
- Verified that updating the profile with a custom relation (e.g., "Uncle" with relation "OTHER") persists correctly in the database.
- Verified that switching back to a standard relation clears the custom relation field.
