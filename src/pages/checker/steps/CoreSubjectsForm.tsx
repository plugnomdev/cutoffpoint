import { useState } from 'react';
import { Subject } from '../../../services/api/universityApi';
import { CoreSubjects } from '../GradeChecker';
import { useChecker } from '../CheckerContext';

type CoreSubjectsFormProps = CoreSubjects & {
  coreSubjects: Subject[];
  updateFields: (fields: { coreSubjects: CoreSubjects }) => void;
}


export default function CoreSubjectsForm({
  coreSubjects,
  updateFields,
  ...grades
}: CoreSubjectsFormProps) {
  const { availableGrades } = useChecker();

  const handleGradeChange = (subjectId: number, grade: string) => {
    updateFields({
      coreSubjects: {
        ...grades,
        [subjectId]: grade
      }
    });
  };

  // Get compassionate color coding for grades
  const getGradeColor = (gradeName: string) => {
    const gradeColors: Record<string, { bg: string; border: string; text: string; ring: string }> = {
      'A1': { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700', ring: 'ring-green-200' },
      'B2': { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-600', ring: 'ring-green-200' },
      'B3': { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-600', ring: 'ring-emerald-200' },
      'C4': { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-600', ring: 'ring-blue-200' },
      'C5': { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700', ring: 'ring-blue-200' },
      'C6': { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-600', ring: 'ring-indigo-200' },
      'D7': { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-600', ring: 'ring-yellow-200' },
      'E8': { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-600', ring: 'ring-orange-200' },
      'F9': { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-600', ring: 'ring-amber-200' }
    };
    return gradeColors[gradeName] || { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700', ring: 'ring-gray-200' };
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Core Subjects</h2>
        <p className="text-gray-600 mt-2">Select your grades for the core subjects</p>
      </div>
      
      <div className="space-y-4">
        {coreSubjects.map((subject) => (
          <div key={subject.id} className="bg-gradient-to-br from-gray-50 to-gray-100/80 p-4 rounded-lg shadow-md border border-gray-200/60 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <span className="text-lg">📚</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{subject.name}</h3>
                  <p className="text-xs text-gray-600">Core Subject</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                Required
              </div>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-2">
              {availableGrades.map((grade) => {
                const isSelected = grades[subject.id] === grade.name;
                const colors = getGradeColor(grade.name);

                return (
                  <button
                    key={grade.id}
                    type="button"
                    onClick={() => handleGradeChange(subject.id, grade.name)}
                    className={`relative p-2 border-2 rounded-lg text-center font-bold transition-all duration-200 transform hover:scale-105 ${
                      isSelected
                        ? `${colors.bg} ${colors.border} ${colors.text} ring-2 ${colors.ring} shadow-md scale-105`
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 hover:border-gray-400 hover:shadow-md'
                    }`}
                  >
                    <span className="text-sm">{grade.name}</span>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white animate-pulse"></div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {grades[subject.id] && (
              <div className="mt-2 flex items-center justify-center">
                <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full shadow-sm ${getGradeColor(grades[subject.id]).bg} border ${getGradeColor(grades[subject.id]).border}`}>
                  <span className="text-xs font-medium text-gray-700">Grade:</span>
                  <span className={`text-sm font-bold ${getGradeColor(grades[subject.id]).text}`}>
                    {grades[subject.id]}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
    </div>
  );
}
