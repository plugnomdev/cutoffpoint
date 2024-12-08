import { FormData } from '../GradeChecker';
import { useChecker } from '../CheckerContext';

type ElectivesSelectionFormProps = {
  selectedElectives: string[];
  updateFields: (fields: Partial<FormData>) => void;
}

const ELECTIVES_BY_COURSE = {
  'General Arts': [
    'Literature in English',
    'Economics',
    'Government',
    'History',
    'Christian Religious Studies',
    'Islamic Religious Studies',
    'Geography',
    'French'
  ],
  'General Science': [
    'Physics',
    'Chemistry',
    'Biology',
    'Elective Mathematics',
    'ICT',
    'Further Mathematics'
  ],
  'Business': [
    'Financial Accounting',
    'Business Management',
    'Economics',
    'Cost Accounting',
    'ICT',
    'Elective Mathematics'
  ],
  'Visual Arts': [
    'Graphic Design',
    'Picture Making',
    'Ceramics',
    'Sculpture',
    'Textiles',
    'Leatherwork',
    'Economics',
    'Literature in English'
  ],
  'Home Economics': [
    'Management in Living',
    'Food and Nutrition',
    'Textiles',
    'Economics',
    'Chemistry',
    'Biology'
  ],
  'Agricultural Science': [
    'Crop Husbandry',
    'Animal Husbandry',
    'Economics',
    'Chemistry',
    'Biology',
    'Physics'
  ],
  'Technical': [
    'Technical Drawing',
    'Woodwork',
    'Metalwork',
    'Applied Electricity',
    'Electronics',
    'Auto Mechanics',
    'Physics',
    'Chemistry'
  ]
} as const;

export default function ElectivesSelectionForm({
  selectedElectives,
  updateFields
}: ElectivesSelectionFormProps) {
  const { formData } = useChecker();
  const course = formData.background.courseOffered;

  const toggleElective = (elective: string) => {
    let newElectives: string[];

    if (selectedElectives.includes(elective)) {
      newElectives = selectedElectives.filter(e => e !== elective);
    } else {
      if (selectedElectives.length >= 4) {
        return; // Maximum 4 electives
      }
      newElectives = [...selectedElectives, elective];
    }

    updateFields({ selectedElectives: newElectives });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Select Your Electives</h2>
        <p className="text-gray-600 mt-1">Choose between 2 and 4 elective subjects</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {ELECTIVES_BY_COURSE[course as keyof typeof ELECTIVES_BY_COURSE]?.map(elective => (
          <button
            key={elective}
            type="button"
            onClick={() => toggleElective(elective)}
            className={`p-4 text-left rounded-lg border-2 transition-all ${
              selectedElectives.includes(elective)
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            } ${
              selectedElectives.length >= 4 && !selectedElectives.includes(elective)
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            disabled={selectedElectives.length >= 4 && !selectedElectives.includes(elective)}
          >
            <div className="font-medium">{elective}</div>
          </button>
        ))}
      </div>

      {selectedElectives.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Electives:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedElectives.map(elective => (
              <div
                key={elective}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {elective}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedElectives.length < 2 && (
        <div className="text-amber-600 text-sm">
          Please select at least 2 elective subjects
        </div>
      )}
    </div>
  );
} 