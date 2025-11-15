export const BRANCHES = [
  { label: "Computer Science & Engineering", value: "CSE" },
  { label: "Electronics & Communication", value: "ECE" },
  { label: "Mechanical Engineering", value: "MECH" },
  { label: "Civil Engineering", value: "CIVIL" },
  { label: "Electrical & Electronics", value: "EEE" },
  { label: "Artificial Intelligence", value: "AI" },
  { label: "Information Technology", value: "IT" },
];

export const YEARS = [
  { label: "First Year", value: 1 },
  { label: "Second Year", value: 2 },
  { label: "Third Year", value: 3 },
  { label: "Fourth Year", value: 4 },
];

export const SEMESTERS = [
  { label: "Semester 1", value: 1 },
  { label: "Semester 2", value: 2 },
  { label: "Semester 3", value: 3 },
  { label: "Semester 4", value: 4 },
  { label: "Semester 5", value: 5 },
  { label: "Semester 6", value: 6 },
  { label: "Semester 7", value: 7 },
  { label: "Semester 8", value: 8 },
];

export const ADMISSION_CATEGORIES = [
  { label: "CET Quota", value: "CET" },
  { label: "COMEDK", value: "COMEDK" },
  { label: "SNQ", value: "SNQ" },
  { label: "Management Quota", value: "MANAGEMENT" },
  { label: "SC Category", value: "SC" },
  { label: "ST Category", value: "ST" },
];

export const DOCUMENT_TYPES = [
  { label: "Passport Size Photo", value: "Photo", required: true },
  { label: "Aadhaar Card", value: "Aadhaar", required: true },
  { label: "10th Marks Card", value: "10th Marksheet", required: true },
  { label: "12th Marks Card", value: "12th Marksheet", required: true },
  { label: "Previous Semester Result", value: "PreviousSemResult" },
  { label: "Bonafide Certificate", value: "Bonafide" },
  { label: "Other Supporting Document", value: "Others" },
];

export const REQUIRED_DOCUMENT_TYPES = DOCUMENT_TYPES.filter((item) => item.required).map(
  (item) => item.value
);

