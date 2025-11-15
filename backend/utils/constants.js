// backend/utils/constants.js

// Roles
export const ROLES = Object.freeze({
  ADMIN: "admin",
  STUDENT: "student",
});

// Fee Types
export const FEE_TYPES = Object.freeze({
  ACADEMIC: "Academic",
  EXAM: "Exam",
  BACKLOG: "Backlog",
  OTHER: "Other",
});

// Admission Statuses
export const ADMISSION_STATUS = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
});

// Notification Messages (commonly used)
export const NOTIFICATION_MESSAGES = Object.freeze({
  ADMISSION_APPROVED: "Your admission has been approved!",
  ADMISSION_REJECTED: "Your admission has been rejected.",
  PAYMENT_SUCCESS: "Your payment was successful!",
  DOCUMENT_VERIFIED: "Your document has been verified.",
});

// Student document requirements
export const DOCUMENT_TYPE_VALUES = Object.freeze([
  "Photo",
  "Aadhaar",
  "10th Marksheet",
  "12th Marksheet",
  "PreviousSemResult",
  "Bonafide",
  "Others",
]);

export const REQUIRED_DOCUMENT_TYPES = Object.freeze([
  "Photo",
  "Aadhaar",
  "10th Marksheet",
  "12th Marksheet",
]);