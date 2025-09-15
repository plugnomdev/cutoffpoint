import { FormData } from '../GradeChecker';
import { useChecker } from '../CheckerContext';

type ElectivesSelectionFormProps = {
  selectedElectives: string[];
  updateFields: (fields: Partial<FormData>) => void;
}


export default function ElectivesSelectionForm({
  selectedElectives,
  updateFields
}: ElectivesSelectionFormProps) {
  const { formData, electiveSubjects } = useChecker();
  const course = formData.background.courseOffered;

  const toggleElective = (elective: string) => {
    let newElectives: string[];

    if (selectedElectives.includes(elective)) {
      newElectives = selectedElectives.filter(e => e !== elective);
    } else {
      // Allow up to 4 electives as per API requirement
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
        {electiveSubjects
          .filter(subject => {
            // TODO: Implement course-based filtering
            // This should filter electives based on the selected courseOffered
            // For now, showing all electives - update this based on API structure
            return true;
          })
          .map(subject => (
            <button
              key={subject.id}
              type="button"
              onClick={() => toggleElective(subject.name)}
              className={`p-4 text-left rounded-lg border-2 transition-all ${
                selectedElectives.includes(subject.name)
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              } ${
                selectedElectives.length >= 4 && !selectedElectives.includes(subject.name)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              disabled={selectedElectives.length >= 4 && !selectedElectives.includes(subject.name)}
            >
              <div className="font-medium">{subject.name}</div>
              <div className="text-sm text-gray-500">{subject.subject_code}</div>
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