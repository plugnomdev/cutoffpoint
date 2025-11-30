import { FormData } from '../types';
import { useState, useEffect, useRef } from 'react';
import { submitQualificationCheck, createInitialOrder, InitialOrderRequest, Subject, fetchSubjectsByType } from '../../../services/api/universityApi';
import { ChevronDown, ChevronUp } from 'lucide-react';

type ConfirmationFormProps = {
  formData: FormData;
  electiveSubjects: Subject[];
}

export default function ConfirmationForm({
  formData,
  electiveSubjects: initialElectiveSubjects
}: ConfirmationFormProps) {
  const [electiveSubjects, setElectiveSubjects] = useState<Subject[]>(initialElectiveSubjects || []);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [gradesExpanded, setGradesExpanded] = useState(false);
  const hasFetchedRef = useRef(false); // Track if we've already fetched

  // Fetch elective subjects if not provided (only once on mount if needed)
  useEffect(() => {
    if (!hasFetchedRef.current && (!electiveSubjects || electiveSubjects.length === 0)) {
      console.log('Fetching elective subjects in ConfirmationForm...');
      hasFetchedRef.current = true; // Mark as fetched immediately to prevent duplicate calls
      fetchSubjectsByType(2)
        .then(subjects => {
          console.log('Fetched elective subjects:', subjects.length);
          setElectiveSubjects(subjects);
        })
        .catch(error => {
          console.error('Failed to fetch elective subjects:', error);
          hasFetchedRef.current = false; // Reset on error so it can retry
        });
    }
  }, []); // Empty dependency array - only run once on mount

  // Helper function to get subject name by ID - use exactly what was matched in step 1
  const getSubjectName = (id: number) => {
    const name = formData.coreSubjectNames?.[id] || `Subject ${id}`;
    return name.toLowerCase(); // Ensure lowercase for display
  };

  // Helper function to get elective subject display name from ID
  const getElectiveSubjectName = (subjectId: string) => {
    console.log('getElectiveSubjectName called with:', subjectId, 'electiveSubjects length:', electiveSubjects?.length);
    if (!electiveSubjects || electiveSubjects.length === 0) {
      console.warn('electiveSubjects not available in ConfirmationForm');
      return subjectId; // Return ID while subjects are loading
    }
    const subject = electiveSubjects.find((s: any) => s.id.toString() === subjectId);
    console.log('Found subject:', subject);
    return subject ? subject.name : subjectId;
  };

  const handlePayment = async () => {
    // Prevent duplicate submissions
    const lastSubmissionKey = 'lastCheckSubmission';
    const lastSubmission = localStorage.getItem(lastSubmissionKey);
    if (lastSubmission) {
      const { timestamp, phone } = JSON.parse(lastSubmission);
      const currentPhone = formData.background.phoneNumber.replace(/\s+/g, '');
      // If same phone number submitted within last 60 seconds, prevent duplicate
      if (phone === currentPhone && Date.now() - timestamp < 60000) {
        console.warn('Duplicate submission prevented - please wait before trying again');
        alert('Please wait a moment before submitting again.');
        return;
      }
    }

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

      // Step 3: Convert grade strings to numbers (A1=1, B2=2, etc.)
      const gradeToNumber = (grade: string): number => {
        const gradeMap: Record<string, number> = {
          'A1': 1, 'B2': 2, 'B3': 3, 'C4': 4, 'C5': 5, 'C6': 6, 'D7': 7, 'E8': 8, 'F9': 9
        };
        return gradeMap[grade] || 0;
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

      // Map program level to ID (matches backend API)
      const getProgramTypeId = (programLevel: string): number => {
        const programMap: Record<string, number> = {
          'Degree': 1,
          'Diploma': 2,
          'Certificate': 3
        };
        console.log('DEBUG: Mapping programmeLevel', programLevel, 'to ID', programMap[programLevel] || 1);
        return programMap[programLevel] || 1;
      };

      // Step 4: Complete the check with the code from initial order
      const checkRequest = {
        code: orderCode,
        school_id: formData.background.school?.id || 1,
        cert_type_id: getCertificateTypeId(formData.background.certificateType),
        programme_type_id: getProgramTypeId(formData.background.programmeLevel),
        country_id: formData.background.country?.id || 1,
        course_id: 1, // Default course ID
        results: {
          core: Object.entries(formData.coreSubjects).reduce((acc, [subjectId, grade]) => {
            // Use lowercase subject codes as keys (math, english, science, social)
            const subjectCode = (formData.coreSubjectNames?.[parseInt(subjectId)] || '').toLowerCase();
            acc[subjectCode] = gradeToNumber(grade);
            return acc;
          }, {} as Record<string, number>),
          electives: formData.selectedElectives
            .filter(subjectId => subjectId && subjectId.trim() !== '') // Only include non-empty subject IDs
            .map((subjectId, index) => {
              // Get the grade for this elective by finding it in electiveGrades
              // Since electiveGrades uses subject names as keys, we need to find the corresponding name
              const gradeKeys = Object.keys(formData.electiveGrades || {});
              const grade = gradeKeys[index] ? formData.electiveGrades[gradeKeys[index]] : '';
              console.log('Elective mapping:', { subjectId, index, gradeKeys, grade, gradeNumber: gradeToNumber(grade) });
              return {
                subject_id: parseInt(subjectId), // Use subject ID as number for electives
                grade: gradeToNumber(grade)
              };
            })
            .filter(item => {
              console.log('Filtering elective:', item);
              return !isNaN(item.subject_id) && item.subject_id > 0 && item.grade > 0;
            })
            .slice(0, 4) // Ensure only 4 electives are sent
        }
      };

      console.log('Check Request:', checkRequest);

      // Store submission timestamp to prevent duplicates
      localStorage.setItem(lastSubmissionKey, JSON.stringify({
        timestamp: Date.now(),
        phone: cleanPhone
      }));

      // Call the check API
      const response = await submitQualificationCheck(checkRequest as any);

      console.log('Check Response:', response);

      if (response.success && response.data) {
        // Store the qualification results for immediate display after payment
        localStorage.setItem('qualificationResult', JSON.stringify({
          check_code: response.data.check_code,
          school: response.data.school,
          country: response.data.country,
          summary: response.data.summary,
          qualified_programs: response.data.qualified_programs,
          total_qualified: response.data.total_qualified,
          payment: response.data.payment
        }));

        if (response.data.payment?.payment_link) {
          // Redirect to payment gateway immediately
          window.location.href = response.data.payment.payment_link;
        } else {
          console.error('API Response missing payment_link:', response);
          throw new Error('Payment link not provided by server');
        }
      } else {
        console.error('API Response unsuccessful:', response);
        throw new Error(response.message || 'Failed to process qualification check');
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
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Confirm Your Details</h2>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Review your information before proceeding to payment</p>
      </div>

      {/* Background Information */}
      <div className="border rounded-lg divide-y">
        <div className="p-3 sm:p-4">
          <h3 className="font-medium text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Background Information</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <dt className="text-xs sm:text-sm text-gray-500">Course Offered</dt>
              <dd className="text-xs sm:text-sm font-medium text-gray-900">{formData.background.courseOffered || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-xs sm:text-sm text-gray-500">Certificate Type</dt>
              <dd className="text-xs sm:text-sm font-medium text-gray-900">{formData.background.certificateType || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-xs sm:text-sm text-gray-500">Programme Level</dt>
              <dd className="text-xs sm:text-sm font-medium text-gray-900">{formData.background.programmeLevel}</dd>
            </div>
            <div>
              <dt className="text-xs sm:text-sm text-gray-500">Full Name</dt>
              <dd className="text-xs sm:text-sm font-medium text-gray-900">{formData.background.fullName || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-xs sm:text-sm text-gray-500">Phone Number</dt>
              <dd className="text-xs sm:text-sm font-medium text-gray-900">{formData.background.phoneNumber || 'Not provided'}</dd>
            </div>
          </dl>
        </div>

        {/* Collapsible Grades Section */}
        <div className="border-t">
          <button
            onClick={() => setGradesExpanded(!gradesExpanded)}
            className="w-full p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
          >
            <h3 className="font-medium text-gray-900 text-sm sm:text-base">Subject Grades</h3>
            {gradesExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          <div className={`transition-all duration-300 ease-in-out ${gradesExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
            {/* Core Subjects */}
            <div className="p-3 sm:p-4 border-t">
              <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded inline-block">Core Subjects</h4>
              <div className="space-y-2 sm:space-y-3">
                {Object.entries(formData.coreSubjects).map(([subjectId, grade]) => {
                  const subjectName = getSubjectName(Number(subjectId));
                  console.log('Core subject:', { subjectId, subjectName, grade });
                  return (
                    <div key={subjectId} className="flex justify-between items-center">
                      <span className="text-[10px] sm:text-xs font-medium text-gray-700 truncate">
                        {subjectName}
                      </span>
                      <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-800 rounded flex-shrink-0 ml-2">
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
                <div className="p-3 sm:p-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded inline-block">Elective Subjects</h4>
                  <div className="space-y-2 sm:space-y-3">
                    {formData.selectedElectives.map((subjectId, index) => {
                      const displayName = getElectiveSubjectName(subjectId);
                      // Get grade by subject name directly
                      const grade = displayName && formData.electiveGrades ? formData.electiveGrades[displayName] : '';

                      console.log('📋 Displaying elective:', { subjectId, displayName, grade, index });
                      return (
                        <div key={subjectId} className="flex justify-between items-center">
                          <span className="text-[10px] sm:text-xs font-medium text-gray-700 truncate">{displayName || subjectId}</span>
                          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-green-100 text-green-800 rounded flex-shrink-0 ml-2">
                            {grade || 'Not graded'}
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
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 sm:p-6 rounded-xl border border-green-200">
        <div className="text-center">
          <div className="mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Complete Payment</h3>
            <p className="text-gray-600 text-xs sm:text-sm">Get instant access to programme cut-off points</p>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 inline-block mb-3 sm:mb-4 shadow-sm">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              GHS 20
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Programme Cut-off Checker</div>
          </div>

          {/* Paystack Payment Image */}
          <div className="mb-4">
            <img
              src="https://cutoffpoint.com.gh/site-assets/images/paystack.png"
              alt="Secure payment powered by Paystack"
              className="h-6 mx-auto opacity-80"
            />
          </div>

          <button
            onClick={handlePayment}
            disabled={paymentProcessing}
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paymentProcessing ? (
              <>
                <svg className="animate-spin w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Pay & View Programmes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
