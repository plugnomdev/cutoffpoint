import { FormData } from '../GradeChecker';
import { useChecker } from '../CheckerContext';

type ConfirmationFormProps = {
  formData: FormData;
  updateFields: (fields: Partial<FormData>) => void;
}

export default function ConfirmationForm({
  formData,
  updateFields
}: ConfirmationFormProps) {
  const handlePayment = async () => {
    // Here you would integrate with a payment provider
    // For demo purposes, we'll just simulate a successful payment
    console.log('Processing payment...');
    setTimeout(() => {
      updateFields({ paid: true });
    }, 1500);
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
              <dd className="text-sm font-medium text-gray-900">{formData.background.courseOffered}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Programme Level</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.background.programmeLevel}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Full Name</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.background.fullName}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Phone Number</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.background.phoneNumber}</dd>
            </div>
          </dl>
        </div>

        {/* Core Subjects */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-4">Core Subject Grades</h3>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">English Language</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.coreSubjects.english}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Core Mathematics</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.coreSubjects.mathematics}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Integrated Science</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.coreSubjects.science}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Social Studies</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.coreSubjects.social}</dd>
            </div>
          </dl>
        </div>

        {/* Elective Subjects */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-4">Elective Subject Grades</h3>
          <dl className="grid grid-cols-2 gap-4">
            {formData.selectedElectives.map(elective => (
              <div key={elective}>
                <dt className="text-sm text-gray-500">{elective}</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {formData.electiveGrades[elective]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Payment Section */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-blue-900">Payment Required</h3>
            <p className="text-sm text-blue-700">
              A fee of GHS 15.00 is required to view your results
            </p>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            GHS 15.00
          </div>
        </div>

        {formData.paid ? (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
            Payment successful! Click next to view your results.
          </div>
        ) : (
          <button
            type="button"
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Pay GHS 15.00
          </button>
        )}
      </div>

      <div className="text-sm text-gray-500">
        By proceeding with payment, you agree to our terms of service and privacy policy.
      </div>
    </div>
  );
} 