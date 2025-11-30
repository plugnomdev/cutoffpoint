import { Country, School, ProgramType, fetchProgramTypes } from '../../../services/api/universityApi';
import { FormData } from '../types';
import { useEffect, useState, useRef } from 'react';
import { Building2, Award, User, Phone, ChevronDown, Search, X } from 'lucide-react';

// Modern Searchable Select Component
interface SearchableSelectProps {
  options: Array<{ value: string; label: string; flag?: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  _required?: boolean;
  icon?: React.ReactNode;
  showSelectedFlag?: boolean;
}

function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  _required = false,
  icon,
  showSelectedFlag = false
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);
  const displayPlaceholder = _required ? `${placeholder} *` : placeholder;

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
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`w-full p-2 text-left border rounded-lg bg-white transition-all duration-200 flex items-center justify-between ${disabled
          ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
          : 'hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
          } ${isOpen ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}
      >
        <div className="flex items-center flex-1 min-w-0">
          {/* Show selected country's flag or default icon */}
          {selectedOption && showSelectedFlag && selectedOption.flag ? (
            <span className="mr-2 flex-shrink-0 text-lg">{selectedOption.flag}</span>
          ) : (
            icon && <span className="mr-2 flex-shrink-0">{icon}</span>
          )}
          <span className={`truncate text-sm ${!selectedOption ? 'text-gray-500' : 'text-gray-900'}`}>
            {selectedOption ? selectedOption.label : displayPlaceholder}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''
          }`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-hidden">
            {/* Search Input */}
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
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
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`w-full p-2 text-left text-sm hover:bg-blue-50 transition-colors duration-150 flex items-center ${index === highlightedIndex ? 'bg-blue-50' : ''
                      } ${option.value === value ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}`}
                  >
                    {option.flag && <span className="mr-2">{option.flag}</span>}
                    <span className="truncate">{option.label}</span>
                    {option.value === value && (
                      <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

type BackgroundFormStep2Props = {
  courseOffered: string;
  certificateType: string;
  programmeLevel: 'Certificate' | 'Diploma' | 'Degree';
  fullName: string;
  phoneNumber: string;
  country: Country | null;
  school: School | null;
  schools: School[];
  updateFields: (fields: Partial<FormData>) => void;
}

export default function BackgroundFormStep2({
  courseOffered,
  certificateType,
  programmeLevel,
  fullName,
  phoneNumber,
  country,
  school,
  schools,
  updateFields
}: BackgroundFormStep2Props) {
  const [programTypes, setProgramTypes] = useState<ProgramType[]>([]);
  const [debouncedName, setDebouncedName] = useState(fullName);
  const [debouncedPhone, setDebouncedPhone] = useState(phoneNumber);

  // Refs to hold timeout IDs so we can clear them
  const nameTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const phoneTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (nameTimeoutRef.current) clearTimeout(nameTimeoutRef.current);
      if (phoneTimeoutRef.current) clearTimeout(phoneTimeoutRef.current);
    };
  }, []);

  // Debounced update for name field
  const handleNameChange = (value: string) => {
    setDebouncedName(value);

    // Clear existing timeout
    if (nameTimeoutRef.current) {
      clearTimeout(nameTimeoutRef.current);
    }

    // Set new timeout
    nameTimeoutRef.current = setTimeout(() => {
      updateFields({
        background: {
          courseOffered,
          certificateType,
          fullName: value,
          programmeLevel,
          phoneNumber: debouncedPhone, // Use current local phone
          country,
          school
        }
      });
    }, 500);
  };

  // Debounced update for phone number field
  const handlePhoneChange = (value: string) => {
    setDebouncedPhone(value);

    // Clear existing timeout
    if (phoneTimeoutRef.current) {
      clearTimeout(phoneTimeoutRef.current);
    }

    // Set new timeout
    phoneTimeoutRef.current = setTimeout(() => {
      updateFields({
        background: {
          courseOffered,
          certificateType,
          fullName: debouncedName, // Use current local name
          programmeLevel,
          phoneNumber: value,
          country,
          school
        }
      });
    }, 500);
  };

  // Update local state when props change (only if different to avoid cursor jumps)
  useEffect(() => {
    if (fullName !== debouncedName) {
      // Only update if the prop is significantly different (e.g. loaded from save)
      // We don't want to overwrite if the user is currently typing (which we can't easily detect here, 
      // but the debounce logic should prevent the loop)
      // A safer check is to only update if the local state is empty or we are sure it's an external update
      // For now, we'll trust the debounce to prevent race conditions
      setDebouncedName(fullName);
    }
  }, [fullName]);

  useEffect(() => {
    if (phoneNumber !== debouncedPhone) {
      setDebouncedPhone(phoneNumber);
    }
  }, [phoneNumber]);

  // Fetch program types on mount
  useEffect(() => {
    const loadProgramTypes = async () => {
      try {
        const types = await fetchProgramTypes();
        setProgramTypes(types);
      } catch (error) {
        console.error('Failed to load program types:', error);
      }
    };

    loadProgramTypes();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* School Selection */}
      <div className="space-y-1 sm:space-y-2">
        <label className="flex items-center text-xs font-medium text-gray-700">
          <Building2 className="w-4 h-4 mr-2 text-green-600" />
          <span className="text-xs">{country ? `Which school in ${country.name} do you want to apply to?` : 'Choose School'}</span>
        </label>
        <SearchableSelect
          options={schools.map(s => ({
            value: String(s.id),
            label: s.name
          }))}
          value={school ? String(school.id) : ''}
          onChange={(value) => {
            const selected = schools.find(s => String(s.id) === value) || null;
            updateFields({
              background: {
                courseOffered,
                certificateType,
                school: selected,
                programmeLevel,
                fullName: debouncedName,
                phoneNumber: debouncedPhone,
                country
              }
            });
          }}
          placeholder="Select school"
          disabled={!country}
          _required
          icon={<Building2 className="w-4 h-4 text-green-600" />}
        />
      </div>

      {/* Programme Level */}
      <div>
        <label className="flex items-center text-xs font-medium text-gray-700 mb-2">
          <Award className="w-4 h-4 mr-2 text-purple-600" />
          <span className="text-xs">What programme level do you want to pursue?</span>
        </label>
        <div className="grid grid-cols-3 gap-1 sm:gap-4">
          {programTypes.map(program => (
            <button
              key={program.id}
              type="button"
              onClick={() => updateFields({
                background: {
                  courseOffered,
                  certificateType,
                  programmeLevel: program.name as 'Certificate' | 'Diploma' | 'Degree',
                  fullName: debouncedName,
                  phoneNumber: debouncedPhone,
                  country,
                  school
                }
              })}
              className={`p-1 sm:p-2 border rounded-lg text-center text-xs ${programmeLevel === program.name
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-gray-300 hover:border-gray-400'
                }`}
            >
              {program.name}
            </button>
          ))}
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="flex items-center text-xs font-medium text-gray-700 mb-2">
          <User className="w-4 h-4 mr-2 text-teal-600" />
          <span className="text-xs">Full Name</span>
        </label>
        <input
          type="text"
          id="fullName"
          value={debouncedName}
          onChange={e => handleNameChange(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your full name"
        />
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phoneNumber" className="flex items-center text-xs font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4 mr-2 text-pink-600" />
          <span className="text-xs">Kindly share your active phone number</span>
        </label>
        <input
          type="tel"
          id="phoneNumber"
          value={debouncedPhone}
          onChange={e => handlePhoneChange(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your phone number"
          inputMode="tel"
        />
        <p className="text-xs text-gray-500 opacity-75 mt-1">SMS will be sent to this</p>
      </div>
    </div>
  );
}