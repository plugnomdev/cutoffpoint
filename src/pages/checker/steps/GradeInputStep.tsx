import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Edit, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { FormData } from '../types';
import { useChecker } from '../CheckerContext';
import CombinedSubjectsForm from './CombinedSubjectsForm';
import { processImageFile, ParsedDocumentData, matchSubjectsWithAI } from '../../../utils/documentProcessing';

interface GradeInputStepProps {
  formData: FormData;
  updateFields: (fields: Partial<FormData>) => void;
  onComplete: () => void;
}

type InputMethod = 'upload' | 'manual';

export default function GradeInputStep({ formData, updateFields, onComplete: _onComplete }: GradeInputStepProps) {
  const { coreSubjects, electiveSubjects } = useChecker();

  const [inputMethod, setInputMethod] = useState<InputMethod>(formData.gradeEntryMethod || 'manual');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedDocumentData | null>(null);
  const [gradesConfirmed, setGradesConfirmed] = useState(false);
  const [matchedSubjects, setMatchedSubjects] = useState<Array<{ name: string; grade: string; matchedSubject?: any }>>([]);
  const [isMatching, setIsMatching] = useState(false);
  
  // Combined loading state for smooth spinner experience
  const isLoading = processing || isMatching;
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Reset all states for new upload
      setUploadedFile(file);
      setProcessingError(null);
      setParsedData(null);
      setMatchedSubjects([]);
      setIsTransitioning(false);
      setShowResults(false);
      processFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const processFile = async (file: File) => {
    setProcessing(true);
    setProcessingError(null);

    try {
      let parsedData: ParsedDocumentData;

      if (file.type.startsWith('image/')) {
        parsedData = await processImageFile(file);
      } else {
        throw new Error('Only image files are supported. PDF processing has been disabled for cost optimization.');
      }

      setParsedData(parsedData);

      // Apply AI matching during the same processing step
      await applyMatching(parsedData);

      // Update form with extracted data if available
      const backgroundUpdates: any = {
        ...formData.background,
        country: formData.background.country || { id: 1, name: 'Ghana' } // Default to Ghana
      };

      if (parsedData.studentInfo.name) {
        backgroundUpdates.fullName = parsedData.studentInfo.name;
      }

      if (parsedData.studentInfo.certificateType) {
        backgroundUpdates.certificateType = parsedData.studentInfo.certificateType;
      }

      updateFields({
        background: backgroundUpdates
      });

    } catch (error) {
      setProcessingError(error instanceof Error ? error.message : 'Failed to process file');
    } finally {
      setProcessing(false);
    }
  };

  const applyMatching = async (data: ParsedDocumentData) => {
    setIsMatching(true);
    try {
      // Start transition to "Almost there" message after a short delay
      setTimeout(() => {
        if (isMatching) {
          setIsTransitioning(true);
        }
      }, 1000); // Start showing "Almost there" after 1 second
      
      const matchedSubjects = await matchSubjectsWithAI(data.extractedSubjects, [...coreSubjects, ...electiveSubjects]);
      setMatchedSubjects(matchedSubjects);
    } catch (error) {
      // Fallback to basic matching
      const basicMatched = data.extractedSubjects.map(subject => ({
        ...subject,
        matchedSubject: undefined // No match found
      }));
      setMatchedSubjects(basicMatched);
    } finally {
      setIsMatching(false);
      // Ensure transition state is set and then show results
      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
        setShowResults(true);
      }, 800); // Final transition duration
    }
  };

  const handleConfirmGrades = () => {
    if (!parsedData || matchedSubjects.length === 0) return;

    // Use the already-matched subjects from the preview (don't call AI again)
    const coreSubjectsMap: Record<number, string> = {};
    const coreSubjectNamesMap: Record<number, string> = {};
    const electiveGrades: Record<string, string> = {};
    const selectedElectives: string[] = [];

    matchedSubjects.forEach((subject) => {

      if (subject.matchedSubject) {
        // If the original extracted subject name contains 'elect', it's ALWAYS elective
        const isElectiveByOriginalName = subject.name.toLowerCase().includes('elect');
        
        if (isElectiveByOriginalName) {
          // Elective subject - use API subject name as key
          electiveGrades[subject.matchedSubject.name] = subject.grade;
          selectedElectives.push(subject.matchedSubject.name);
        } else if (subject.matchedSubject.type === 1) {
          // Core subject - use API subject ID and save subject name
          coreSubjectsMap[subject.matchedSubject.id] = subject.grade;
          coreSubjectNamesMap[subject.matchedSubject.id] = subject.matchedSubject.name;
        } else if (subject.matchedSubject.type === 2) {
          // Elective subject - use API subject name as key
          electiveGrades[subject.matchedSubject.name] = subject.grade;
          selectedElectives.push(subject.matchedSubject.name);
        } else {
          // Type is undefined - check if it's an elective by ID range or name
          const isLikelyElective = subject.matchedSubject.id > 10 ||
            subject.name.toLowerCase().includes('rel') ||
            subject.name.toLowerCase().includes('stud') ||
            ['economics', 'geography', 'government', 'christian', 'religious', 'islamic'].some(keyword =>
              subject.name.toLowerCase().includes(keyword)
            );

          if (isLikelyElective) {
            electiveGrades[subject.matchedSubject.name] = subject.grade;
            selectedElectives.push(subject.matchedSubject.name);
          } else {
            // Default to core if unsure
            coreSubjectsMap[subject.matchedSubject.id] = subject.grade;
            coreSubjectNamesMap[subject.matchedSubject.id] = subject.matchedSubject.name;
          }
        }
      } else {
        // No match found - use extracted name as fallback elective
        if (selectedElectives.length < 4) { // Ensure we don't exceed elective limit
          electiveGrades[subject.name] = subject.grade;
          selectedElectives.push(subject.name);
        }
      }
    });

    // Store subject codes for core subjects and subject IDs for electives
    const coreSubjectCodes: Record<number, string> = {};
    Object.entries(coreSubjectNamesMap).forEach(([id, name]) => {
      // Get subject code from core subjects API
      const subject = coreSubjects.find(s => s.id === parseInt(id));
      coreSubjectCodes[parseInt(id)] = subject?.subject_code || name;
    });

    const electiveIds = selectedElectives.map(name => {
      // Get subject ID from elective subjects API
      const subject = electiveSubjects.find(s => s.name === name);
      return subject ? subject.id.toString() : name;
    });

    updateFields({
      coreSubjects: coreSubjectsMap,
      coreSubjectNames: coreSubjectCodes, // Store subject codes for core
      electiveGrades,
      selectedElectives: electiveIds // Store subject IDs for electives
    });

    setGradesConfirmed(true);
  };

  if (gradesConfirmed && inputMethod === 'upload') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Grades Confirmed</h2>
          <p className="text-gray-600 mt-2">Your grades have been successfully processed</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Ready to proceed to background information</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Input Method Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
          <button
            onClick={() => {
              setInputMethod('manual');
              // Clear upload data when switching to manual mode
              updateFields({
                coreSubjects: {},
                coreSubjectNames: {},
                electiveGrades: {},
                selectedElectives: [],
                gradeEntryMethod: 'manual'
              });
            }}
            className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
              inputMethod === 'manual'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Edit className="w-4 h-4 mr-2" />
            Manual Entry
          </button>
          <button
            onClick={() => setInputMethod('upload')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              inputMethod === 'upload'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-lg mr-2">🚀</span>
            Upload Results
          </button>
        </div>
      </div>

      {inputMethod === 'upload' && (
        <div className="space-y-6">
          {/* Upload Area - Hide when showing results */}
          {!showResults && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                {(isLoading || isTransitioning) && !showResults ? (
                  <div className={`flex flex-col items-center transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                    <div className="relative">
                      <Loader className={`w-8 h-8 text-blue-600 ${isLoading ? 'animate-spin' : 'animate-pulse'}`} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs text-blue-600 font-bold">AI</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-3 font-medium text-center">
                      {isLoading && !isTransitioning ? (
                        <>
                          🤖 AI is processing your results...<br/>
                          <span className="text-sm text-gray-600">Extracting & matching grades automatically</span>
                        </>
                      ) : (
                        <>
                          ✨ Almost there...<br/>
                          <span className="text-sm text-gray-600">Preparing your matched results</span>
                        </>
                      )}
                    </p>
                    <div className="mt-4 flex space-x-1">
                      <div className={`w-2 h-2 bg-blue-600 rounded-full ${isLoading ? 'animate-bounce' : 'animate-pulse'}`}></div>
                      <div className={`w-2 h-2 bg-blue-600 rounded-full ${isLoading ? 'animate-bounce' : 'animate-pulse'}`} style={{ animationDelay: '0.1s' }}></div>
                      <div className={`w-2 h-2 bg-blue-600 rounded-full ${isLoading ? 'animate-bounce' : 'animate-pulse'}`} style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                ) : uploadedFile ? (
                  <div className="flex flex-col items-center">
                    <FileText className="w-8 h-8 text-green-600" />
                    <p className="text-gray-900 font-medium">{uploadedFile.name}</p>
                    <p className="text-gray-600 text-sm">Click to upload a different file</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl">📄</span>
                    </div>
                    <p className="text-gray-900 font-semibold text-base sm:text-lg">Upload Your Results</p>
                    <p className="text-gray-600 text-sm sm:text-base mt-1">AI will instantly extract your grades</p>
                    <p className="text-gray-500 text-xs sm:text-sm mt-2">Drop your WASSCE results or click to browse</p>
                    <p className="text-gray-400 text-xs mt-1">JPG, PNG • Max 10MB</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Processing Error */}
          {processingError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-medium">Processing failed</span>
              </div>
              <p className="text-red-700 text-sm mt-1">{processingError}</p>
              <button
                onClick={() => setInputMethod('manual')}
                className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
              >
                Try manual input instead
              </button>
            </div>
          )}

          {/* Parsed Data Preview - Show after smooth transition */}
          {showResults && !processingError && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-blue-900 mb-3 sm:mb-4">Your Grades</h3>

              {parsedData?.studentInfo.name && (
                <div className="mb-4">
                  <span className="text-sm font-medium text-blue-800">Name: </span>
                  <span className="text-blue-900">{parsedData.studentInfo.name}</span>
                </div>
              )}

              <div className="mb-4">
                <span className="text-sm font-medium text-blue-800">Subjects Found: </span>
                <span className="text-blue-900">{matchedSubjects.length}</span>
              </div>

              <div className="space-y-2">
                {matchedSubjects.map((subject, index) => {
                  // Use matched subject name if available, otherwise use extracted name
                  const displayName = subject.matchedSubject ? subject.matchedSubject.name : subject.name;
                  const subjectType = subject.matchedSubject ? (subject.matchedSubject.type === 1 ? 'Core' : 'Elective') : null;

                  return (
                    <div key={index} className="flex justify-between items-center bg-white p-2 sm:p-3 rounded border">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <span className="font-medium text-sm sm:text-base truncate">{displayName}</span>
                          {subjectType && (
                            <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${
                              subjectType === 'Core' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                            }`}>
                              {subjectType}
                            </span>
                          )}
                          {!subject.matchedSubject && (
                            <span className="text-xs text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded flex-shrink-0">
                              Not Matched
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs sm:text-sm font-bold flex-shrink-0 ml-2">
                        {subject.grade}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0">
                <button
                  onClick={() => {
                    setParsedData(null);
                    setUploadedFile(null);
                    setMatchedSubjects([]);
                    setIsTransitioning(false);
                    setShowResults(false);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
                >
                  Upload Different File
                </button>
                <button
                  onClick={handleConfirmGrades}
                  className="flex items-center justify-center px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Grades
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {inputMethod === 'manual' && (
        <div className="space-y-6">
          {/* Always show manual form when inputMethod is manual */}
          <CombinedSubjectsForm
            coreSubjects={coreSubjects}
            {...formData.coreSubjects}
            updateFields={updateFields}
          />
        </div>
      )}
    </div>
  );
}