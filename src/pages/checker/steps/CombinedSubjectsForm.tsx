import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Subject, fetchSubjectsByType } from '../../../services/api/universityApi';
import { CoreSubjects } from '../types';
import { useChecker } from '../CheckerContext';
import { ChevronDown, Search, X, ChevronUp } from 'lucide-react';

// Searchable Select Component for Electives
interface SearchableSelectProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}

function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  disabled = false
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownStyles, setDropdownStyles] = useState({});
  const buttonRef = useRef<HTMLButtonElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  const calculateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 256; // max-h-64 = 256px
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      let top = 0;

      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        top = rect.top - dropdownHeight - 4; // 4px margin
      } else {
        top = rect.bottom + 4; // 4px margin
      }

      setDropdownStyles({
        position: 'fixed',
        top: `${top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        zIndex: 9999
      });
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      calculateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div className="relative" style={{ isolation: 'isolate' }}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && handleToggle()}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`w-full p-2 sm:p-3 text-left border rounded-lg bg-white transition-all duration-200 flex items-center justify-between text-sm ${
          disabled
            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
            : 'hover:border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-200'
        } ${isOpen ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-300'}`}
      >
        <span className={`truncate ${!selectedOption ? 'text-gray-500' : 'text-gray-900'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {isOpen && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-9998"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div
            className="fixed bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-hidden"
            style={dropdownStyles}
          >
            {/* Search Input */}
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search subjects..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                  onClick={(e) => e.stopPropagation()}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="p-3 text-sm text-gray-500 text-center">
                  No subjects found
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`w-full p-3 text-left hover:bg-green-50 transition-colors duration-150 ${
                      index === highlightedIndex ? 'bg-green-50' : ''
                    } ${option.value === value ? 'bg-green-100 text-green-900' : 'text-gray-900'}`}
                  >
                    <span className="truncate text-xs sm:text-sm">{option.label}</span>
                    {option.value === value && (
                      <div className="ml-auto w-2 h-2 bg-green-600 rounded-full"></div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

type CombinedSubjectsFormProps = CoreSubjects & {
  coreSubjects: Subject[];
  updateFields: (fields: { coreSubjects: CoreSubjects } | { coreSubjectNames: Record<number, string> } | { selectedElectives: string[] } | { electiveGrades: Record<string, string> }) => void;
  coreSubjectNames?: Record<number, string>;
}

export default function CombinedSubjectsForm({
  coreSubjects: _coreSubjects,
  updateFields,
  coreSubjectNames
}: CombinedSubjectsFormProps) {
  const { availableGrades, formData } = useChecker();
  const [fetchedCoreSubjects, setFetchedCoreSubjects] = useState<any[]>([]);
  const [fetchedElectiveSubjects, setFetchedElectiveSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [coreExpanded, setCoreExpanded] = useState(true);
  const [electivesExpanded, setElectivesExpanded] = useState(true);

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

        // Remove duplicates from elective subjects based on name OR subject_code
        const uniqueElectiveData = electiveData.filter((subject, index, self) =>
          index === self.findIndex(s =>
            s.name === subject.name ||
            (s.subject_code && subject.subject_code && s.subject_code === subject.subject_code)
          )
        );

        setFetchedCoreSubjects(coreData);
        setFetchedElectiveSubjects(uniqueElectiveData);
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

  // Initialize core grades based on fetched subjects and existing form data
  const [coreGrades, setCoreGrades] = useState<Record<string, string>>({});

  // Update core grades when subjects are fetched or form data changes
  useEffect(() => {
    if (fetchedCoreSubjects.length > 0) {
      const initialGrades: Record<string, string> = {};
      fetchedCoreSubjects.forEach((subject) => {
        // Use subject ID as key for consistency
        const key = `core_${subject.id}`;
        // Initialize with existing grade if available
        const existingGrade = formData.coreSubjects?.[subject.id] || '';
        initialGrades[key] = existingGrade;
      });
      setCoreGrades(initialGrades);
    }
  }, [fetchedCoreSubjects, formData.coreSubjects]);

  // Convert subject IDs back to names for display/selection
  const getElectiveNameFromId = (id: string) => {
    if (!id || id.trim() === '') return '';
    const subject = fetchedElectiveSubjects.find(s => s.id.toString() === id);
    return subject ? subject.name : '';
  };

  const [electiveSelections, setElectiveSelections] = useState<string[]>([
    getElectiveNameFromId(formData.selectedElectives?.[0] || ''),
    getElectiveNameFromId(formData.selectedElectives?.[1] || ''),
    getElectiveNameFromId(formData.selectedElectives?.[2] || ''),
    getElectiveNameFromId(formData.selectedElectives?.[3] || '')
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

    // Create coreSubjectNames mapping using subject codes from API (for backend submission)
    const updatedCoreSubjectNames = Object.entries(coreGrades).reduce((acc, [key, grade]) => {
      if (grade && key.startsWith('core_')) {
        const subjectId = key.replace('core_', '');
        const subject = fetchedCoreSubjects.find(s => s.id === parseInt(subjectId));
        if (subject) {
          acc[parseInt(subjectId)] = subject.subject_code; // Use subject code for core subjects
        }
      }
      return acc;
    }, { ...coreSubjectNames } as Record<number, string>);

    // Create a mapping of subject names to subject_ids for electives (backend expects IDs for electives)
    const electiveIds = electiveSelections.map(name => {
      if (!name || name.trim() === '') return '';
      const subject = fetchedElectiveSubjects.find(s => s.name === name);
      console.log('Elective subject lookup:', { name, subject, id: subject?.id });
      return subject ? subject.id.toString() : '';
    });

    updateFields({
      coreSubjects: transformedCoreSubjects,
      coreSubjectNames: updatedCoreSubjectNames,
      selectedElectives: electiveIds,
      electiveGrades
    });
  }, [coreGrades, electiveSelections, electiveGrades]); // Removed updateFields from dependencies

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
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">Subject Grades</h2>
        <p className="text-gray-600 mt-1 text-xs sm:text-sm">Select your core subjects and electives with grades</p>
      </div>

      {/* Full-width stacked layout with collapsible sections */}
      <div className="space-y-4 sm:space-y-6">
        {/* Core Subjects Section */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <button
            onClick={() => setCoreExpanded(!coreExpanded)}
            className="w-full p-2 sm:p-3 bg-blue-50 border-b border-gray-200 hover:bg-blue-100 transition-colors duration-200 flex items-center justify-between"
          >
            <h3 className="text-xs sm:text-sm font-semibold text-blue-900">Core Subjects</h3>
            {coreExpanded ? (
              <ChevronUp className="w-5 h-5 text-blue-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-blue-600" />
            )}
          </button>

          <div className={`relative transition-all duration-300 ease-in-out ${
            coreExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="p-4 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-6 sm:py-8">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-600">Loading core subjects...</span>
                </div>
              ) : (
                fetchedCoreSubjects.map((subject) => {
                  const key = `core_${subject.id}`;

                  return (
                    <div key={subject.id} className="flex items-center justify-between">
                      <div className="flex items-center flex-1 min-w-0">
                        <span className="font-medium text-gray-900 text-xs sm:text-sm truncate">{subject.name}</span>
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
                        className="w-20 sm:w-24 p-1.5 sm:p-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex-shrink-0 ml-2"
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
        </div>

        {/* Electives Section */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <button
            onClick={() => setElectivesExpanded(!electivesExpanded)}
            className="w-full p-2 sm:p-3 bg-green-50 border-b border-gray-200 hover:bg-green-100 transition-colors duration-200 flex items-center justify-between"
          >
            <h3 className="text-xs sm:text-sm font-semibold text-green-900">Elective Subjects</h3>
            {electivesExpanded ? (
              <ChevronUp className="w-5 h-5 text-green-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-green-600" />
            )}
          </button>

          <div className={`relative transition-all duration-300 ease-in-out ${
            electivesExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="p-4 space-y-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                  <div className="flex-1 min-w-0">
                    <SearchableSelect
                      options={fetchedElectiveSubjects.map((subject) => ({
                        value: subject.name,
                        label: subject.name
                      }))}
                      value={electiveSelections[index]}
                      onChange={(value) => updateElective(index, value)}
                      placeholder="Select elective subject..."
                    />
                  </div>
                  <div className="w-20 sm:w-24 flex-shrink-0">
                    <select
                      value={electiveSelections[index] ? electiveGrades[electiveSelections[index]] || '' : ''}
                      onChange={(e) => updateElectiveGrade(electiveSelections[index], e.target.value)}
                      disabled={!electiveSelections[index]}
                      className="w-full p-1.5 sm:p-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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

    </div>
  );
}