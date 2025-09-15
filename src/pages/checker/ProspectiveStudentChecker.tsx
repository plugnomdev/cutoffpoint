import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Button from '../../components/ui/Button';
import PercentageGradeForm from './steps/PercentageGradeForm';
import ProspectiveConfirmationForm from './steps/ProspectiveConfirmationForm';
import ProspectiveResultsPage from './steps/ProspectiveResultsPage';
import { ProspectiveCheckerProvider } from './ProspectiveCheckerContext';
import MainLayout from '../../components/layout/MainLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchSubjectsByType, fetchGrades, Subject, Grade, Country, School } from '../../services/api/universityApi';

export type ProspectiveFormData = {
  background: {
    courseOffered: string;
    certificateType: string;
    programmeLevel: 'Certificate' | 'Diploma' | 'Degree';
    fullName: string;
    phoneNumber: string;
    country: Country | null;
    school: School | null;
  };
  coreSubjects: Record<number, number>; // subject_id -> percentage (0-100)
  selectedElectives: string[];
  electiveGrades: Record<string, number>; // subject_name -> percentage (0-100)
  paid: boolean;
}

const INITIAL_DATA: ProspectiveFormData = {
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

export default function ProspectiveStudentChecker() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ProspectiveFormData>(INITIAL_DATA);
  const [coreSubjects, setCoreSubjects] = useState<Subject[]>([]);
  const [electiveSubjects, setElectiveSubjects] = useState<Subject[]>([]);
  const [availableGrades, setAvailableGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        // Parallel API calls for better performance
        const [
          coreSubjectsData,
          electiveSubjectsData,
          gradesData
        ] = await Promise.all([
          fetchSubjectsByType(1), // Core subjects
          fetchSubjectsByType(2), // Elective subjects
          fetchGrades()
        ]);

        setCoreSubjects(coreSubjectsData);
        setElectiveSubjects(electiveSubjectsData);
        setAvailableGrades(gradesData);

        // Initialize core subjects in form data with empty percentages
        setFormData(prev => ({
          ...prev,
          coreSubjects: coreSubjectsData.reduce((acc, subject) => ({
            ...acc,
            [subject.id]: 0
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


  const steps = [
    'Enter Grades',
    'Confirmation',
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

  const updateFields = (fields: Partial<ProspectiveFormData>) => {
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
    navigate('/prospective-checker');
  };


  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
      <ProspectiveCheckerProvider value={contextValue}>
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <nav aria-label="Progress" className="mb-16">
            <ol className="flex items-center justify-center">
              {steps.map((step, index) => (
                <li key={step} className={`flex-1 ${index !== steps.length - 1 ? 'pr-4 sm:pr-8' : ''} relative max-w-xs`}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-300 ${
                        currentStep > index
                          ? 'bg-green-500 border-green-500 text-white shadow-lg'
                          : currentStep === index
                          ? 'bg-[#2d3192] border-[#2d3192] text-white shadow-lg animate-pulse'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      {currentStep > index ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={`mt-3 text-sm font-semibold text-center transition-colors ${
                        currentStep >= index ? 'text-[#2d3192]' : 'text-gray-500'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="absolute top-6 left-12 right-0 h-1 -z-10 bg-gray-200 rounded">
                      <div
                        className={`h-full rounded transition-all duration-500 ${
                          currentStep > index ? 'bg-[#2d3192]' : 'bg-gray-200'
                        }`}
                        style={{
                          width: currentStep > index ? '100%' : currentStep === index ? '50%' : '0%',
                        }}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Form Content */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            {currentStep === 0 && (
              <PercentageGradeForm
                updateFields={updateFields}
              />
            )}

            {currentStep === 1 && (
              <ProspectiveConfirmationForm
                formData={formData}
                onSubmit={next}
              />
            )}

            {currentStep === 2 && <ProspectiveResultsPage formData={formData} />}

            {/* Navigation Buttons */}
            <div className="mt-12 flex justify-between items-center">
              <Button
                type="button"
                onClick={prev}
                disabled={currentStep === 0}
                variant="outline"
                className={`px-6 py-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 ${
                  currentStep === 0 ? 'invisible' : ''
                }`}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={next}
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  {currentStep === steps.length - 2 ? 'Submit Grades' : 'Next Step'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Start New Check
                </Button>
              )}
            </div>
          </div>
        </div>
      </ProspectiveCheckerProvider>
    </MainLayout>
  );
}