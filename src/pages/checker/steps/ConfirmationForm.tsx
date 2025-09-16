import { FormData } from '../types';
import { useChecker } from '../CheckerContext';
import { useState } from 'react';
import { submitQualificationCheck, CheckRequest, createInitialOrder, InitialOrderRequest } from '../../../services/api/universityApi';
import { ChevronDown, ChevronUp } from 'lucide-react';

type ConfirmationFormProps = {
  formData: FormData;
  onPaymentComplete?: () => void;
  paymentCompleted?: boolean;
}

export default function ConfirmationForm({
  formData,
  onPaymentComplete,
  paymentCompleted = false
}: ConfirmationFormProps) {
  const { coreSubjects } = useChecker();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [gradesExpanded, setGradesExpanded] = useState(false);
  const [localPaymentCompleted, setLocalPaymentCompleted] = useState(paymentCompleted);

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

  const handlePayment = async () => {
    setPaymentProcessing(true);
    try {
      // Step 1: Create initial order to get a code
      const cleanPhone = formData.background.phoneNumber.replace(/\s+/g, ''); // Remove spaces
      // Convert Ghanaian local format to international format: +233XXXXXXXXX
      const formattedPhone = cleanPhone.startsWith('0') ? `+233${cleanPhone.slice(1)}` : `+233${cleanPhone}`;

      const initialRequest: InitialOrderRequest = {
        user_phone: formattedPhone,
        user_name: formData.background.fullName
      };

      console.log('Initial Order Request:', initialRequest);
      const initialResponse = await createInitialOrder(initialRequest);
      console.log('Initial Order Response:', initialResponse);

      const orderCode = initialResponse.code;

      // Step 2: Convert grade strings to numbers (A1=1, B2=2, etc.)
      const gradeToNumber = (grade: string): number => {
        const gradeMap: Record<string, number> = {
          'A1': 1, 'B2': 2, 'B3': 3, 'C4': 4, 'C5': 5, 'C6': 6, 'D7': 7, 'E8': 8, 'F9': 9
        };
        return gradeMap[grade] || 0;
      };

      // Create subject name to ID mapping
      const subjectNameToId = (subjectName: string): number => {
        // Find the subject by name in our loaded subjects
        const subject = coreSubjects.find(s => s.name === subjectName);
        return subject?.id || 1; // Default to 1 if not found
      };

      // Map certificate type to ID
      const getCertificateTypeId = (certType: string): number => {
        const certMap: Record<string, number> = {
          'WASSCE': 1,
          'SSSCE': 2,
          'GBCE': 3
        };
        return certMap[certType] || 1;
      };

      // Map program level to ID
      const getProgramTypeId = (programLevel: string): number => {
        const programMap: Record<string, number> = {
          'Certificate': 1,
          'Diploma': 2,
          'Degree': 3
        };
        return programMap[programLevel] || 3;
      };

      // Create subject ID to name mapping for core subjects
      const subjectIdToName = (subjectId: string): string => {
        const subject = coreSubjects.find(s => s.id.toString() === subjectId);
        if (subject) {
          // Convert common subject names to expected format
          const name = subject.name.toLowerCase();
          // Map common variations to expected names
          const nameMap: Record<string, string> = {
            'mathematics': 'math',
            'english language': 'english',
            'english': 'english',
            'science': 'science',
            'social studies': 'social',
            'social': 'social'
          };
          return nameMap[name] || name;
        }
        return subjectId;
      };

      // Step 3: Complete the check with the code from initial order
      const checkRequest = {
        code: orderCode,
        school_id: formData.background.school?.id || 1,
        cert_type_id: getCertificateTypeId(formData.background.certificateType),
        programme_type_id: getProgramTypeId(formData.background.programmeLevel),
        country_id: formData.background.country?.id || 1,
        course_id: 1, // Default course ID
        results: {
          core: Object.entries(formData.coreSubjects).reduce((acc, [subjectId, grade]) => {
            // Use subject name as key instead of ID
            const subjectName = subjectIdToName(subjectId);
            acc[subjectName] = gradeToNumber(grade);
            return acc;
          }, {} as Record<string, number>),
          electives: Object.entries(formData.electiveGrades).map(([subjectName, grade]) => ({
            subject_id: subjectNameToId(subjectName),
            grade: gradeToNumber(grade)
          }))
        }
      };

      console.log('Check Request:', checkRequest);

      // Call the check API
      const response = await submitQualificationCheck(checkRequest as any);

      console.log('Check Response:', response);

      if (response.data.payment_link) {
        // Set payment as completed locally
        setLocalPaymentCompleted(true);
        // Call parent callback to update navigation
        onPaymentComplete?.();
        // Redirect to payment gateway
        window.location.href = response.data.payment_link;
      } else {
        throw new Error('Failed to get payment link');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      setPaymentProcessing(false);
      // In a real app, you'd show an error message to the user
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to initiate payment: ${errorMessage}`);
    }
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

        {/* Collapsible Grades Section */}
        <div className="border-t">
          <button
            onClick={() => setGradesExpanded(!gradesExpanded)}
            className="w-full p-4 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
          >
            <h3 className="font-medium text-gray-900">Subject Grades</h3>
            {gradesExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          <div className={`transition-all duration-300 ease-in-out ${
            gradesExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            {/* Core Subjects */}
            <div className="p-4 border-t">
              <h4 className="font-medium text-gray-900 mb-3 text-sm">Core Subjects</h4>
              <div className="space-y-3">
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
              <div className="p-4 border-t">
                <h4 className="font-medium text-gray-900 mb-3 text-sm">Elective Subjects</h4>
                <div className="space-y-3">
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
        </div>
      </div>

      {/* Payment Section */}
      {localPaymentCompleted ? (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 text-sm mb-4">Your cut-off points are ready to view</p>
            <div className="bg-white p-3 rounded-lg border border-gray-200 inline-block">
              <div className="text-lg font-bold text-green-600">✓ Paid</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
          <div className="text-center">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Complete Payment</h3>
              <p className="text-gray-600 text-sm">Get instant access to programme cut-off points</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block mb-4 shadow-sm">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                GHS 12
              </div>
              <div className="text-sm text-gray-600">Programme Cut-off Checker</div>
            </div>

            {/* Paystack Payment Image */}
            <div className="mb-4">
              <img
                src="https://cutoffpoint.com.gh/site-assets/images/paystack.png"
                alt="Secure payment powered by Paystack"
                className="h-6 mx-auto opacity-80"
              />
            </div>

            {!paymentProcessing ? (
              <button
                onClick={handlePayment}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Make Payment
              </button>
            ) : (
              <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-2">
                    <svg className="animate-spin w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h4 className="text-base font-semibold text-gray-900 mb-1">Processing...</h4>
                  <p className="text-gray-600 text-xs">Redirecting to payment gateway</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
