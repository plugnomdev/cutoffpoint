import { useEffect, useState, useRef, useMemo } from 'react';
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
  const [isSearching, setIsSearching] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownStyles, setDropdownStyles] = useState({});
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Only show dropdown if user has typed something
  const shouldShowDropdown = isOpen && searchTerm.length > 0 && filteredOptions.length > 0;

  const calculateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
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

  const handleInputFocus = () => {
    setIsSearching(true);
    // Clear the input when focused to allow fresh search
    if (!searchTerm) {
      setSearchTerm('');
    }
    calculateDropdownPosition();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    setIsSearching(true);

    // Open dropdown and calculate position when user types
    if (inputValue.length > 0) {
      setIsOpen(true);
      calculateDropdownPosition();
    } else {
      setIsOpen(false);
    }
  };

  const handleSelect = (optionValue: string) => {
    const option = options.find(opt => opt.value === optionValue);
    if (option) {
      // Update the search term to show selected value
      setSearchTerm(option.label);
      setIsSearching(false);
      setIsOpen(false);

      // Call the parent's onChange with the selected value
      if (onChange) {
        onChange(optionValue);
      }

      setHighlightedIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!shouldShowDropdown) {
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
        setHighlightedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);

        // If we have a value but no search term, show the selected value
        if (value && !searchTerm) {
          const selectedOption = options.find(opt => opt.value === value);
          if (selectedOption) {
            setSearchTerm(selectedOption.label);
          }
        }
        setIsSearching(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value, searchTerm, options]);

  // Update search term when value changes externally
  useEffect(() => {
    if (value && !isSearching) {
      const selectedOption = options.find(opt => opt.value === value);
      if (selectedOption) {
        setSearchTerm(selectedOption.label);
      }
    }
  }, [value, options, isSearching]);

  return (
    <div className="relative" style={{ isolation: 'isolate' }}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-10 pr-10 py-3 text-base border-2 rounded-lg focus:outline-none focus:ring-2 ${disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
            : 'border-gray-300 focus:border-green-500 focus:ring-green-200 hover:border-green-400 bg-white'
            }`}
        />
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        {searchTerm && isSearching && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm('');
              setIsOpen(false);
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown - Only show when user has typed something */}
      {shouldShowDropdown && createPortal(
        <div
          className="fixed bg-white border-2 border-green-200 rounded-lg shadow-xl max-h-64 overflow-auto z-50"
          style={{
            ...dropdownStyles,
            display: 'block',
            opacity: 1
          }}
        >
          {/* Show count of results */}
          <div className="px-3 py-2 bg-green-50 border-b border-green-100 text-xs text-green-700 font-medium">
            {filteredOptions.length} subject{filteredOptions.length !== 1 ? 's' : ''} found
          </div>

          {/* Options */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <div
                key={option.value}
                className={`w-full p-3 text-left hover:bg-green-50 transition-colors duration-150 cursor-pointer ${index === highlightedIndex ? 'bg-green-50' : ''
                  } ${option.value === value ? 'bg-green-100 text-green-900 font-semibold' : 'text-gray-900'} flex items-center`}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent input blur
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(option.value);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <span className="truncate text-sm flex-1">{option.label}</span>
                {option.value === value && (
                  <div className="ml-2 w-2 h-2 bg-green-600 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>,
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

  // Update core grades when subjects are fetched
  useEffect(() => {
    // Only initialize if we have subjects and haven't populated grades yet
    // This prevents overwriting user edits and breaking the update loop
    if (fetchedCoreSubjects.length > 0 && Object.keys(coreGrades).length === 0) {
      console.log('Initializing core grades from formData:', formData.coreSubjects);

      const initialGrades: Record<string, string> = {};
      let foundData = false;

      fetchedCoreSubjects.forEach((subject) => {
        // Use subject ID as key for consistency
        const key = `core_${subject.id}`;
        // Initialize with existing grade if available - check both number and string keys
        const existingGrade = formData.coreSubjects?.[subject.id] ||
          formData.coreSubjects?.[String(subject.id)];

        // Only set if we have a value
        if (existingGrade) {
          initialGrades[key] = existingGrade;
          foundData = true;
        }
      });

      // Only update if we found some grades to restore
      if (foundData) {
        console.log('Restoring core grades:', initialGrades);
        setCoreGrades(initialGrades);
      }
    }
  }, [fetchedCoreSubjects, formData.coreSubjects]); // Run when subjects load OR saved data loads

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

  // Memoize elective IDs calculation
  const electiveIds = useMemo(() => {
    return electiveSelections.map(name => {
      if (!name || name.trim() === '') return '';
      const subject = fetchedElectiveSubjects.find(s => s.name === name);
      console.log('Elective subject lookup:', { name, subject, id: subject?.id });
      return subject ? subject.id.toString() : '';
    });
  }, [electiveSelections, fetchedElectiveSubjects]);

  // Log state changes for debugging
  useEffect(() => {
    console.log('Elective selections:', electiveSelections);
    console.log('Elective IDs:', electiveIds);
  }, [electiveSelections, electiveIds]);

  // Use refs to track previous values and prevent unnecessary updates
  const prevValuesRef = useRef({
    coreGrades: {} as Record<string, string>,
    electiveSelections: [] as string[],
    electiveGrades: {} as Record<string, string>
  });

  // Update parent when data changes
  useEffect(() => {
    // Skip initial render and only update when we have data
    if (fetchedCoreSubjects.length === 0) return;

    // Check if anything actually changed
    const { coreGrades: prevCoreGrades, electiveSelections: prevElectiveSelections, electiveGrades: prevElectiveGrades } = prevValuesRef.current;

    const coreGradesChanged = JSON.stringify(coreGrades) !== JSON.stringify(prevCoreGrades);
    const electiveSelectionsChanged = JSON.stringify(electiveSelections) !== JSON.stringify(prevElectiveSelections);
    const electiveGradesChanged = JSON.stringify(electiveGrades) !== JSON.stringify(prevElectiveGrades);

    if (!coreGradesChanged && !electiveSelectionsChanged && !electiveGradesChanged) {
      return; // No changes, skip update
    }

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
          acc[parseInt(subjectId)] = subject.subject_code;
        }
      }
      return acc;
    }, {} as Record<number, string>);

    // Calculate elective IDs
    const currentElectiveIds = electiveSelections.map(name => {
      if (!name || name.trim() === '') return '';
      const subject = fetchedElectiveSubjects.find(s => s.name === name);
      return subject ? subject.id.toString() : '';
    });

    console.log('Updating parent with new data');
    updateFields({
      coreSubjects: transformedCoreSubjects,
      coreSubjectNames: updatedCoreSubjectNames,
      selectedElectives: currentElectiveIds,
      electiveGrades
    });

    // Update refs with current values
    prevValuesRef.current = {
      coreGrades: { ...coreGrades },
      electiveSelections: [...electiveSelections],
      electiveGrades: { ...electiveGrades }
    };
  }, [coreGrades, electiveSelections, electiveGrades, fetchedCoreSubjects, fetchedElectiveSubjects, updateFields]);

  const updateElective = (index: number, subjectName: string) => {
    console.log('Updating elective:', { index, subjectName, currentSelections: electiveSelections });

    // Create a new array with the updated selection
    const newSelections = [...electiveSelections];
    newSelections[index] = subjectName;

    console.log('New selections:', newSelections);
    setElectiveSelections(newSelections);

    // Update the grades object to include the new selection
    if (subjectName && !electiveGrades[subjectName]) {
      console.log('Adding new grade entry for:', subjectName);
      setElectiveGrades(prev => ({
        ...prev,
        [subjectName]: ''
      }));
    }

    // Force update parent component
    setTimeout(() => {
      const electiveIds = newSelections.map(name => {
        if (!name) return '';
        const subject = fetchedElectiveSubjects.find(s => s.name === name);
        return subject ? subject.id.toString() : '';
      });

      updateFields({
        selectedElectives: electiveIds,
        electiveGrades
      });
    }, 0);
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
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Enter Your Grades</h2>
        <p className="text-gray-600 mt-1 text-sm">Select your subjects and enter your grades</p>
      </div>

      {/* Full-width stacked layout with collapsible sections */}
      <div className="space-y-4">
        {/* Core Subjects Section */}
        <div className="bg-white border-2 border-blue-200 rounded-xl shadow-sm overflow-hidden">
          <button
            onClick={() => setCoreExpanded(!coreExpanded)}
            className="w-full p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 transition-all duration-200 flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">4</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-blue-900">Core Subjects</h3>
            </div>
            {coreExpanded ? (
              <ChevronUp className="w-6 h-6 text-blue-600" />
            ) : (
              <ChevronDown className="w-6 h-6 text-blue-600" />
            )}
          </button>

          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${coreExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
            <div className="p-4 space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-sm text-gray-600">Loading subjects...</span>
                </div>
              ) : (
                fetchedCoreSubjects.map((subject, idx) => {
                  const key = `core_${subject.id}`;

                  return (
                    <div key={subject.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <label className="block mb-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900 text-sm flex items-center">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mr-2">
                              {idx + 1}
                            </span>
                            {subject.name}
                          </span>
                          {coreGrades[key] && (
                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              {coreGrades[key]}
                            </span>
                          )}
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
                          className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            backgroundSize: '1.5em 1.5em',
                            paddingRight: '2.5rem'
                          }}
                        >
                          <option value="">Select grade...</option>
                          {availableGrades.map((grade) => (
                            <option key={grade.id} value={grade.name}>
                              {grade.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Electives Section */}
        <div className="bg-white border-2 border-green-200 rounded-xl shadow-sm overflow-hidden">
          <button
            onClick={() => setElectivesExpanded(!electivesExpanded)}
            className="w-full p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-150 transition-all duration-200 flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">4</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-green-900">Elective Subjects</h3>
            </div>
            {electivesExpanded ? (
              <ChevronUp className="w-6 h-6 text-green-600" />
            ) : (
              <ChevronDown className="w-6 h-6 text-green-600" />
            )}
          </button>

          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${electivesExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
            <div className="p-4 space-y-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold text-gray-700 text-sm flex items-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-700 rounded-full text-xs font-bold mr-2">
                        {index + 1}
                      </span>
                      Elective {index + 1}
                    </span>
                    {electiveSelections[index] && electiveGrades[electiveSelections[index]] && (
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                        {electiveGrades[electiveSelections[index]]}
                      </span>
                    )}
                  </div>

                  {/* Subject Selection */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
                    <SearchableSelect
                      key={`elective-${index}-${electiveSelections[index]}`}
                      options={fetchedElectiveSubjects
                        .filter(subject =>
                          !electiveSelections.some((sel, i) => i !== index && sel === subject.name)
                        )
                        .map((subject) => ({
                          value: subject.name,
                          label: subject.name
                        }))}
                      value={electiveSelections[index] || ''}
                      onChange={(value) => updateElective(index, value)}
                      placeholder="Search and select subject..."
                    />
                  </div>

                  {/* Grade Selection */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Grade</label>
                    <select
                      value={electiveSelections[index] ? electiveGrades[electiveSelections[index]] || '' : ''}
                      onChange={(e) => updateElectiveGrade(electiveSelections[index], e.target.value)}
                      disabled={!electiveSelections[index]}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed bg-white appearance-none"
                      style={{
                        backgroundImage: electiveSelections[index] ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` : 'none',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      <option value="">Select grade...</option>
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