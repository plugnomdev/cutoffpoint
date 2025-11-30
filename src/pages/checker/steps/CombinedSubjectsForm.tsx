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
    console.log('Input focused, current isOpen:', isOpen);
    if (!isOpen) {
      calculateDropdownPosition();
      setIsOpen(true);
      setSearchTerm('');
      setIsSearching(true);
      
      // Force a re-render to ensure dropdown is shown
      setTimeout(() => {
        if (inputRef.current) {
          calculateDropdownPosition();
        }
      }, 0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    setIsSearching(true);
    if (inputValue.length > 0) {
      calculateDropdownPosition();
      setIsOpen(true);
    }
  };

  const handleSelect = (optionValue: string) => {
    console.log('handleSelect called with:', optionValue);
    const option = options.find(opt => opt.value === optionValue);
    if (option) {
      console.log('Option found:', option);
      // Update the search term and value
      setSearchTerm(option.label);
      setIsSearching(false);
      
      // Call the parent's onChange with the selected value
      if (onChange) {
        console.log('Calling onChange with:', optionValue);
        onChange(optionValue);
      } else {
        console.warn('No onChange handler provided to SearchableSelect');
      }
      
      setHighlightedIndex(-1);
      // Keep the dropdown open for multiple selections
    } else {
      console.log('Option not found for value:', optionValue);
      console.log('Available options:', options);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
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
        
        // If we have a value but no search term, set the search term to the selected value's label
        if (value && !searchTerm) {
          const selectedOption = options.find(opt => opt.value === value);
          if (selectedOption) {
            setSearchTerm(selectedOption.label);
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value, searchTerm, options]);

  return (
    <div className="relative" style={{ isolation: 'isolate' }}>
      {/* Search Input with integrated dropdown */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={isSearching ? searchTerm : (options.find(opt => opt.value === value)?.label || '')}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onClick={() => {
            console.log('Input clicked, forcing dropdown open');
            if (!isOpen) {
              setIsOpen(true);
              calculateDropdownPosition();
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-10 pr-10 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${
            disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 focus:border-green-500 focus:ring-green-200 hover:border-green-400 cursor-pointer'
          }`}
          readOnly={!isSearching}
        />
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && createPortal(
        <>
          {/* Dropdown */}
          <div
            className="fixed bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto z-50"
            style={{
              ...dropdownStyles,
              display: isOpen ? 'block' : 'none',
              opacity: isOpen ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
              pointerEvents: isOpen ? 'auto' : 'none'
            }}
          >
            {/* Options */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.map((option, index) => (
                <div 
                  key={option.value}
                  className={`w-full p-3 text-left hover:bg-green-50 transition-colors duration-150 cursor-pointer ${
                    index === highlightedIndex ? 'bg-green-50' : ''
                  } ${option.value === value ? 'bg-green-100 text-green-900' : 'text-gray-900'} flex items-center`}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent input blur
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Option clicked:', option);
                    handleSelect(option.value);
                  }}
                >
                  <span className="truncate text-xs sm:text-sm flex-1">{option.label}</span>
                  {option.value === value && (
                    <div className="ml-2 w-2 h-2 bg-green-600 rounded-full"></div>
                  )}
                </div>
              ))}
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
                      key={`elective-${index}-${electiveSelections[index]}`} // Force re-render when value changes
                      options={fetchedElectiveSubjects
                        .filter(subject => 
                          // Only show subjects that aren't already selected in other fields
                          !electiveSelections.some((sel, i) => i !== index && sel === subject.name)
                        )
                        .map((subject) => ({
                          value: subject.name,
                          label: subject.name
                        }))}
                      value={electiveSelections[index] || ''}
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