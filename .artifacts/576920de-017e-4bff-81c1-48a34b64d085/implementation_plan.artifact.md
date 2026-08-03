# Implementation Plan - Enhanced Error Handling for Data Entry

This plan introduces descriptive error messages that guide administrators on the correct sequence of data entry. Instead of generic "Not Found" or "Null" exceptions, the system will explicitly state what missing records need to be created first.

## User Review Required

> [!IMPORTANT]
> - **Dependency Awareness**: The backend will now check if required tables are empty before processing specific requests.
> - **Helpful Messages**: Messages will look like: "Please create at least one Program before registering a student."

## Proposed Changes

### 1. Backend Service Enhancements

I will update the following services to include "pre-flight" dependency checks:

#### [MODIFY] [StudentServiceImpl.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/StudentServiceImpl.java)
- Check `programRepository.count()`: If 0, throw "No programs found. Please create a Program first."
- Check `batchRepository.count()`: If 0, throw "No batches found. Please create a Batch for the selected program first."

#### [MODIFY] [FacultyServiceImpl.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/FacultyServiceImpl.java)
- Check `departmentRepository.count()`: If 0, throw "Please create a Department before adding faculty."

#### [MODIFY] [BatchServiceImpl.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/BatchServiceImpl.java)
- Check `programRepository.count()`: If 0, throw "Please create a Program before defining batches."

#### [MODIFY] [CourseOfferingServiceImpl.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/service/impl/CourseOfferingServiceImpl.java)
- Check `courseRepository.count()`: If 0, throw "Please create Courses before planning offerings."
- Check `semesterRepository.count()`: If 0, throw "Please initialize a Semester before planning offerings."
- Check `facultyRepository.count()`: If 0, throw "Please add Faculty members before assigning them to courses."

### 2. Global Exception Handler

#### [MODIFY] [GlobalExceptionHandler.java](file:///E:/Project/DBMS/uams/backend/src/main/java/com/metamorph_x/uams/exception/GlobalExceptionHandler.java)
- Ensure that `IllegalArgumentException` and custom `DependencyMissingException` (or similar) are caught and return a 400 Bad Request with the custom message clearly visible.

## Verification Plan

### Manual Verification
1. Clear the database (or start with a fresh one).
2. Attempt to create a **Student**.
3. Verify the error message: "No programs found. Please create a Program first."
4. Create a **Department**.
5. Attempt to create a **Program**.
6. Verify it works.
7. Attempt to create a **Student** without a Batch.
8. Verify the error message: "No batches found...".
9. Repeat for **Course Offerings** and other entities.
