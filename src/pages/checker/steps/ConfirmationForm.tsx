import { FormData } from '../types';
import { useChecker } from '../CheckerContext';

type ConfirmationFormProps = {
  formData: FormData;
}

export default function ConfirmationForm({
  formData
}: ConfirmationFormProps) {
  const { coreSubjects } = useChecker();

  // Helper function to get subject name by ID
  const getSubjectName = (id: number) => {
    const subject = coreSubjects.find(s => s.id === id);
    if (subject) {
      return subject.name;
    }
    // Fallback: try to find subject by name mapping
    const nameMap: Record<number, string> = {
      1: 'Mathematics',
      2: 'English Language',
      3: 'Integrated Science',
      4: 'Social Studies'
    };
    return nameMap[id] || `Subject ${id}`;
  };

  // Helper function to get elective subject display name
  // Since we now save electives with proper API names, just return as-is
  const getElectiveSubjectName = (subjectKey: string) => {
    return subjectKey; // Already the proper API subject name
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Confirm Your Details</h2>
        <p className="text-gray-600 mt-1">Review your information before proceeding to payment</p>
      </div>

      {/* Background Information */}
      <div className="border rounded-lg divide-y">
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-4">Background Information</h3>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">Course Offered</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.background.courseOffered || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Programme Level</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.background.programmeLevel}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Full Name</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.background.fullName || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Phone Number</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.background.phoneNumber || 'Not provided'}</dd>
            </div>
          </dl>
        </div>

        {/* Core Subjects */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-4">Core Subjects</h3>
          <div className="space-y-4">
            {Object.entries(formData.coreSubjects).map(([subjectId, grade]) => {
              const id = Number(subjectId);
              const subjectName = getSubjectName(id);
              console.log('Core subject:', { subjectId, id, subjectName, grade });
              return (
                <div key={subjectId} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {subjectName}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {grade || 'Not selected'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Elective Subjects */}
        {(() => {
          console.log('🔍 CONFIRMATION PAGE - Elective check:', {
            selectedElectives: formData.selectedElectives,
            electiveGrades: formData.electiveGrades,
            selectedElectivesLength: formData.selectedElectives.length,
            electiveGradesKeys: Object.keys(formData.electiveGrades)
          });
          return formData.selectedElectives.length > 0;
        })() && (
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Elective Subjects</h3>
            <div className="space-y-4">
              {formData.selectedElectives.map((subject) => {
                const displayName = getElectiveSubjectName(subject);
                console.log('📋 Displaying elective:', { subject, displayName, grade: formData.electiveGrades[subject] });
                return (
                  <div key={subject} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{displayName}</span>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                      {formData.electiveGrades[subject] || 'Not graded'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Simple Price Display */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          GHS 12
        </div>
        <div className="text-sm text-gray-600">Service Fee</div>
      </div>
    </div>
  );
}
