import { ProspectiveFormData } from '../ProspectiveStudentChecker';
import { useProspectiveChecker } from '../ProspectiveCheckerContext';
import { CheckCircle, XCircle, AlertCircle, ArrowRight, ChevronDown, ChevronUp, Download, Printer } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useEffect, useState } from 'react';
import { QualificationResult, QualifiedProgram } from '../../../services/api/universityApi';

type ProspectiveResultsPageProps = {
  formData: ProspectiveFormData;
}

export default function ProspectiveResultsPage({ formData }: ProspectiveResultsPageProps) {
  const { resetForm } = useProspectiveChecker();
  const [result, setResult] = useState<QualificationResult | null>(null);
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
  const [showAllProgrammes, setShowAllProgrammes] = useState(false);
  const [expandedGrades, setExpandedGrades] = useState<Set<number>>(new Set());
  const INITIAL_PROGRAMMES_COUNT = 5;

  // Helper function to get unique schools count
  const getUniqueSchoolsCount = (programs: QualifiedProgram[]) => {
    const uniqueSchools = new Set(programs.map(p => p.school));
    return uniqueSchools.size;
  };

  // Helper function to get grade color
  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50';
    if (percentage >= 70) return 'text-blue-600 bg-blue-50';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-50';
    if (percentage >= 50) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  // Helper function to convert percentage to WASSCE grade
  const convertToWASSCEGrade = (percentage: number) => {
    if (percentage >= 80) return 'A1';
    if (percentage >= 75) return 'B2';
    if (percentage >= 70) return 'B3';
    if (percentage >= 65) return 'C4';
    if (percentage >= 60) return 'C5';
    if (percentage >= 55) return 'C6';
    if (percentage >= 50) return 'D7';
    if (percentage >= 45) return 'E8';
    return 'F9';
  };

  // Mock result data for demonstration
  useEffect(() => {
    const mockResult: QualificationResult = {
      check_code: 'MOCK-CHECK-001',
      school: formData.background.school?.name || 'Unknown School',
      country: formData.background.country?.name || 'Unknown Country',
      summary: {
        total_programs: 3,
        qualified_programs: 2,
        unqualified_programs: 1,
        unique_schools: 2,
        best_match: {
          program_name: formData.background.courseOffered,
          school_name: formData.background.school?.name || 'Unknown School',
          match_score: 85
        }
      },
      programs: [
        {
          id: '1',
          program_name: formData.background.courseOffered,
          school_name: formData.background.school?.name || 'Unknown School',
          qualified: true,
          match_score: 85,
          requirements: {
            core_subjects: [
              { subject: 'English Language', required_grade: 'C6', user_grade: convertToWASSCEGrade(formData.coreSubjects[1] || 0), met: true },
              { subject: 'Mathematics', required_grade: 'C6', user_grade: convertToWASSCEGrade(formData.coreSubjects[2] || 0), met: true },
              { subject: 'Integrated Science', required_grade: 'C6', user_grade: convertToWASSCEGrade(formData.coreSubjects[3] || 0), met: true }
            ],
            elective_subjects: [
              { subject: 'Physics', required_grade: 'C6', user_grade: convertToWASSCEGrade(formData.electiveGrades['Physics'] || 0), met: true },
              { subject: 'Chemistry', required_grade: 'C6', user_grade: convertToWASSCEGrade(formData.electiveGrades['Chemistry'] || 0), met: true }
            ],
            aggregate_score: 12,
            minimum_aggregate: 24
          },
          additional_info: {
            duration: '4 years',
            cut_off_points: 12,
            available_slots: 50,
            application_deadline: '2024-12-31'
          }
        },
        {
          id: '2',
          program_name: 'Computer Science',
          school_name: 'Another University',
          qualified: true,
          match_score: 75,
          requirements: {
            core_subjects: [
              { subject: 'English Language', required_grade: 'C6', user_grade: convertToWASSCEGrade(formData.coreSubjects[1] || 0), met: true },
              { subject: 'Mathematics', required_grade: 'C6', user_grade: convertToWASSCEGrade(formData.coreSubjects[2] || 0), met: true },
              { subject: 'Integrated Science', required_grade: 'C6', user_grade: convertToWASSCEGrade(formData.coreSubjects[3] || 0), met: true }
            ],
            elective_subjects: [
              { subject: 'Physics', required_grade: 'C6', user_grade: convertToWASSCEGrade(formData.electiveGrades['Physics'] || 0), met: true },
              { subject: 'Elective Mathematics', required_grade: 'C6', user_grade: convertToWASSCEGrade(formData.electiveGrades['Elective Mathematics'] || 0), met: true }
            ],
            aggregate_score: 15,
            minimum_aggregate: 24
          },
          additional_info: {
            duration: '4 years',
            cut_off_points: 15,
            available_slots: 30,
            application_deadline: '2024-12-31'
          }
        },
        {
          id: '3',
          program_name: 'Medicine',
          school_name: 'Medical University',
          qualified: false,
          match_score: 45,
          requirements: {
            core_subjects: [
              { subject: 'English Language', required_grade: 'B3', user_grade: convertToWASSCEGrade(formData.coreSubjects[1] || 0), met: false },
              { subject: 'Mathematics', required_grade: 'C6', user_grade: convertToWASSCEGrade(formData.coreSubjects[2] || 0), met: true },
              { subject: 'Integrated Science', required_grade: 'B3', user_grade: convertToWASSCEGrade(formData.coreSubjects[3] || 0), met: false }
            ],
            elective_subjects: [
              { subject: 'Biology', required_grade: 'B3', user_grade: convertToWASSCEGrade(formData.electiveGrades['Biology'] || 0), met: false },
              { subject: 'Chemistry', required_grade: 'B3', user_grade: convertToWASSCEGrade(formData.electiveGrades['Chemistry'] || 0), met: false }
            ],
            aggregate_score: 20,
            minimum_aggregate: 8
          },
          additional_info: {
            duration: '6 years',
            cut_off_points: 8,
            available_slots: 10,
            application_deadline: '2024-12-31'
          }
        }
      ]
    };
    setResult(mockResult);
  }, [formData]);

  if (!result) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your results...</p>
        </div>
      </div>
    );
  }

  const qualifiedPrograms = result.programs.filter(p => p.qualified);
  const unqualifiedPrograms = result.programs.filter(p => !p.qualified);
  const displayPrograms = showAllProgrammes ? qualifiedPrograms : qualifiedPrograms.slice(0, INITIAL_PROGRAMMES_COUNT);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Results</h2>
        <p className="text-gray-600">Check Code: {result.check_code}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{result.summary.total_programs}</div>
          <div className="text-sm text-gray-600">Total Programs</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">{result.summary.qualified_programs}</div>
          <div className="text-sm text-gray-600">Qualified Programs</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-red-600">{result.summary.unqualified_programs}</div>
          <div className="text-sm text-gray-600">Unqualified Programs</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-purple-600">{result.summary.unique_schools}</div>
          <div className="text-sm text-gray-600">Unique Schools</div>
        </div>
      </div>

      {/* Best Match */}
      {result.summary.best_match && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Best Match</h3>
              <p className="text-gray-600">{result.summary.best_match.program_name} at {result.summary.best_match.school_name}</p>
              <div className="mt-2 flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${result.summary.best_match.match_score}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">{result.summary.best_match.match_score}%</span>
              </div>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      )}

      {/* Qualified Programs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Qualified Programs</h3>
        {displayPrograms.map((program) => (
          <div key={program.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{program.program_name}</h4>
                  <p className="text-sm text-gray-600">{program.school_name}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${program.match_score}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-900">{program.match_score}%</span>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setExpandedProgram(expandedProgram === program.id ? null : program.id)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  {expandedProgram === program.id ? 'Hide Details' : 'View Details'}
                  {expandedProgram === program.id ? (
                    <ChevronUp className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </button>
              </div>

              {expandedProgram === program.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                  {/* Core Subjects */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Core Subjects</h5>
                    <div className="space-y-2">
                      {program.requirements.core_subjects.map((req, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{req.subject}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Required: {req.required_grade}</span>
                            <span className={`text-sm px-2 py-1 rounded-full ${getGradeColor(parseFloat(req.user_grade.replace(/[^0-9.]/g, '')))}`}>
                              Your Grade: {req.user_grade}
                            </span>
                            {req.met ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Elective Subjects */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Elective Subjects</h5>
                    <div className="space-y-2">
                      {program.requirements.elective_subjects.map((req, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{req.subject}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Required: {req.required_grade}</span>
                            <span className={`text-sm px-2 py-1 rounded-full ${getGradeColor(parseFloat(req.user_grade.replace(/[^0-9.]/g, '')))}`}>
                              Your Grade: {req.user_grade}
                            </span>
                            {req.met ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Program Information</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <span className="ml-2 text-gray-900">{program.additional_info.duration}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Cut-off Points:</span>
                        <span className="ml-2 text-gray-900">{program.additional_info.cut_off_points}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Available Slots:</span>
                        <span className="ml-2 text-gray-900">{program.additional_info.available_slots}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Deadline:</span>
                        <span className="ml-2 text-gray-900">{program.additional_info.application_deadline}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {qualifiedPrograms.length > INITIAL_PROGRAMMES_COUNT && !showAllProgrammes && (
          <div className="text-center">
            <button
              onClick={() => setShowAllProgrammes(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Show all {qualifiedPrograms.length} qualified programs
            </button>
          </div>
        )}
      </div>

      {/* Unqualified Programs */}
      {unqualifiedPrograms.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Unqualified Programs</h3>
          {unqualifiedPrograms.map((program) => (
            <div key={program.id} className="bg-white rounded-lg shadow-sm border border-gray-200 opacity-75">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{program.program_name}</h4>
                    <p className="text-sm text-gray-600">{program.school_name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ width: `${program.match_score}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900">{program.match_score}%</span>
                    </div>
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setExpandedProgram(expandedProgram === program.id ? null : program.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    {expandedProgram === program.id ? 'Hide Details' : 'View Details'}
                    {expandedProgram === program.id ? (
                      <ChevronUp className="h-4 w-4 ml-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </button>
                </div>

                {expandedProgram === program.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    {/* Core Subjects */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Core Subjects</h5>
                      <div className="space-y-2">
                        {program.requirements.core_subjects.map((req, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{req.subject}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">Required: {req.required_grade}</span>
                              <span className={`text-sm px-2 py-1 rounded-full ${getGradeColor(parseFloat(req.user_grade.replace(/[^0-9.]/g, '')))}`}>
                                Your Grade: {req.user_grade}
                              </span>
                              {req.met ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Elective Subjects */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Elective Subjects</h5>
                      <div className="space-y-2">
                        {program.requirements.elective_subjects.map((req, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{req.subject}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">Required: {req.required_grade}</span>
                              <span className={`text-sm px-2 py-1 rounded-full ${getGradeColor(parseFloat(req.user_grade.replace(/[^0-9.]/g, '')))}`}>
                                Your Grade: {req.user_grade}
                              </span>
                              {req.met ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={resetForm}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <ArrowRight className="h-4 w-4" />
          <span>Start New Check</span>
        </Button>
        <Button
          onClick={() => window.print()}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Printer className="h-4 w-4" />
          <span>Print Results</span>
        </Button>
      </div>
    </div>
  );
}
