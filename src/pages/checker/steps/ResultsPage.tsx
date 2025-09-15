import { useChecker } from '../CheckerContext';
import { CheckCircle, XCircle, ArrowRight, ChevronDown, Download, Printer } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useEffect, useState } from 'react';
import { QualificationResult } from '../../../services/api/universityApi';

type ResultsPageProps = Record<string, never>;

export default function ResultsPage(_props: ResultsPageProps) {
  const { resetForm } = useChecker();
  const [result, setResult] = useState<QualificationResult | null>(null);
  const [showAllProgrammes, setShowAllProgrammes] = useState(false);
  const [expandedGrades, setExpandedGrades] = useState<Set<number>>(new Set());
  const INITIAL_PROGRAMMES_COUNT = 5;


  // Helper function to get programmes grouped by school
  const getProgrammesBySchool = (programmes: QualificationResult['qualified_programs']): Array<{ school: string; count: number }> => {
    const schoolMap = new Map<string, number>();

    programmes.forEach(() => {
      const schoolName = result?.school.name || 'Unknown';
      schoolMap.set(schoolName, (schoolMap.get(schoolName) || 0) + 1);
    });

    return Array.from(schoolMap.entries()).map(([school, count]) => ({ school, count }));
  };

  useEffect(() => {
    // Check for results from payment callback or stored results
    const urlParams = new URLSearchParams(window.location.search);
    const checkCode = urlParams.get('check_code');
    const status = urlParams.get('status');

    if (checkCode && status === 'success') {
      // Payment was successful, fetch results using the check code
      console.log('Payment successful, check code:', checkCode);
      // In a real implementation, you would call an API to get results by check code
      // For now, we'll show a success message
      setResult({
        check_code: checkCode,
        school: { id: 1, name: 'School Name' },
        country: { id: 1, name: 'Country', code: 'GHA', flag: '🇬🇭' },
        summary: {
          core_grades: [],
          elective_grades: [],
          core_score: 0,
          elective_score: 0,
          total_score: 0
        },
        qualified_programs: [],
        total_qualified: 0,
        payment: { amount: 12, currency: 'GHS', payment_link: '' }
      });
    } else if (status === 'failed') {
      // Payment failed
      console.log('Payment failed');
      // Show error message
    } else {
      // Check for stored results (fallback)
      const storedResult = localStorage.getItem('qualificationResult');
      if (storedResult) {
        try {
          const parsedResult = JSON.parse(storedResult);
          setResult(parsedResult);
          localStorage.removeItem('qualificationResult');
        } catch (error) {
          console.error('Failed to parse stored result:', error);
        }
      } else {
        console.log('No results available - payment not completed');
      }
    }
  }, []);


  const handlePrint = () => {
    window.print();
  };


  // Removed multi-step functionality - show all results at once

  const toggleGradeDetails = (programId: number) => {
    const newExpanded = new Set(expandedGrades);
    if (newExpanded.has(programId)) {
      newExpanded.delete(programId);
    } else {
      newExpanded.add(programId);
    }
    setExpandedGrades(newExpanded);
  };

  const handleSaveAsPDF = async () => {
    if (!result) return;

    try {
      const currentDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Programme Qualification Results - ${selectedInstitution}</title>
              <style>
                @page {
                  margin: 1in;
                  size: A4;
                }

                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  margin: 0;
                  padding: 0;
                  background: white;
                }

                .header {
                  background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
                  color: white;
                  padding: 30px 20px;
                  text-align: center;
                  border-radius: 12px;
                  margin-bottom: 30px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .header h1 {
                  margin: 0 0 10px 0;
                  font-size: 28px;
                  font-weight: 700;
                }

                .header p {
                  margin: 0;
                  font-size: 16px;
                  opacity: 0.9;
                }

                .student-info {
                  background: #f8fafc;
                  border: 1px solid #e2e8f0;
                  border-radius: 8px;
                  padding: 20px;
                  margin-bottom: 25px;
                }

                .student-info h2 {
                  margin: 0 0 15px 0;
                  color: #1e293b;
                  font-size: 20px;
                  font-weight: 600;
                }

                .info-grid {
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                  gap: 15px;
                }

                .info-item {
                  background: white;
                  padding: 15px;
                  border-radius: 6px;
                  border: 1px solid #e2e8f0;
                  text-align: center;
                }

                .info-label {
                  font-size: 12px;
                  color: #64748b;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  margin-bottom: 5px;
                }

                .info-value {
                  font-size: 24px;
                  font-weight: 700;
                  color: #1e293b;
                }

                .programs-section {
                  margin-bottom: 30px;
                }

                .programs-section h2 {
                  color: #1e293b;
                  font-size: 22px;
                  font-weight: 600;
                  margin-bottom: 20px;
                  border-bottom: 2px solid #e2e8f0;
                  padding-bottom: 10px;
                }

                .program-card {
                  background: white;
                  border: 1px solid #e2e8f0;
                  border-radius: 8px;
                  padding: 20px;
                  margin-bottom: 15px;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                  break-inside: avoid;
                }

                .program-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  margin-bottom: 12px;
                }

                .program-title {
                  font-size: 18px;
                  font-weight: 600;
                  color: #1e293b;
                  margin: 0;
                }

                .program-meta {
                  font-size: 14px;
                  color: #64748b;
                  margin: 2px 0;
                }

                .cutoff-badge {
                  background: #fef3c7;
                  color: #92400e;
                  padding: 4px 8px;
                  border-radius: 4px;
                  font-size: 12px;
                  font-weight: 600;
                  display: inline-block;
                  margin-top: 8px;
                }

                .eligibility-status {
                  display: inline-flex;
                  align-items: center;
                  padding: 6px 12px;
                  border-radius: 6px;
                  font-size: 12px;
                  font-weight: 600;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                }

                .eligible {
                  background: #d1fae5;
                  color: #065f46;
                }

                .footer {
                  margin-top: 40px;
                  padding-top: 20px;
                  border-top: 1px solid #e2e8f0;
                  text-align: center;
                  font-size: 12px;
                  color: #64748b;
                }

                .footer p {
                  margin: 5px 0;
                }

                @media print {
                  body { print-color-adjust: exact; }
                  .program-card { page-break-inside: avoid; }
                  .header { break-after: avoid; }
                  .student-info { break-after: avoid; }
                }
              </style>
            </head>
            <body>
              <!-- Header -->
              <div class="header">
                <h1>🎓 Programme Qualification Results</h1>
                <p>Generated on ${currentDate} • ${selectedInstitution}</p>
              </div>

              <!-- Student Information -->
              <div class="student-info">
                <h2>📊 Academic Summary</h2>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Total Aggregate</div>
                    <div class="info-value">${result.summary.total_score}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Core Score</div>
                    <div class="info-value">${result.summary.core_score}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Elective Score</div>
                    <div class="info-value">${result.summary.elective_score}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Qualified Programs</div>
                    <div class="info-value">${result.total_qualified}</div>
                  </div>
                </div>
              </div>

              <!-- Programs Section -->
              <div class="programs-section">
                <h2>🎯 Qualified Programs</h2>
                ${result.qualified_programs.map(program => `
                  <div class="program-card">
                    <div class="program-header">
                      <div>
                        <h3 class="program-title">${program.name}</h3>
                        <p class="program-meta">${selectedInstitution}</p>
                        <div class="cutoff-badge">Cutoff: ${program.max_grade}</div>
                      </div>
                      <div class="eligibility-status eligible">
                        ✓ Eligible
                      </div>
                    </div>
                    <p class="program-meta">Your Score: ${result.summary.total_score} | Cutoff: ${program.max_grade}</p>
                  </div>
                `).join('')}
              </div>

              <!-- Footer -->
              <div class="footer">
                <p><strong>Cut-off Point Calculator</strong> • Generated on ${currentDate}</p>
                <p>This document serves as proof of program qualification for ${selectedInstitution}</p>
                <p>For official admission, please contact the university directly</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to print
      handlePrint();
    }
  };


  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Results</h3>
          <p className="text-gray-600 mb-4">We're retrieving your qualification results from our secure servers.</p>
          <p className="text-sm text-gray-500 mb-6">If you were redirected here after payment, your results should appear shortly. If not, please check your payment status.</p>
          <div className="space-y-3">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Payment initiated successfully
            </div>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-4"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedInstitution = result.school.name;

  // Single comprehensive results view - no multi-step

  return (
    <div id="results-content" className="max-w-6xl mx-auto space-y-8">
      {/* Custom animations for load more */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 sm:p-8 rounded-xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">🎓 Programme Cut-off</h1>
        <p className="text-blue-100 text-sm sm:text-base">Here are the programmes you qualify for in {selectedInstitution}</p>
      </div>


      {/* Qualified Programs */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Programs You Qualify For</h2>
          <div className="text-sm text-gray-600">
            {result.total_qualified} program{result.total_qualified !== 1 ? 's' : ''} in {selectedInstitution}
          </div>
        </div>

        {(!result.qualified_programs || result.qualified_programs.length === 0) ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Programs Found</h3>
            <p className="text-gray-600 mb-4">We couldn't find any programs matching your current grades.</p>
            <p className="text-sm text-gray-500">Try improving your grades or selecting different electives to see more options.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {result.qualified_programs
              .sort((a, b) => {
                const studentScore = result.summary.total_score;
                const aDiff = Math.abs(a.max_grade - studentScore);
                const bDiff = Math.abs(b.max_grade - studentScore);
                return aDiff - bDiff; // Sort by closest cutoff to student score (tightest competition first)
              })
              .slice(0, showAllProgrammes ? result.qualified_programs.length : INITIAL_PROGRAMMES_COUNT)
              .map((program, index: number) => {
                const studentScore = result.summary.total_score;
                const cutoffDiff = program.max_grade - studentScore;

                // Balanced color coding based on competitiveness
                let cardColor = 'border-gray-200 bg-white';
                let statusColor = 'bg-blue-100 text-blue-800';
                let competitiveness = '';
                let accentColor = 'border-l-blue-500';

                if (cutoffDiff >= 3) {
                  cardColor = 'border-gray-200 bg-blue-50/30';
                  statusColor = 'bg-blue-100 text-blue-800';
                  competitiveness = 'High Chance';
                  accentColor = 'border-l-blue-500';
                } else if (cutoffDiff >= 1) {
                  cardColor = 'border-gray-200 bg-indigo-50/30';
                  statusColor = 'bg-indigo-100 text-indigo-800';
                  competitiveness = 'Good Chance';
                  accentColor = 'border-l-indigo-500';
                } else if (cutoffDiff >= 0) {
                  cardColor = 'border-gray-200 bg-slate-50/30';
                  statusColor = 'bg-slate-100 text-slate-800';
                  competitiveness = 'Competitive';
                  accentColor = 'border-l-slate-500';
                } else {
                  cardColor = 'border-gray-200 bg-gray-50/30';
                  statusColor = 'bg-gray-100 text-gray-800';
                  competitiveness = 'Challenging';
                  accentColor = 'border-l-gray-500';
                }

                return (
                  <div
                    key={program.id}
                    className={`rounded-lg shadow-sm border-l-4 overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-in-up ${cardColor} ${accentColor}`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                            <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs sm:text-sm font-semibold text-blue-600">#{index + 1}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                                {program.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600 break-words">
                                {result.school.name}
                              </p>
                            </div>
                          </div>

                          <div className="mt-2 sm:mt-3">
                            <p className="text-xs sm:text-sm text-gray-700 line-clamp-2 break-words">{program.description}</p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 sm:ml-6 sm:flex-shrink-0">
                          {/* Desktop: Show detailed grade info directly */}
                          <div className="hidden sm:block text-center bg-gray-50 rounded-lg p-3">
                            <div className="text-sm text-gray-600">Cutoff</div>
                            <div className="text-xl font-bold text-gray-900">{program.max_grade}</div>
                            <div className="text-xs text-gray-500">Yours: {studentScore}</div>
                          </div>

                          {/* Mobile: Dropdown for grade details */}
                          <div className="sm:hidden w-full">
                            <button
                              onClick={() => toggleGradeDetails(program.id)}
                              className="w-full text-left p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-600">Cutoff: {program.max_grade}</div>
                                <ChevronDown
                                  className={`w-4 h-4 text-gray-500 transition-transform ${
                                    expandedGrades.has(program.id) ? 'rotate-180' : ''
                                  }`}
                                />
                              </div>
                            </button>

                            {/* Expanded grade details */}
                            {expandedGrades.has(program.id) && (
                              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="text-center">
                                  <div className="text-sm font-medium text-blue-900">Detailed Breakdown</div>
                                  <div className="text-xs text-blue-700 mt-1">
                                    Cutoff: <span className="font-bold">{program.max_grade}</span>
                                  </div>
                                  <div className="text-xs text-blue-700">
                                    Your Score: <span className="font-bold">{studentScore}</span>
                                  </div>
                                  <div className="text-xs text-blue-700 mt-1">
                                    Difference: <span className={`font-bold ${cutoffDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      {cutoffDiff > 0 ? '+' : ''}{cutoffDiff}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="text-center">
                            <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${statusColor}`}>
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="hidden sm:inline">{competitiveness}</span>
                              <span className="sm:hidden">Eligible</span>
                            </span>
                          </div>

                          <button
                            onClick={() => window.open(program.link, '_blank')}
                            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-xs sm:text-sm font-medium w-full sm:w-auto"
                          >
                            <span className="hidden sm:inline">View Details</span>
                            <span className="sm:hidden">Details</span>
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
  
          {/* Load More Button */}
          {result.qualified_programs.length > INITIAL_PROGRAMMES_COUNT && !showAllProgrammes && (
            <div className="text-center pt-4 sm:pt-6">
              <button
                onClick={() => setShowAllProgrammes(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Load More Programmes
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <p className="text-xs sm:text-sm text-gray-600 mt-3 animate-pulse">
                Showing {INITIAL_PROGRAMMES_COUNT} of {result.qualified_programs.length} programmes
              </p>
            </div>
          )}
  
          {/* Schools Summary - After Programme List */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 mt-6 sm:mt-8 animate-fade-in-up">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Available in Institutions</h3>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {getProgrammesBySchool(result.qualified_programs).map(({ school, count }, index) => (
                <div
                  key={school}
                  className="flex items-center justify-between bg-white p-3 sm:p-4 rounded-md border border-gray-200 hover:bg-gray-50 transition-all duration-300 animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900 block truncate">{school}</span>
                    <span className="text-xs text-gray-600">Educational Institution</span>
                  </div>
                  <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 ml-2 sm:ml-3">
                    {count} program{count !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
  

      {/* Footer Actions */}
      <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="text-center">
            <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Need to make changes?</h4>
            <p className="text-xs sm:text-sm text-gray-600">You can update your information and check again</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {/* Primary Actions Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSaveAsPDF}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 sm:py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md text-sm sm:text-base"
              >
                <Download className="w-4 h-4 mr-2" />
                Save as PDF
              </button>

              <button
                onClick={handlePrint}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 sm:py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md text-sm sm:text-base"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
            </div>

            {/* Secondary Action */}
            <Button
              variant="outline"
              onClick={resetForm}
              className="w-full py-3 sm:py-2 text-sm sm:text-base"
            >
              Start Over
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
