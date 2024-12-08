import { FormData } from '../GradeChecker';

type CoreSubjectsFormProps = FormData['coreSubjects'] & {
  updateFields: (fields: Partial<FormData>) => void;
}

const GRADES = [
  'A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'
] as const;

const CORE_SUBJECTS = [
  { id: 'english', label: 'English Language' },
  { id: 'mathematics', label: 'Core Mathematics' },
  { id: 'science', label: 'Integrated Science' },
  { id: 'social', label: 'Social Studies' }
] as const;

export default function CoreSubjectsForm({
  english,
  mathematics,
  science,
  social,
  updateFields
}: CoreSubjectsFormProps) {
  const handleGradeChange = (subject: keyof FormData['coreSubjects'], grade: string) => {
    updateFields({
      coreSubjects: {
        english,
        mathematics,
        science,
        social,
        [subject]: grade
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Core Subjects</h2>
        <p className="text-gray-600 mt-1">Enter your grades for core subjects</p>
      </div>

      <div className="space-y-4">
        {CORE_SUBJECTS.map(subject => (
          <div key={subject.id} className="grid grid-cols-[1fr,auto] gap-4 items-center">
            <label htmlFor={subject.id} className="text-sm font-medium text-gray-700">
              {subject.label}
            </label>
            <select
              id={subject.id}
              value={eval(subject.id)} // Safe here as we control the subject.id values
              onChange={e => handleGradeChange(subject.id, e.target.value)}
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

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900">Grade Guide</h3>
        <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-blue-800">
          <div>A1 - Excellent</div>
          <div>B2 - Very Good</div>
          <div>B3 - Good</div>
          <div>C4 - Credit</div>
          <div>C5 - Credit</div>
          <div>C6 - Credit</div>
          <div>D7 - Pass</div>
          <div>E8 - Pass</div>
          <div>F9 - Fail</div>
        </div>
      </div>
    </div>
  );
} 