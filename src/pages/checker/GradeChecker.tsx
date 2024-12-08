import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import BackgroundForm from './steps/BackgroundForm';
import CoreSubjectsForm from './steps/CoreSubjectsForm';
import ElectivesSelectionForm from './steps/ElectivesSelectionForm';
import ElectiveGradesForm from './steps/ElectiveGradesForm';
import ConfirmationForm from './steps/ConfirmationForm';
import ResultsPage from './steps/ResultsPage';
import { CheckerProvider } from './CheckerContext';
import MainLayout from '../../components/layout/MainLayout';

export type FormData = {
  background: {
    courseOffered: string;
    certificateType: 'WASSCE';
    programmeLevel: 'Certificate' | 'Diploma' | 'Degree';
    fullName: string;
    phoneNumber: string;
    country: string;
    school: string;
  };
  coreSubjects: {
    english: string;
    mathematics: string;
    science: string;
    social: string;
  };
  selectedElectives: string[];
  electiveGrades: Record<string, string>;
  paid: boolean;
}

const INITIAL_DATA: FormData = {
  background: {
    courseOffered: '',
    certificateType: 'WASSCE',
    programmeLevel: 'Degree',
    fullName: '',
    phoneNumber: '',
    country: '',
    school: ''
  },
  coreSubjects: {
    english: '',
    mathematics: '',
    science: '',
    social: '',
  },
  selectedElectives: [],
  electiveGrades: {},
  paid: false,
}

export default function GradeChecker() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);

  const steps = [
    'Background',
    'Core Subjects',
    'Select Electives',
    'Elective Grades',
    'Confirmation',
    'Results'
  ];

  const updateFields = (fields: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const next = () => {
    setCurrentStep(c => c + 1);
  };

  const back = () => {
    setCurrentStep(c => c - 1);
  };

  const stepContent = [
    <BackgroundForm {...formData.background} updateFields={updateFields} />,
    <CoreSubjectsForm {...formData.coreSubjects} updateFields={updateFields} />,
    <ElectivesSelectionForm 
      selectedElectives={formData.selectedElectives} 
      updateFields={updateFields} 
    />,
    <ElectiveGradesForm 
      selectedElectives={formData.selectedElectives}
      electiveGrades={formData.electiveGrades}
      updateFields={updateFields}
    />,
    <ConfirmationForm formData={formData} updateFields={updateFields} />,
    <ResultsPage formData={formData} />
  ];

  return (
    <MainLayout>
      <CheckerProvider value={{ formData, updateFields }}>
        <div className="bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 py-16">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className={`flex-1 text-center text-sm ${
                      index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
              <div className="h-2 flex rounded-full bg-gray-200 overflow-hidden">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 ${
                      index <= currentStep ? 'bg-blue-600' : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <form onSubmit={e => e.preventDefault()}>
                {stepContent[currentStep]}

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={back}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </Button>
                  )}
                  {currentStep < steps.length - 1 && (
                    <Button
                      type="button"
                      onClick={next}
                      className="flex items-center gap-2 ml-auto"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </CheckerProvider>
    </MainLayout>
  );
} 