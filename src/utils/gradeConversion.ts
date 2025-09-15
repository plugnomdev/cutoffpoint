// Grade conversion utility for prospective students
// Converts percentage scores to WASSCE grades

export interface GradeRange {
  grade: string;
  min: number;
  max: number;
  description: string;
}

export const WASSCE_GRADE_SCALE: GradeRange[] = [
  { grade: 'A1', min: 75, max: 100, description: 'Excellent' },
  { grade: 'B2', min: 70, max: 74, description: 'Very Good' },
  { grade: 'B3', min: 65, max: 69, description: 'Good' },
  { grade: 'C4', min: 60, max: 64, description: 'Credit' },
  { grade: 'C5', min: 55, max: 59, description: 'Credit' },
  { grade: 'C6', min: 50, max: 54, description: 'Credit' },
  { grade: 'D7', min: 45, max: 49, description: 'Pass' },
  { grade: 'E8', min: 40, max: 44, description: 'Pass' },
  { grade: 'F9', min: 0, max: 39, description: 'Fail' }
];

/**
 * Convert percentage score to WASSCE grade
 * @param percentage - Percentage score (0-100)
 * @returns WASSCE grade (A1, B2, etc.) or null if invalid
 */
export function percentageToWASSCEGrade(percentage: number): string | null {
  // Validate input
  if (percentage < 0 || percentage > 100 || !Number.isInteger(percentage)) {
    return null;
  }

  // Find the matching grade range
  const gradeRange = WASSCE_GRADE_SCALE.find(range =>
    percentage >= range.min && percentage <= range.max
  );

  return gradeRange ? gradeRange.grade : null;
}

/**
 * Get grade description for a percentage score
 * @param percentage - Percentage score (0-100)
 * @returns Grade description or null if invalid
 */
export function getGradeDescription(percentage: number): string | null {
  const grade = percentageToWASSCEGrade(percentage);
  if (!grade) return null;

  const gradeRange = WASSCE_GRADE_SCALE.find(range => range.grade === grade);
  return gradeRange ? gradeRange.description : null;
}

/**
 * Validate percentage input
 * @param percentage - Percentage score to validate
 * @returns true if valid, false otherwise
 */
export function isValidPercentage(percentage: number): boolean {
  return Number.isInteger(percentage) && percentage >= 0 && percentage <= 100;
}

/**
 * Get all available grade ranges for display
 * @returns Array of grade ranges
 */
export function getGradeRanges(): GradeRange[] {
  return WASSCE_GRADE_SCALE;
}

/**
 * Convert multiple percentage scores to WASSCE grades
 * @param percentages - Array of percentage scores
 * @returns Array of WASSCE grades
 */
export function convertMultipleGrades(percentages: number[]): (string | null)[] {
  return percentages.map(percentage => percentageToWASSCEGrade(percentage));
}