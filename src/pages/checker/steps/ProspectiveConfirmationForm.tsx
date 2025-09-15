import { ProspectiveFormData } from '../ProspectiveStudentChecker';
import { useProspectiveChecker } from '../ProspectiveCheckerContext';

type ProspectiveConfirmationFormProps = {
  formData: ProspectiveFormData;
  onSubmit: () => void;
}

export default function ProspectiveConfirmationForm({
  formData,
  onSubmit
}: ProspectiveConfirmationFormProps) {
  const { coreSubjects, electiveSubjects } = useProspectiveChecker();

  // Helper function to transform core subjects to API format
  const transformCoreSubjects = (coreSubjectsData: Record<number, number>) => {
    const result: Record<string, number> = {};
    Object.entries(coreSubjectsData).forEach(([subjectId, grade]) => {
      result[subjectId] = grade;
    });
    return result;
  };

  // Helper function to transform elective subjects to API format
  const transformElectiveSubjects = (electiveSubjectsData: Record<string, number>) => {
    const result: Record<string, number> = {};
    Object.entries(electiveSubjectsData).forEach(([subjectName, grade]) => {
      result[subjectName] = grade;
    });
    return result;
  };

  const transformedCoreSubjects = transformCoreSubjects(formData.coreSubjects);
  const transformedElectiveSubjects = transformElectiveSubjects(formData.electiveGrades);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Your Information</h2>
        <p className="text-gray-600">Please review your details before submitting</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <p className="mt-1 text-sm text-gray-900">{formData.background.fullName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <p className="mt-1 text-sm text-gray-900">{formData.background.phoneNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <p className="mt-1 text-sm text-gray-900">{formData.background.country?.name || 'Not selected'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">School</label>
            <p className="mt-1 text-sm text-gray-900">{formData.background.school?.name || 'Not selected'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Course</label>
            <p className="mt-1 text-sm text-gray-900">{formData.background.courseOffered}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Program Level</label>
            <p className="mt-1 text-sm text-gray-900">{formData.background.programmeLevel}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Subjects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coreSubjects.map((subject) => (
            <div key={subject.id} className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{subject.name}</span>
              <span className="text-sm text-gray-900">{formData.coreSubjects[subject.id]}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Elective Subjects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.selectedElectives.map((subjectName) => (
            <div key={subjectName} className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{subjectName}</span>
              <span className="text-sm text-gray-900">{formData.electiveGrades[subjectName]}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onSubmit}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Submit Application
        </button>
      </div>
    </div>
  );
}
