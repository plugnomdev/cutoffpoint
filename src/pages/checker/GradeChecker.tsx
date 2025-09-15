import { useState, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import BackgroundForm from './steps/BackgroundForm';
import CombinedSubjectsForm from './steps/CombinedSubjectsForm';
import ConfirmationForm from './steps/ConfirmationForm';
import ResultsPage from './steps/ResultsPage';
import { CheckerProvider } from './CheckerContext';
import MainLayout from '../../components/layout/MainLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchCountries, fetchSchoolsByCountry, fetchSubjectsByType, fetchGrades, Subject, Grade, completeGradeCheck, GradeCheckRequest } from '../../services/api/universityApi';
import { FormData } from './types';

const INITIAL_DATA: FormData = {
  background: {
    courseOffered: '',
    certificateType: 'WASSCE',
    programmeLevel: 'Degree',
    fullName: '',
    phoneNumber: '',
    country: null,
    school: null
  },
  coreSubjects: {},
  selectedElectives: [],
  electiveGrades: {},
  paid: false,
};

export default function GradeChecker() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [countries, setCountries] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [coreSubjects, setCoreSubjects] = useState<Subject[]>([]);
  const [electiveSubjects, setElectiveSubjects] = useState<Subject[]>([]);
  const [availableGrades, setAvailableGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const lastSavedDataRef = useRef<string>('');

  // Auto-save functionality
  const saveProgress = useCallback(() => {
    try {
      const dataString = JSON.stringify({
        formData,
        currentStep,
        timestamp: Date.now()
      });

      // Only save if data has actually changed
      if (dataString !== lastSavedDataRef.current) {
        localStorage.setItem('gradeCheckerProgress', dataString);
        lastSavedDataRef.current = dataString;
        setSaved(true);
      }
    } catch (error) {
      console.warn('Failed to save progress:', error);
    }
  }, [formData, currentStep]);

  const loadProgress = () => {
    try {
      const saved = localStorage.getItem('gradeCheckerProgress');
      if (saved) {
        const { formData: savedData, currentStep: savedStep, timestamp } = JSON.parse(saved);
        // Only load if saved within last 24 hours
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setFormData(savedData);
          setCurrentStep(savedStep);
          return true;
        }
      }
    } catch (error) {
      console.warn('Failed to load progress:', error);
    }
    return false;
  };

  // On mount, get country/school from navigation state if present
  useEffect(() => {
    if (location.state?.country && location.state?.school) {
      setFormData(prev => ({
        ...prev,
        background: {
          ...prev.background,
          country: location.state.country,
          school: location.state.school
        }
      }));
    }
  }, [location.state]);

  // Load saved progress on mount
  useEffect(() => {
    loadProgress();
  }, []);

  // Auto-save when form data changes
  useEffect(() => {
    if (Object.keys(formData.background).some(key => formData.background[key as keyof typeof formData.background])) {
      saveProgress();
    }
  }, [saveProgress]); // Only depend on the memoized saveProgress function

  // Hide saved indicator after 2 seconds
  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  // Fetch initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        // Parallel API calls for better performance - fetch both core and electives the same way
        const [
          countriesData,
          coreSubjectsData,
          electiveSubjectsData,
          gradesData
        ] = await Promise.all([
          fetchCountries(),
          fetchSubjectsByType(1), // Core subjects - same API as electives
          fetchSubjectsByType(2), // Elective subjects - same API as core
          fetchGrades()
        ]);

        setCountries(countriesData);
        setCoreSubjects(coreSubjectsData);
        setElectiveSubjects(electiveSubjectsData);
        setAvailableGrades(gradesData);

        // Initialize core subjects in form data with empty grades
        setFormData(prev => ({
          ...prev,
          coreSubjects: coreSubjectsData.reduce((acc, subject) => ({
            ...acc,
            [subject.id]: ''
          }), {})
        }));
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Fetch schools for selected country
  useEffect(() => {
    const loadSchools = async () => {
      if (formData.background.country?.id) {
        try {
          const schoolsData = await fetchSchoolsByCountry(formData.background.country.id);
          setSchools(schoolsData);
        } catch (error) {
          console.error('Failed to load schools:', error);
        }
      }
    };

    loadSchools();
  }, [formData.background.country]);

  const steps = [
    'Background',
    'Subject Grades',
    'Confirmation',
    'Payment',
    'Results'
  ];

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(step => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };

  const updateFields = (fields: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      ...fields,
      background: { ...prev.background, ...fields.background },
      coreSubjects: { ...prev.coreSubjects, ...fields.coreSubjects },
      electiveGrades: { ...prev.electiveGrades, ...fields.electiveGrades }
    }));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const resetForm = () => {
    setFormData(INITIAL_DATA);
    setCurrentStep(0);
    navigate('/checker');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center min-h-screen space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Loading Your Data</h3>
            <p className="text-sm text-gray-600">Preparing programme qualification check...</p>
            <div className="flex justify-center space-x-1 mt-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const contextValue = {
    formData,
    updateFields,
    goToStep,
    resetForm,
    coreSubjects,
    electiveSubjects,
    availableGrades
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Check WASSCE Cut-off Points for Various Programmes in Ghana and Africa - CutoffPoint.Africa</title>
        <meta name="title" content="Check WASSCE Cut-off Points for Various Programmes in Ghana and Africa - CutoffPoint.Africa" />
        <meta name="description" content="Add your grades and check the list of programmes you qualify for in Legon, UCC, KNUST, Nursing, and Teacher Training Colleges in Ghana." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cutoffpoint.africa/" />
        <meta property="og:title" content="Check WASSCE Cut-off Points for Various Programmes in Ghana and Africa - CutoffPoint.Africa" />
        <meta property="og:description" content="Add your grades and check the list of programmes you qualify for in Legon, UCC, KNUST, Nursing, and Teacher Training Colleges in Ghana." />
        <meta property="og:image" content="https://learninghana.com/wp-content/uploads/2022/09/cutoff-01.jpg" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://cutoffpoint.com.gh/" />
        <meta property="twitter:title" content="Find Best Programmes in Legon, KNUST, UCC and more - CutoffPoint.Africa" />
        <meta property="twitter:description" content="Add your grades and check the list of programmes you qualify for in Legon, UCC, KNUST, Nursing, and Teacher Training Colleges in Ghana." />
        <meta property="twitter:image" content="https://learninghana.com/wp-content/uploads/2022/09/cutoff-01.jpg" />
        <meta name="keywords" content="legon cutoff point, ucc cutoff point, knust cutoff point" />
      </Helmet>
      <CheckerProvider value={contextValue}>
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Progress Steps - Hidden as requested */}
          {false && (
            <nav aria-label="Progress" className="mb-8">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  {steps.map((step, index) => (
                    <div key={step} className="flex flex-col items-center flex-1">
                      <div
                        className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                          currentStep >= index
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                            : currentStep === index - 1
                            ? 'bg-indigo-100 border-indigo-400 text-indigo-700'
                            : 'bg-gray-100 border-gray-300 text-gray-400'
                        }`}
                      >
                        {currentStep > index ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <span className="text-sm font-bold">{index + 1}</span>
                        )}
                        {currentStep === index && (
                          <div className="absolute -inset-1 rounded-full border-2 border-blue-600 animate-pulse"></div>
                        )}
                      </div>
                      <span
                        className={`mt-2 text-xs font-medium text-center transition-colors duration-300 ${
                          currentStep >= index ? 'text-blue-600' : 'text-gray-500'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="relative mt-6">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${((currentStep + 1) / steps.length) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          currentStep >= index ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </nav>
          )}

          {/* Form Content */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            {/* Step-specific help */}
            <div className="mb-6 p-4 bg-[#2d3192]/5 rounded-lg border border-[#2d3192]/20">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-[#2d3192] rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">?</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#2d3192] mb-1">
                    {currentStep === 0 && "Enter your background information"}
                    {currentStep === 1 && "Select grades for core subjects and choose electives"}
                    {currentStep === 2 && "Review your information before payment"}
                    {currentStep === 3 && "Complete payment for qualification check"}
                    {currentStep === 4 && "View your programme qualification results"}
                  </h4>
                  <p className="text-xs text-[#2d3192]/80">
                    {currentStep === 0 && "This helps us determine your eligibility for programmes in your selected school."}
                    {currentStep === 1 && "Core subjects are mandatory. Choose 2-4 elective subjects and enter all your grades."}
                    {currentStep === 2 && "Review your information before proceeding to payment."}
                    {currentStep === 3 && "Complete payment to access your qualification results."}
                    {currentStep === 4 && "See which programmes you're qualified for based on your WASSCE grades."}
                  </p>
                </div>
              </div>
            </div>
            {currentStep === 0 && (
              <BackgroundForm
                countries={countries}
                schools={schools}
                {...formData.background}
                updateFields={updateFields}
              />
            )}
            
            {currentStep === 1 && (
              <CombinedSubjectsForm
                coreSubjects={coreSubjects}
                {...formData.coreSubjects}
                updateFields={updateFields}
              />
            )}

            {currentStep === 2 && (
              <ConfirmationForm
                formData={formData}
              />
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
                  <p className="text-gray-600 mt-1">Complete your payment to generate qualification results</p>
                </div>

                <div className="space-y-6">
                  {!paymentProcessing ? (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl border border-green-200">
                      <div className="text-center">
                        <div className="mb-6">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Pay</h3>
                          <p className="text-gray-600 mb-6">Click the button below to proceed to secure payment</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg border border-gray-200 inline-block mb-6">
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            GHS 12
                          </div>
                          <div className="text-sm text-gray-600">Programme Qualification Check</div>
                        </div>

                        <button
                          type="button"
                          onClick={async () => {
                            setPaymentProcessing(true);
                            try {
                              // Convert grade strings to numbers (A1=1, B2=2, etc.)
                              const gradeToNumber = (grade: string): number => {
                                const gradeMap: Record<string, number> = {
                                  'A1': 1, 'B2': 2, 'B3': 3, 'C4': 4, 'C5': 5, 'C6': 6, 'D7': 7, 'E8': 8, 'F9': 9
                                };
                                return gradeMap[grade] || 0;
                              };
    
                              // Create subject name to ID mapping
                              const subjectNameToId = (subjectName: string): number => {
                                // Find the subject by name in our loaded subjects
                                const subject = [...coreSubjects, ...electiveSubjects].find(s => s.name === subjectName);
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
    
                              // Map course to ID (simplified - would need proper course lookup)
                              const getCourseId = (_courseName: string): number => {
                                // This would need to be implemented with a course lookup
                                // For now, return a default
                                return 1;
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
    
                              // Prepare the grade check request data in the format the API expects
                              const gradeCheckRequest: GradeCheckRequest = {
                                code: `CHK${Date.now().toString().slice(-6)}`, // Generate a check code
                                school_id: formData.background.school?.id || 1,
                                cert_type_id: getCertificateTypeId(formData.background.certificateType),
                                programme_type_id: getProgramTypeId(formData.background.programmeLevel),
                                country_id: formData.background.country?.id || 1,
                                course_id: getCourseId(formData.background.courseOffered),
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
    
                              console.log('Grade Check Request:', gradeCheckRequest);
                              console.log('Core subjects mapping:', Object.entries(formData.coreSubjects).map(([id, grade]) => ({
                                id,
                                name: subjectIdToName(id),
                                grade
                              })));
    
                              // Call the grade check API
                              const response = await completeGradeCheck(gradeCheckRequest);
    
                              console.log('Grade Check Response:', response);
    
                              if (response.payment.payment_link) {
                                // Redirect to payment gateway
                                window.location.href = response.payment.payment_link;
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
                          }}
                          className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          Proceed to Payment Gateway
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-8 rounded-xl border border-gray-200">
                      <div className="text-center">
                        <div className="mb-6">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h3>
                          <p className="text-gray-600 mb-6">Please wait while we redirect you to our secure payment gateway...</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-700">Amount:</span>
                            <span className="text-lg font-bold text-gray-900">GHS 12.00</span>
                          </div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-700">Service:</span>
                            <span className="text-sm text-gray-600">Programme Qualification Check</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Status:</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Processing...
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 text-center">
                          <p className="text-xs text-gray-500">
                            You will be redirected to our secure payment partner
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 4 && <ResultsPage />}

            {/* Auto-save indicator */}
            {saved && (
              <div className="fixed top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg border border-green-200 z-50 animate-fade-in-up">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Progress saved</span>
                </div>
              </div>
            )}

            {/* Navigation Buttons - Ghana Inspired */}
            <div className="mt-8 flex justify-between items-center">
              <button
                type="button"
                onClick={prev}
                disabled={currentStep === 0}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 0
                    ? 'invisible'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>

              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Step {currentStep + 1} of {steps.length}
                </div>

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {currentStep === steps.length - 3 ? 'Review' : currentStep === steps.length - 2 ? 'Pay Now' : 'Continue'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200"
                  >
                    Start New Check
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CheckerProvider>
    </MainLayout>
  );
}
