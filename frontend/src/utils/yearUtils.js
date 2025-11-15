export function getYearLabel(year) {
  switch (Number(year)) {
    case 1:
      return "First Year";
    case 2:
      return "Second Year";
    case 3:
      return "Third Year";
    case 4:
      return "Fourth Year";
    default:
      return "Year";
  }
}

export function getSemesterLabel(sem) {
  return `Semester ${sem}`;
}

