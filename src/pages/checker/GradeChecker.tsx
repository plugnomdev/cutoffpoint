import { useState, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import BackgroundForm from './steps/BackgroundForm';
import GradeInputStep from './steps/GradeInputStep';
import GradeEntryMethodStep from './steps/GradeEntryMethodStep';
import ConfirmationForm from './steps/ConfirmationForm';
import ResultsPage from './steps/ResultsPage';
import { CheckerProvider } from './CheckerContext';
import MainLayout from '../../components/layout/MainLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchCountries, fetchSchoolsByCountry, fetchSubjectsByType, fetchGrades, Subject, Grade } from '../../services/api/universityApi';
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
  coreSubjectNames: {},
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

        // Load subjects using proper API endpoints as per documentation
        console.log('Loading core subjects (type=1)...');
        const coreSubjectsData = await fetchSubjectsByType(1);
        console.log('Core subjects loaded:', coreSubjectsData);

        console.log('Loading elective subjects (type=2)...');
        const electiveSubjectsData = await fetchSubjectsByType(2);
        console.log('Elective subjects loaded:', electiveSubjectsData);

        const [
          countriesData,
          gradesData
        ] = await Promise.all([
          fetchCountries(),
          fetchGrades()
        ]);

        setCountries(countriesData);
        setCoreSubjects(coreSubjectsData);
        setElectiveSubjects(electiveSubjectsData);
        setAvailableGrades(gradesData);

        // Initialize core subjects in form data with empty grades
        setFormData(prev => ({
          ...prev,
          coreSubjects: coreSubjectsData.reduce((acc: Record<number, string>, subject: Subject) => ({
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
    'Grade Input',
    'Background',
    'Review & Payment',
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
        <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
                    {currentStep === 0 && "Enter your WASSCE grades"}
                    {currentStep === 1 && (formData.background.fullName ? `Hello ${formData.background.fullName.split(' ')[0]}, kindly share more info below` : "Enter your background information")}
                    {currentStep === 2 && "Review your details and complete payment"}
                    {currentStep === 3 && "View your programme qualification results"}
                  </h4>
                  <p className="text-xs text-[#2d3192]/80">
                    {currentStep === 0 && "Add your grades for Core and Elective subjects to check your eligibility."}
                    {currentStep === 1 && "This helps us determine your eligibility for programmes in your selected school."}
                    {currentStep === 2 && "Review your information and complete secure payment to get your results."}
                    {currentStep === 3 && "See which programmes you're qualified for based on your WASSCE grades."}
                  </p>
                </div>
              </div>
            </div>
            {currentStep === 0 && (
              <GradeInputStep
                formData={formData}
                updateFields={updateFields}
                onComplete={next}
              />
            )}

            {currentStep === 1 && (
              <BackgroundForm
                countries={countries}
                schools={schools}
                {...formData.background}
                updateFields={updateFields}
                extractedName={formData.background.fullName} // Will be set by GradeInputStep
                extractedCertificateType={formData.background.certificateType} // Will be set by GradeInputStep
                extractedCourseOffered={formData.background.courseOffered} // Will be set by GradeInputStep
              />
            )}

            {currentStep === 2 && (
              <ConfirmationForm
                formData={formData}
                electiveSubjects={electiveSubjects}
              />
            )}

            {currentStep === 3 && <ResultsPage />}

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
            <div className="mt-6 sm:mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={prev}
                disabled={currentStep === 0}
                className={`flex items-center justify-center px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 0
                    ? 'invisible'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline ml-2 text-sm sm:text-base">Back</span>
              </button>

              <div className="text-sm text-gray-500 text-center px-2">
                Step {currentStep + 1} of {steps.length}
              </div>

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  disabled={currentStep === 2}
                  className={`flex items-center justify-center px-3 sm:px-8 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 shadow-lg transform hover:scale-105 ${
                    currentStep === 2
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-60'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <span className="text-xs sm:text-sm">Continue</span>
                  <ArrowRight className="w-4 h-4 ml-1 sm:ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center justify-center px-3 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200"
                >
                  <span className="text-xs sm:text-sm">Start New Check</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </CheckerProvider>
    </MainLayout>
  );
}

