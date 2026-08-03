# Walkthrough - Editable Convocation Application

I have implemented an **Edit** feature for the Convocation Application system. This allows students to correct their graduation preferences (like gown size and guest count) after submission, provided their application hasn't been processed yet.

## Key Improvements

### 1. Flexible Application Management (Student)
- **Edit Functionality**: Students can now click a **Pencil icon** in the "My Application" table to modify their details.
- **Pending-Only Lock**: To maintain data integrity for logistics, applications are only editable while in the **PENDING** status. Once the status changes to Verified or Approved, the application is locked.
- **Smart Form Transition**: Clicking "Edit" automatically switches the view to the form tab and pre-fills all fields with the existing data.
- **Visual Indicators**: Added an alert banner in the form to clearly indicate when a student is in "Edit Mode".

### 2. Robust Backend Processing
- **Atomic Updates**: Added a dedicated `PUT` endpoint in the `ConvocationController` to handle student updates securely.
- **Validation Engine**: The service layer ensures that only the student who owns the application can edit it, and only if it is still Pending.
- **Data Sync**: The system continues to pull the latest **Calculated CGPA** and **Credits** even during the edit process to ensure records remain accurate.

### 3. UI/UX Polish
- **Dynamic Button States**: The primary action button now toggles between "Confirm & Apply" and "Update Application" based on the current mode.
- **Cancelation Support**: Students can easily exit edit mode without making changes by clicking the "Cancel" link in the header.

## Visual Changes Summary

| Area | Feature |
| :--- | :--- |
| **My Application Table** | New "Action" column with a Pencil icon for Pending requests. |
| **Application Form** | Dynamic Title (Edit vs. Apply) and specific "Edit Mode" notice. |
| **Logic** | Automatic state management between Create and Update workflows. |

## Verification Results

- ✅ **Edit Security**: Confirmed that attempting to edit a non-Pending application via API returns an error.
- ✅ **UI State Sync**: Verified that after updating, the table reflects the new gown size and guest count immediately.
- ✅ **Dynamic CGPA**: Confirmed that the CGPA remains system-calculated and read-only even during the edit flow.

> [!IMPORTANT]
> Once an administrator marks an application as **VERIFIED**, students can no longer change their gown size. Please double-check all details before the verification deadline.
