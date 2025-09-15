import { useEffect, useState } from 'react';
import { Subject, Grade, fetchSubjectsByType } from '../../../services/api/universityApi';
import { CoreSubjects } from '../types';
import { useChecker } from '../CheckerContext';

type CombinedSubjectsFormProps = CoreSubjects & {
  coreSubjects: Subject[];
  updateFields: (fields: { coreSubjects: CoreSubjects } | { selectedElectives: string[] } | { electiveGrades: Record<string, string> }) => void;
}

export default function CombinedSubjectsForm({
  coreSubjects,
  updateFields,
  ...grades
}: CombinedSubjectsFormProps) {
  const { electiveSubjects, availableGrades, formData } = useChecker();
  const [fetchedCoreSubjects, setFetchedCoreSubjects] = useState<any[]>([]);
  const [fetchedElectiveSubjects, setFetchedElectiveSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch both core and elective subjects using the same API function
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        // Fetch both core and elective subjects using the same API function
        const [coreData, electiveData] = await Promise.all([
          fetchSubjectsByType(1), // Core subjects - same API as electives
          fetchSubjectsByType(2)  // Elective subjects - same API as core
        ]);
        setFetchedCoreSubjects(coreData);
        setFetchedElectiveSubjects(electiveData);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
        // Fallback to empty arrays
        setFetchedCoreSubjects([]);
        setFetchedElectiveSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Initialize core grades based on fetched subjects
  const [coreGrades, setCoreGrades] = useState<Record<string, string>>({});

  // Update core grades when subjects are fetched
  useEffect(() => {
    if (fetchedCoreSubjects.length > 0) {
      const initialGrades: Record<string, string> = {};
      fetchedCoreSubjects.forEach((subject) => {
        // Use subject ID as key for consistency
        const key = `core_${subject.id}`;
        initialGrades[key] = '';
      });
      setCoreGrades(initialGrades);
    }
  }, [fetchedCoreSubjects]);

  const [electiveSelections, setElectiveSelections] = useState<string[]>([
    formData.selectedElectives?.[0] || '',
    formData.selectedElectives?.[1] || '',
    formData.selectedElectives?.[2] || '',
    formData.selectedElectives?.[3] || ''
  ]);

  const [electiveGrades, setElectiveGrades] = useState<Record<string, string>>({
    ...(formData.electiveGrades || {})
  });

  // Update parent when data changes
  useEffect(() => {
    // Transform core grades to the expected format for ConfirmationForm
    const transformedCoreSubjects = Object.entries(coreGrades).reduce((acc, [key, grade]) => {
      if (grade && key.startsWith('core_')) {
        const subjectId = key.replace('core_', '');
        acc[parseInt(subjectId)] = grade;
      }
      return acc;
    }, {} as Record<number, string>);

    updateFields({
      coreSubjects: transformedCoreSubjects,
      selectedElectives: electiveSelections.filter(s => s),
      electiveGrades
    });
  }, [coreGrades, electiveSelections, electiveGrades]); // Removed updateFields from dependencies

  const updateCoreGrade = (subject: string, grade: string) => {
    setCoreGrades(prev => ({
      ...prev,
      [subject]: grade
    }));
  };

  const updateElective = (index: number, subjectName: string) => {
    const newSelections = [...electiveSelections];
    newSelections[index] = subjectName;
    setElectiveSelections(newSelections);
  };

  const updateElectiveGrade = (subjectName: string, grade: string) => {
    setElectiveGrades(prev => ({
      ...prev,
      [subjectName]: grade
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Subject Grades</h2>
        <p className="text-gray-600 mt-2">Select your core subjects and electives with grades</p>
      </div>

      {/* 50/50 Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Subjects Section */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-blue-900">Core Subjects</h3>
          </div>

          <div className="p-4 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading core subjects...</span>
              </div>
            ) : (
              fetchedCoreSubjects.map((subject) => {
                const key = `core_${subject.id}`;

                return (
                  <div key={subject.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">
                          {subject.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{subject.name}</span>
                      <span className="text-xs text-gray-500">({subject.subject_code})</span>
                    </div>
                    <select
                      value={coreGrades[key] || ''}
                      onChange={(e) => {
                        const newGrades = {
                          ...coreGrades,
                          [key]: e.target.value
                        };
                        setCoreGrades(newGrades);
                      }}
                      className="w-24 p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Grade</option>
                      {availableGrades.map((grade) => (
                        <option key={grade.id} value={grade.name}>
                          {grade.name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Electives Section */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 bg-green-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-green-900">Elective Subjects</h3>
          </div>

          <div className="p-4 space-y-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-1">
                  <select
                    value={electiveSelections[index]}
                    onChange={(e) => updateElective(index, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select elective subject...</option>
                    {fetchedElectiveSubjects.map((subject) => (
                      <option key={subject.id} value={subject.name}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <select
                    value={electiveSelections[index] ? electiveGrades[electiveSelections[index]] || '' : ''}
                    onChange={(e) => updateElectiveGrade(electiveSelections[index], e.target.value)}
                    disabled={!electiveSelections[index]}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Grade</option>
                    {availableGrades.map((grade) => (
                      <option key={grade.id} value={grade.name}>
                        {grade.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}