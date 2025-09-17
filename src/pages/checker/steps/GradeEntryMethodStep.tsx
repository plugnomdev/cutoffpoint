import { useState } from 'react';
import { Upload, Edit3 } from 'lucide-react';
import { useChecker } from '../CheckerContext';

type GradeEntryMethodStepProps = {
  onComplete: () => void;
};

export default function GradeEntryMethodStep({ onComplete }: GradeEntryMethodStepProps) {
  const { updateFields } = useChecker();
  const [selectedMethod, setSelectedMethod] = useState<'manual' | 'upload' | null>(null);

  const handleMethodSelect = (method: 'manual' | 'upload') => {
    setSelectedMethod(method);
    
    // Store the selected method in form data
    updateFields({
      gradeEntryMethod: method
    });

    // Move to next step after a brief delay for better UX
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div>
      {/* Method Selection */}
      <div className="flex flex-col items-center">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Upload Method Card */}
          <button
            onClick={() => handleMethodSelect('upload')}
            className={`group relative p-6 rounded-xl border-2 transition-all duration-300 text-left w-full sm:w-64 ${
              selectedMethod === 'upload'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-400 bg-white'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                selectedMethod === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
              }`}>
                <Upload className="w-6 h-6" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Upload Results
                </h3>
                <p className="text-sm text-gray-600">
                  Screenshot, image or PDF
                </p>
              </div>
            </div>
            
            {selectedMethod === 'upload' && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            )}
          </button>

          {/* OR Separator */}
          <span className="text-lg text-gray-500 font-medium">OR</span>

          {/* Manual Method Card */}
          <button
            onClick={() => handleMethodSelect('manual')}
            className={`group relative p-6 rounded-xl border-2 transition-all duration-300 text-left w-full sm:w-64 ${
              selectedMethod === 'manual'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-400 bg-white'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                selectedMethod === 'manual'
                  ? 'bg-blue-600 text-white'
                  : 'bg-green-100 text-green-600 group-hover:bg-blue-600 group-hover:text-white'
              }`}>
                <Edit3 className="w-6 h-6" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Enter Manually
                </h3>
                <p className="text-sm text-gray-600">
                  Select grades for each subject
                </p>
              </div>
            </div>
            
            {selectedMethod === 'manual' && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
