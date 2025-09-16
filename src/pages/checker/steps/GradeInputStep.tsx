import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Edit, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { FormData } from '../types';
import { useChecker } from '../CheckerContext';
import CombinedSubjectsForm from './CombinedSubjectsForm';
import { processImageFile, processPDFFile, ParsedDocumentData, matchSubjectsWithAI } from '../../../utils/documentProcessing';

interface GradeInputStepProps {
  formData: FormData;
  updateFields: (fields: Partial<FormData>) => void;
  onComplete: () => void;
}

type InputMethod = 'upload' | 'manual';

export default function GradeInputStep({ formData, updateFields, onComplete }: GradeInputStepProps) {
  const { coreSubjects, electiveSubjects } = useChecker();

  // Simple API endpoint logging
  console.log('📚 Core subjects loaded from: GET /subjects/by-type?type=1');
  console.log('📖 Elective subjects loaded from: GET /subjects/by-type?type=2');
  const [inputMethod, setInputMethod] = useState<InputMethod>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedDocumentData | null>(null);
  const [gradesConfirmed, setGradesConfirmed] = useState(false);
  const [matchedSubjects, setMatchedSubjects] = useState<Array<{ name: string; grade: string; matchedSubject?: any }>>([]);
  const [isMatching, setIsMatching] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setProcessingError(null);
      processFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
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
        console.log('Processing image file with Gemini Vision:', file.name, 'Size:', file.size, 'bytes');
        parsedData = await processImageFile(file);
        console.log('Gemini Vision response:', parsedData.rawText);
        console.log('Extracted subjects:', parsedData.extractedSubjects.length);
        console.log('Extracted subjects data:', parsedData.extractedSubjects);
        console.log('Student info:', parsedData.studentInfo);
      } else if (file.type === 'application/pdf') {
        console.log('Processing PDF file:', file.name);
        parsedData = await processPDFFile(file);
        console.log('PDF extracted text length:', parsedData.rawText.length);
        console.log('PDF extracted text preview:', parsedData.rawText.substring(0, 200));
        console.log('Extracted subjects:', parsedData.extractedSubjects.length);
        console.log('Extracted subjects data:', parsedData.extractedSubjects);
      } else {
        throw new Error('Unsupported file type');
      }

      setParsedData(parsedData);

      // Automatically apply AI matching
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
      console.error('File processing error:', error);
      setProcessingError(error instanceof Error ? error.message : 'Failed to process file');
    } finally {
      setProcessing(false);
    }
  };

  const applyMatching = async (data: ParsedDocumentData) => {
    setIsMatching(true);
    try {
      const matchedSubjects = await matchSubjectsWithAI(data.extractedSubjects, [...coreSubjects, ...electiveSubjects]);
      setMatchedSubjects(matchedSubjects);
    } catch (error) {
      console.error('AI matching failed:', error);
      // Fallback to basic matching
      const basicMatched = data.extractedSubjects.map(subject => ({
        ...subject,
        matchedSubject: undefined // No match found
      }));
      setMatchedSubjects(basicMatched);
    } finally {
      setIsMatching(false);
    }
  };

  const handleConfirmGrades = () => {
    if (!parsedData || matchedSubjects.length === 0) return;

    console.log('🎯 CONFIRM GRADES CLICKED - USING PREVIEW MATCHES');

    // Use the already-matched subjects from the preview (don't call AI again)
    const coreSubjectsMap: Record<number, string> = {};
    const electiveGrades: Record<string, string> = {};
    const selectedElectives: string[] = [];

    matchedSubjects.forEach((subject) => {
      console.log('🔍 Processing matched subject:', {
        extractedName: subject.name,
        grade: subject.grade,
        hasMatch: !!subject.matchedSubject,
        matchType: subject.matchedSubject?.type,
        matchName: subject.matchedSubject?.name,
        subjectId: subject.matchedSubject?.id
      });

      if (subject.matchedSubject) {
        if (subject.matchedSubject.type === 1) {
          // Core subject - use API subject ID
          coreSubjectsMap[subject.matchedSubject.id] = subject.grade;
          console.log('✅ Saved as CORE:', subject.matchedSubject.name, '=', subject.grade);
        } else if (subject.matchedSubject.type === 2) {
          // Elective subject - ALWAYS use API subject name as key (not extracted name)
          electiveGrades[subject.matchedSubject.name] = subject.grade;
          selectedElectives.push(subject.matchedSubject.name);
          console.log('✅ Saved as ELECTIVE:', subject.matchedSubject.name, '=', subject.grade);
        } else {
          // Type is undefined - check if it's an elective by ID range or name
          // Elective subjects typically have higher IDs or specific names
          const isLikelyElective = subject.matchedSubject.id > 10 ||
            subject.name.toLowerCase().includes('rel') ||
            subject.name.toLowerCase().includes('stud') ||
            ['economics', 'geography', 'government', 'christian', 'religious', 'islamic'].some(keyword =>
              subject.name.toLowerCase().includes(keyword)
            );

          if (isLikelyElective) {
            electiveGrades[subject.matchedSubject.name] = subject.grade;
            selectedElectives.push(subject.matchedSubject.name);
            console.log('✅ Saved as ELECTIVE (inferred):', subject.matchedSubject.name, '=', subject.grade);
          } else {
            // Default to core if unsure
            coreSubjectsMap[subject.matchedSubject.id] = subject.grade;
            console.log('✅ Saved as CORE (default):', subject.matchedSubject.name, '=', subject.grade);
          }
        }
      } else {
        // No match found - use extracted name as fallback elective
        console.warn(`⚠️ No API match found for extracted subject: "${subject.name}" - saving as elective`);
        if (selectedElectives.length < 4) { // Ensure we don't exceed elective limit
          electiveGrades[subject.name] = subject.grade;
          selectedElectives.push(subject.name);
          console.log('✅ Saved as ELECTIVE (fallback):', subject.name, '=', subject.grade);
        }
      }
    });

    console.log('💾 SAVING PREVIEW DATA:', {
      coreSubjectsMap,
      electiveGrades,
      selectedElectives,
      matchedSubjectsCount: matchedSubjects.length
    });

    updateFields({
      coreSubjects: coreSubjectsMap,
      electiveGrades,
      selectedElectives
    });

    setGradesConfirmed(true);
    console.log('✅ GRADES CONFIRMED - SHOULD NAVIGATE NOW');
  };

  const handleManualComplete = () => {
    // Check if required grades are filled
    const hasCoreGrades = Object.values(formData.coreSubjects).some(grade => grade);
    const hasElectives = formData.selectedElectives.length > 0 && Object.values(formData.electiveGrades).some(grade => grade);

    if (hasCoreGrades || hasElectives) {
      setGradesConfirmed(true);
      onComplete();
    }
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

        <div className="flex justify-end">
          <button
            onClick={onComplete}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Input Method Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setInputMethod('upload')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              inputMethod === 'upload'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-lg mr-2">🚀</span>
            AI Upload
          </button>
          <button
            onClick={() => setInputMethod('manual')}
            className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
              inputMethod === 'manual'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Edit className="w-4 h-4 mr-2" />
            Manual Entry
          </button>
        </div>
      </div>

      {inputMethod === 'upload' && (
        <div className="space-y-6">
          {/* Upload Area - Hide when processing is complete */}
          {!parsedData && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                {processing ? (
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs text-blue-600 font-bold">AI</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-3 font-medium text-center">
                      🤖 AI is analyzing your results...<br/>
                      <span className="text-sm text-gray-600">Extracting grades automatically</span>
                    </p>
                    <div className="mt-4 flex space-x-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                    <p className="text-gray-900 font-semibold text-lg">Upload Your Results</p>
                    <p className="text-gray-600 mt-1">AI will instantly extract your grades</p>
                    <p className="text-gray-500 text-sm mt-2">Drop your WASSCE results or click to browse</p>
                    <p className="text-gray-400 text-xs mt-1">JPG, PNG, PDF • Max 10MB</p>
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

          {/* Parsed Data Preview */}
          {parsedData && !processingError && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-base font-semibold text-blue-900 mb-4">Extracted Information</h3>

              {parsedData.studentInfo.name && (
                <div className="mb-4">
                  <span className="text-sm font-medium text-blue-800">Name: </span>
                  <span className="text-blue-900">{parsedData.studentInfo.name}</span>
                </div>
              )}

              <div className="mb-4">
                <span className="text-sm font-medium text-blue-800">Subjects Found: </span>
                <span className="text-blue-900">{parsedData.extractedSubjects.length}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-600">
                    {isMatching ? '🤖 Applying AI matching...' : '🤖 AI-matched subjects:'}
                  </div>
                  {isMatching && (
                    <div className="flex items-center text-xs text-blue-600">
                      <Loader className="w-3 h-3 mr-1 animate-spin" />
                      Processing...
                    </div>
                  )}
                </div>
                {matchedSubjects.map((subject, index) => {
                  // Use matched subject
                  const matchedSubject = subject.matchedSubject;
                  const subjectType = matchedSubject ? (matchedSubject.type === 1 ? 'Core' : 'Elective') : null;

                  return (
                    <div key={index} className="flex justify-between items-center bg-white p-2 rounded border">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{subject.name}</span>
                          {matchedSubject && (
                            <>
                              <span className="text-xs text-green-600">→</span>
                              <span className="text-sm text-green-700 font-medium">{matchedSubject.name}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                subjectType === 'Core' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                              }`}>
                                {subjectType}
                              </span>
                            </>
                          )}
                          {!matchedSubject && (
                            <span className="text-xs text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">
                              Not Matched
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-bold">
                        {subject.grade}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setParsedData(null);
                    setUploadedFile(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Upload Different File
                </button>
                <button
                  onClick={handleConfirmGrades}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
          <CombinedSubjectsForm
            coreSubjects={coreSubjects}
            {...formData.coreSubjects}
            updateFields={updateFields}
          />

          <div className="flex justify-end">
            <button
              onClick={handleManualComplete}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}