import { useEffect, useState } from 'react';
import { BookOpen, Calculator, CheckCircle, Info, Target } from 'lucide-react';
import { ProspectiveFormData } from '../ProspectiveStudentChecker';
import { getGradeRanges, percentageToWASSCEGrade, isValidPercentage } from '../../../utils/gradeConversion';
import { useProspectiveChecker } from '../ProspectiveCheckerContext';

type PercentageGradeFormProps = {
  updateFields: (fields: Partial<ProspectiveFormData>) => void;
}

export default function PercentageGradeForm({
  updateFields
}: PercentageGradeFormProps) {
  const { coreSubjects, electiveSubjects } = useProspectiveChecker();
  const [selectedElectives, setSelectedElectives] = useState<string[]>([]);
  const [corePercentages, setCorePercentages] = useState<Record<number, number>>({});
  const [electivePercentages, setElectivePercentages] = useState<Record<string, number>>({});

  // Initialize core percentages when coreSubjects are available
  useEffect(() => {
    if (coreSubjects.length > 0) {
      const initialCore: Record<number, number> = {};
      coreSubjects.forEach(subject => {
        initialCore[subject.id] = 0;
      });
      setCorePercentages(initialCore);
    }
  }, [coreSubjects]);

  // Update parent form data when local state changes
  useEffect(() => {
    updateFields({
      coreSubjects: corePercentages,
      selectedElectives,
      electiveGrades: electivePercentages
    });
  }, [corePercentages, selectedElectives, electivePercentages, updateFields]);

  const handleCorePercentageChange = (subjectId: number, percentage: number) => {
    if (isValidPercentage(percentage)) {
      setCorePercentages(prev => ({
        ...prev,
        [subjectId]: percentage
      }));
    }
  };

  const handleElectiveSelection = (subjectName: string) => {
    setSelectedElectives(prev => {
      if (prev.includes(subjectName)) {
        // Remove elective and its grade
        const newSelected = prev.filter(s => s !== subjectName);
        setElectivePercentages(prevGrades => {
          const newGrades = { ...prevGrades };
          delete newGrades[subjectName];
          return newGrades;
        });
        return newSelected;
      } else if (prev.length < 4) {
        // Add elective
        return [...prev, subjectName];
      }
      return prev;
    });
  };

  const handleElectivePercentageChange = (subjectName: string, percentage: number) => {
    if (isValidPercentage(percentage)) {
      setElectivePercentages(prev => ({
        ...prev,
        [subjectName]: percentage
      }));
    }
  };

  const gradeRanges = getGradeRanges();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Enter Your Grades</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Input your current percentage scores and we'll automatically convert them to WASSCE grades
          </p>
        </div>
      </div>

      {/* Grade Scale Reference */}
      <div className="bg-gradient-to-r from-[#2d3192]/5 to-[#2d3192]/10 p-6 rounded-xl border border-[#2d3192]/20 shadow-sm">
        <div className="flex items-center mb-4">
          <Info className="w-5 h-5 text-[#2d3192] mr-2" />
          <h3 className="text-lg font-semibold text-[#2d3192]">Grade Conversion Reference</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {gradeRanges.map(range => (
            <div key={range.grade} className="bg-white p-3 rounded-lg border border-[#2d3192]/10 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-lg font-bold text-[#2d3192] mb-1">{range.grade}</div>
              <div className="text-sm text-[#2d3192]/80 font-medium">{range.min}-{range.max}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Subjects Section */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-200">
          <div className="flex items-center">
            <BookOpen className="w-6 h-6 text-white mr-3" />
            <div>
              <h3 className="text-xl font-bold text-white">Core Subjects</h3>
              <p className="text-blue-100 text-sm">Required subjects for all programs</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {coreSubjects.map((subject) => {
            const percentage = corePercentages[subject.id] || 0;
            const wassceGrade = percentageToWASSCEGrade(percentage);

            return (
              <div key={subject.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">
                        {subject.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 text-lg">{subject.name}</span>
                      <div className="text-sm text-gray-500">{subject.subject_code}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={percentage || ''}
                          onChange={(e) => handleCorePercentageChange(subject.id, parseInt(e.target.value) || 0)}
                          className="w-24 p-3 border border-gray-300 rounded-lg text-center font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="0"
                        />
                        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                          %
                        </div>
                      </div>
                    </div>

                    {wassceGrade && (
                      <div className="text-center">
                        <div className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-bold shadow-sm">
                          {wassceGrade}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Grade</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Electives Section */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 bg-gradient-to-r from-green-600 to-green-700 border-b border-green-200">
          <div className="flex items-center">
            <Target className="w-6 h-6 text-white mr-3" />
            <div>
              <h3 className="text-xl font-bold text-white">Elective Subjects</h3>
              <p className="text-green-100 text-sm">Choose 2-4 subjects from your program</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Elective Selection */}
          <div className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {electiveSubjects.map((subject) => (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => handleElectiveSelection(subject.name)}
                  className={`p-4 text-left rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${
                    selectedElectives.includes(subject.name)
                      ? 'border-green-500 bg-green-50 text-green-700 shadow-md'
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
                  } ${
                    selectedElectives.length >= 4 && !selectedElectives.includes(subject.name)
                      ? 'opacity-50 cursor-not-allowed hover:scale-100'
                      : ''
                  }`}
                  disabled={selectedElectives.length >= 4 && !selectedElectives.includes(subject.name)}
                >
                  <div className="font-semibold text-sm mb-1">{subject.name}</div>
                  <div className="text-xs text-gray-500">{subject.subject_code}</div>
                  {selectedElectives.includes(subject.name) && (
                    <CheckCircle className="w-4 h-4 text-green-600 mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Electives with Grades */}
          {selectedElectives.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-lg flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-green-600" />
                Enter Grades for Selected Electives
              </h4>
              {selectedElectives.map((subjectName) => {
                const percentage = electivePercentages[subjectName] || 0;
                const wassceGrade = percentageToWASSCEGrade(percentage);

                return (
                  <div key={subjectName} className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 text-lg">{subjectName}</span>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={percentage || ''}
                              onChange={(e) => handleElectivePercentageChange(subjectName, parseInt(e.target.value) || 0)}
                              className="w-24 p-3 border border-gray-300 rounded-lg text-center font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                              placeholder="0"
                            />
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                              %
                            </div>
                          </div>
                        </div>

                        {wassceGrade && (
                          <div className="text-center">
                            <div className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-bold shadow-sm">
                              {wassceGrade}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Grade</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="bg-gradient-to-r from-[#2d3192]/5 to-[#fbc024]/5 p-6 rounded-xl border border-[#2d3192]/20">
        <div className="flex items-center mb-4">
          <CheckCircle className="w-6 h-6 text-[#2d3192] mr-3" />
          <h4 className="text-xl font-bold text-[#2d3192]">Progress Summary</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-[#2d3192]/10 text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-[#2d3192] mb-1">
              {Object.values(corePercentages).filter(p => p > 0).length}
            </div>
            <div className="text-sm text-gray-600">Core Subjects</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-[#2d3192]/10 text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-[#fbc024] mb-1">
              {selectedElectives.length}
            </div>
            <div className="text-sm text-gray-600">Electives Selected</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-[#2d3192]/10 text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-[#2d3192] mb-1">
              {Object.values(corePercentages).filter(p => p > 0).length + Object.values(electivePercentages).filter(p => p > 0).length}
            </div>
            <div className="text-sm text-gray-600">Total Grades</div>
          </div>
        </div>
      </div>
    </div>
  );
}