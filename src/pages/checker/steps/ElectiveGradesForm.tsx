import { FormData } from '../GradeChecker';
import { useChecker } from '../CheckerContext';

type ElectiveGradesFormProps = {
  selectedElectives: string[];
  electiveGrades: Record<string, string>;
  updateFields: (fields: Partial<FormData>) => void;
}

const GRADES = [
  'A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'
] as const;

export default function ElectiveGradesForm({
  selectedElectives,
  electiveGrades,
  updateFields
}: ElectiveGradesFormProps) {
  const handleGradeChange = (elective: string, grade: string) => {
    updateFields({
      electiveGrades: {
        ...electiveGrades,
        [elective]: grade
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Enter Elective Grades</h2>
        <p className="text-gray-600 mt-1">Input your grades for each elective subject</p>
      </div>

      <div className="space-y-4">
        {selectedElectives.map(elective => (
          <div key={elective} className="grid grid-cols-[1fr,auto] gap-4 items-center">
            <label htmlFor={elective} className="text-sm font-medium text-gray-700">
              {elective}
            </label>
            <select
              id={elective}
              value={electiveGrades[elective] || ''}
              onChange={e => handleGradeChange(elective, e.target.value)}
              className="w-32 p-3 border rounded-lg"
              required
            >
              <option value="">Grade</option>
              {GRADES.map(grade => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Grade Guide */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900">Grade Guide</h3>
        <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-blue-800">
          <div>A1 - Excellent (1)</div>
          <div>B2 - Very Good (2)</div>
          <div>B3 - Good (3)</div>
          <div>C4 - Credit (4)</div>
          <div>C5 - Credit (5)</div>
          <div>C6 - Credit (6)</div>
          <div>D7 - Pass (7)</div>
          <div>E8 - Pass (8)</div>
          <div>F9 - Fail (9)</div>
        </div>
      </div>

      {/* Summary */}
      {Object.keys(electiveGrades).length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Grade Summary</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(electiveGrades).map(([subject, grade]) => (
              <div key={subject} className="flex justify-between">
                <span className="text-gray-600">{subject}:</span>
                <span className="font-medium text-gray-900">{grade}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 