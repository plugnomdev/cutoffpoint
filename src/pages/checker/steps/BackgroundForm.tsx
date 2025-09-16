import { Country, School, CertificateType, ProgramType, Course, fetchCertificateTypes, fetchProgramTypes, fetchCourses } from '../../../services/api/universityApi';
import { FormData } from '../types';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Globe, Building2, Award, FileText, BookOpen, User, Phone, ChevronDown, Search, X } from 'lucide-react';

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
        className={`w-full p-2 text-left border rounded-lg bg-white transition-all duration-200 flex items-center justify-between ${
          disabled
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
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
          isOpen ? 'rotate-180' : ''
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
                    className={`w-full p-2 text-left text-sm hover:bg-blue-50 transition-colors duration-150 flex items-center ${
                      index === highlightedIndex ? 'bg-blue-50' : ''
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

type BackgroundFormProps = {
  courseOffered: string;
  programmeLevel: 'Certificate' | 'Diploma' | 'Degree';
  fullName: string;
  phoneNumber: string;
  country: Country | null;
  school: School | null;
  countries: Country[];
  schools: School[];
  updateFields: (fields: Partial<FormData>) => void;
  extractedName?: string;
  detectedCountry?: string;
  extractedCertificateType?: string;
  extractedCourseOffered?: string;
}

export default function BackgroundForm({
  courseOffered,
  programmeLevel,
  fullName,
  phoneNumber,
  country,
  school,
  countries,
  schools,
  updateFields,
  extractedName,
  detectedCountry,
  extractedCertificateType,
  extractedCourseOffered
}: BackgroundFormProps) {
  const location = useLocation();
  const [certificateTypes, setCertificateTypes] = useState<CertificateType[]>([]);
  const [certificateType, setCertificateType] = useState<string>('WASSCE');
  const [programTypes, setProgramTypes] = useState<ProgramType[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // Fetch certificate types on mount
  useEffect(() => {
    const loadCertificateTypes = async () => {
      try {
        const types = await fetchCertificateTypes();
        setCertificateTypes(types);
        if (types.length > 0) {
          setCertificateType(types[0].name);
        }
      } catch (error) {
        console.error('Failed to load certificate types:', error);
      }
    };

    loadCertificateTypes();
    
    // Load program types
    const loadProgramTypes = async () => {
      try {
        const types = await fetchProgramTypes();
        setProgramTypes(types);
      } catch (error) {
        console.error('Failed to load program types:', error);
      }
    };
    
    loadProgramTypes();

    // Load courses
    const loadCourses = async () => {
      try {
        const coursesData = await fetchCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error('Failed to load courses:', error);
      }
    };
    
    loadCourses();
  }, []);

  // Check for pre-filled data from homepage
  useEffect(() => {
    if (location.state?.country && location.state?.school) {
      updateFields({
        background: {
          courseOffered,
          certificateType: 'WASSCE',
          programmeLevel,
          fullName,
          phoneNumber,
          country: location.state.country,
          school: location.state.school
        }
      });
    }
  }, [location.state]);

  // Always ensure Ghana is selected as the default country
  useEffect(() => {
    if (countries.length > 0) {
      const ghanaCountry = countries.find(c => c.name.toLowerCase() === 'ghana');
      if (ghanaCountry && (!country || country.name.toLowerCase() !== 'ghana')) {
        updateFields({
          background: {
            courseOffered,
            certificateType: certificateType || extractedCertificateType || 'WASSCE',
            programmeLevel,
            fullName: extractedName || fullName,
            phoneNumber,
            country: ghanaCountry,
            school: null
          }
        });
      }
    }
  }, [countries, country]); // Only depend on countries and current country

  // Set defaults from extracted data
  useEffect(() => {
    if (countries.length === 0) return; // Wait for countries to load

    const backgroundUpdates: any = {
      courseOffered,
      certificateType: certificateType || extractedCertificateType || 'WASSCE',
      programmeLevel,
      fullName: extractedName || fullName,
      phoneNumber,
      country,
      school
    };

    let hasUpdates = false;

    if (extractedName && !fullName) {
      backgroundUpdates.fullName = extractedName;
      hasUpdates = true;
    }

    if (extractedCertificateType && !certificateType) {
      backgroundUpdates.certificateType = extractedCertificateType;
      hasUpdates = true;
    }

    // Match extracted course offered with API courses
    if (extractedCourseOffered && !courseOffered) {
      const matchedCourse = courses.find(course => {
        const courseName = course.name.toLowerCase();
        const extractedName = extractedCourseOffered.toLowerCase();

        // Exact match
        if (courseName === extractedName) return true;

        // Partial matches
        if (courseName.includes(extractedName) || extractedName.includes(courseName)) return true;

        // Handle common course variations
        const courseMappings = {
          'science': ['general science', 'integrated science', 'pure science', 'science'],
          'arts': ['arts', 'humanities', 'languages'],
          'business': ['business', 'commercial', 'accounting'],
          'technical': ['technical', 'vocational', 'industrial'],
          'agricultural': ['agricultural', 'agriculture', 'farming'],
          'home economics': ['home economics', 'home science', 'management in living']
        };

        // Check if extracted course matches any variation
        for (const [standardName, variations] of Object.entries(courseMappings)) {
          if (variations.some(v => extractedName.includes(v)) &&
              variations.some(v => courseName.includes(v))) {
            return true;
          }
        }

        return false;
      });

      if (matchedCourse) {
        backgroundUpdates.courseOffered = matchedCourse.name;
        hasUpdates = true;
      }
    }

    if (detectedCountry && country && country.name.toLowerCase() === 'ghana') {
      // Only update if different from Ghana
      const detectedCountryObj = countries.find(c => c.name.toLowerCase() === detectedCountry.toLowerCase());
      if (detectedCountryObj && detectedCountryObj.id !== country.id) {
        backgroundUpdates.country = detectedCountryObj;
        backgroundUpdates.school = null; // Reset school when country changes
        hasUpdates = true;
      }
    }

    if (hasUpdates) {
      updateFields({
        background: backgroundUpdates
      });
    }
  }, [extractedName, extractedCertificateType, extractedCourseOffered, detectedCountry, countries, courses, fullName, certificateType, courseOffered, country]);

  return (
    <div className="space-y-5">

      {/* AI-Extracted Info Summary */}
      {(extractedName || extractedCertificateType) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              {extractedCertificateType && (
                <>
                  <span className="font-medium text-green-800">Certificate Type:</span>
                  <span className="text-green-900">{certificateType || 'WASSCE'}</span>
                </>
              )}
            </div>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">AI Detected</span>
          </div>
        </div>
      )}

      {/* Country Selection */}
      <div className="space-y-2">
        <label className="flex items-center text-xs font-medium text-gray-700">
          <Globe className="w-4 h-4 mr-2 text-blue-600" />
          Which country do you want to school in?
        </label>
        <SearchableSelect
          options={countries.map(c => ({
            value: c.code,
            label: c.name,
            flag: c.flag
          }))}
          value={country ? country.code : (countries.find(c => c.name.toLowerCase() === 'ghana')?.code || '')}
          onChange={(value) => {
            const selected = countries.find(c => c.code === value) || null;
            updateFields({
              background: {
                courseOffered,
                certificateType: certificateType || 'WASSCE',
                programmeLevel,
                fullName,
                phoneNumber,
                country: selected,
                school: null
              }
            });
          }}
          placeholder="Select Country"
          _required
          icon={<Globe className="w-4 h-4 text-blue-600" />}
          showSelectedFlag={true}
        />
      </div>

      {/* Course Offered - Always visible, right after country */}
      <div className="space-y-2">
        <label className="flex items-center text-xs font-medium text-gray-700">
          <BookOpen className="w-4 h-4 mr-2 text-indigo-600" />
          <span className="text-xs">Which course did you study in SHS?</span>
        </label>
        <SearchableSelect
          options={courses.map(course => ({
            value: course.name,
            label: course.name
          }))}
          value={courseOffered}
          onChange={(value) => updateFields({
            background: {
              courseOffered: value,
              certificateType: certificateType || 'WASSCE',
              programmeLevel,
              fullName,
              phoneNumber,
              country,
              school
            }
          })}
          placeholder="Select Course"
          _required
          icon={<BookOpen className="w-4 h-4 text-indigo-600" />}
        />
      </div>

      {/* School Selection */}
      <div className="space-y-2">
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
                certificateType: certificateType || 'WASSCE',
                programmeLevel,
                fullName,
                phoneNumber,
                country,
                school: selected
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
        <div className="grid grid-cols-3 gap-4">
          {programTypes.map(program => (
            <button
              key={program.id}
              type="button"
              onClick={() => updateFields({ 
                background: { 
                  programmeLevel: program.name as 'Certificate' | 'Diploma' | 'Degree',
                  certificateType: certificateType || 'WASSCE',
                  courseOffered,
                  fullName,
                  phoneNumber,
                  country,
                  school
                } 
              })}
              className={`p-2 border rounded-lg text-center text-sm ${
                programmeLevel === program.name
                  ? 'border-blue-600 bg-blue-50 text-blue-600' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {program.name}
            </button>
          ))}
        </div>
      </div>

      {/* Certificate Type - Hidden when auto-detected */}
      {!extractedName && (
        <div className="space-y-2">
          <label className="flex items-center text-xs font-medium text-gray-700">
            <FileText className="w-4 h-4 mr-2 text-orange-600" />
            <span className="text-xs">Certificate Type</span>
          </label>
          <SearchableSelect
            options={certificateTypes.map(type => ({
              value: type.name,
              label: type.name
            }))}
            value={certificateType}
            onChange={(value) => {
              setCertificateType(value);
              updateFields({
                background: {
                  courseOffered,
                  certificateType: value,
                  programmeLevel,
                  fullName,
                  phoneNumber,
                  country,
                  school
                }
              });
            }}
            placeholder="Select Certificate Type"
            _required
            icon={<FileText className="w-4 h-4 text-orange-600" />}
          />
        </div>
      )}


      {/* Full Name - Hidden when extracted from AI */}
      {!extractedName && (
        <div>
          <label htmlFor="fullName" className="flex items-center text-xs font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 mr-2 text-teal-600" />
            <span className="text-xs">Full Name</span>
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={e => updateFields({
              background: {
                fullName: e.target.value,
                certificateType: certificateType || 'WASSCE',
                programmeLevel,
                courseOffered,
                phoneNumber,
                country,
                school
              }
            })}
            className="w-full p-2 border rounded-lg text-sm"
            placeholder="Enter your full name"
          />
        </div>
      )}

      {/* Phone Number */}
      <div>
        <label htmlFor="phoneNumber" className="flex items-center text-xs font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4 mr-2 text-pink-600" />
          <span className="text-xs">Kindly share your active phone number (SMS will be sent to this)</span>
        </label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={e => updateFields({ 
            background: { 
              phoneNumber: e.target.value,
              certificateType: certificateType || 'WASSCE',
              programmeLevel,
              courseOffered,
              fullName,
              country,
              school
            } 
          })}
          className="w-full p-3 border rounded-lg"
          placeholder="Enter your phone number"
        />
      </div>
    </div>
  );
}
