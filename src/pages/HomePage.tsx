import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchCountries, Country } from '../services/api/universityApi';
import { School, fetchSchoolsByCountry } from '../services/api/universityApi';
import { Helmet } from 'react-helmet-async';
import { Globe, Building2, ChevronDown, Search, X } from 'lucide-react';

import MainLayout from '../components/layout/MainLayout';

// Modern Searchable Select Component
interface SearchableSelectProps {
  options: Array<{ value: string; label: string; flag?: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  showSelectedFlag?: boolean;
}

function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
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
  const displayPlaceholder = required ? `${placeholder} *` : placeholder;

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
        className={`w-full p-3 pl-8 border rounded-lg bg-white transition-all duration-200 flex items-center justify-between ${
          disabled
            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
            : 'hover:border-[#2d3192]/50 focus:border-[#2d3192] focus:ring-2 focus:ring-[#2d3192]/20'
        } ${isOpen ? 'border-[#2d3192] ring-2 ring-[#2d3192]/20' : 'border-gray-300'}`}
      >
        <div className="flex items-center flex-1 min-w-0">
          {/* Show selected country's flag or default icon */}
          {selectedOption && showSelectedFlag && selectedOption.flag ? (
            <span className="mr-2 flex-shrink-0 text-lg leading-none">{selectedOption.flag}</span>
          ) : (
            icon && <span className="mr-2 flex-shrink-0 text-[#2d3192]">{icon}</span>
          )}
          <span className={`truncate ${!selectedOption ? 'text-gray-500' : 'text-gray-900'}`}>
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
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#2d3192]"
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
                    className={`w-full p-3 text-left hover:bg-[#2d3192]/5 transition-colors duration-150 flex items-center ${
                      index === highlightedIndex ? 'bg-[#2d3192]/5' : ''
                    } ${option.value === value ? 'bg-[#2d3192]/10 text-[#2d3192] font-medium' : 'text-gray-900'}`}
                  >
                    {option.flag && <span className="mr-2 leading-none">{option.flag}</span>}
                    <span className="truncate">{option.label}</span>
                    {option.value === value && (
                      <div className="ml-auto w-2 h-2 bg-[#2d3192] rounded-full"></div>
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

export default function HomePage() {

  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');

  const [countries, setCountries] = useState<Country[]>([]);


  const [schools, setSchools] = useState<School[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [schoolError, setSchoolError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch countries from API
        const apiCountries = await fetchCountries();
        setCountries(apiCountries);
        // Try to auto-detect country as before
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        // Try to match detected country code with API country code
        const detectedCode = data.country ? data.country.toUpperCase() : null;
        const found = apiCountries.find(c => c.code.toUpperCase() === detectedCode);
        setSelectedCountry(found ? found.code : (apiCountries[0]?.code || ''));
        setSelectedSchool('');
      } catch (error) {
        console.error('Error fetching country or countries:', error);
        setSelectedCountry(countries[0]?.code || '');
      }
    };
    fetchInitialData();
  }, []);

  // Fetch schools when selectedCountry changes
  useEffect(() => {
    const fetchSchools = async () => {
      setLoadingSchools(true);
      setSchoolError(null);
      setSchools([]);
      setSelectedSchool('');
      const countryObj = countries.find(c => c.code === selectedCountry);
      if (!selectedCountry || !countryObj) {
        setLoadingSchools(false);
        return;
      }
      try {
        const schoolsData = await fetchSchoolsByCountry(countryObj.id);
        setSchools(schoolsData);
      } catch (err: any) {
        setSchoolError(err.message || 'Failed to fetch schools');
      } finally {
        setLoadingSchools(false);
      }
    };
    if (selectedCountry) {
      fetchSchools();
    }
  }, [selectedCountry, countries]);

  const handleContinue = () => {
    if (!selectedCountry || !selectedSchool) return;
    const countryObj = countries.find(c => c.code === selectedCountry);
    const schoolObj = schools.find(s => s.id === Number(selectedSchool));
    if (!countryObj || !schoolObj) return;
    navigate('/checker', {
      state: {
        country: countryObj,
        school: schoolObj
      }
    });
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Check WASSCE Cut-off Points for Various Programmes in Ghana and Africa - CutoffPoint.Africa</title>
        <meta name="title" content="Check WASSCE Cut-off Points for Various Programmes in Ghana and Africa - CutoffPoint.Africa" />
        <meta name="description" content="Add your grades and check the list of programmes you qualify for in Legon, UCC, KNUST, Nursing, and Teacher Training Colleges in Ghana." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cutoffpoint.africa/" />
        <meta property="og:title" content="Check WASSCE Cut-off Points for Various Programmes in Ghana and Africa - CutoffPoint.Africa" />
        <meta property="og:description" content="Add your grades and check the list of programmes you qualify for in Legon, UCC, KNUST, Nursing, and Teacher Training Colleges in Ghana." />
        <meta property="og:image" content="https://learninghana.com/wp-content/uploads/2022/09/cutoff-01.jpg" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://cutoffpoint.com.gh/" />
        <meta property="twitter:title" content="Find Best Programmes in Legon, KNUST, UCC and more - CutoffPoint.Africa" />
        <meta property="twitter:description" content="Add your grades and check the list of programmes you qualify for in Legon, UCC, KNUST, Nursing, and Teacher Training Colleges in Ghana." />
        <meta property="twitter:image" content="https://learninghana.com/wp-content/uploads/2022/09/cutoff-01.jpg" />
        <meta name="keywords" content="legon cutoff point, ucc cutoff point, knust cutoff point" />
      </Helmet>
      {/* Hero Section - Full viewport height */}
      <div className="bg-[#2d3192] py-12 sm:py-20 relative flex items-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMinYMin meet">
            <defs>
              <pattern id="grid" patternUnits="userSpaceOnUse" width="20" height="20"> {/* Increased size */}
                <path d="M 20 0 L 20 100" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" /> {/* Further reduced opacity */}
                <path d="M 0 20 L 100 20" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" /> {/* Further reduced opacity */}
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
            <div className="text-white sm:pr-8 flex flex-col justify-center text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Match Your <span className="text-[#fbc024]">Results</span> to <br className="hidden sm:block" />
                 Great <span className="text-[#fbc024]">Programmes</span>
              </h1>
              <p className="text-lg sm:text-xl mb-4">
                Check your options before you submit your application
              </p>
              <p className="text-base sm:text-lg opacity-80">
                For WASSCE Holders & High Schoolers
              </p>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-md mx-auto sm:mx-0 w-full">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleContinue();
                }}
                className="space-y-6"
              >
                <h2 className="text-lg font-medium flex items-center gap-2">
                  Start here 👇🏾
                </h2>

                {/* Country Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <SearchableSelect
                    options={countries.map(country => ({
                      value: country.code,
                      label: country.name,
                      flag: country.flag
                    }))}
                    value={selectedCountry}
                    onChange={(value) => {
                      setSelectedCountry(value);
                      setSelectedSchool('');
                    }}
                    placeholder="Select Country"
                    required
                    icon={<Globe className="w-4 h-4" />}
                    showSelectedFlag={true}
                  />
                </div>

                {/* School Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    School
                  </label>
                  <SearchableSelect
                    options={schools.map(school => ({
                      value: school.id.toString(),
                      label: school.name
                    }))}
                    value={selectedSchool}
                    onChange={setSelectedSchool}
                    placeholder={selectedCountry ? (loadingSchools ? 'Loading...' : 'Select School') : 'Select country first'}
                    disabled={!selectedCountry || loadingSchools}
                    required
                    icon={<Building2 className="w-4 h-4" />}
                  />
                  {schoolError && (
                    <p className="text-sm text-red-600 mt-1">{schoolError}</p>
                  )}
                </div>

                <Button 
                  type="submit"
                  fullWidth
                  disabled={!selectedCountry || !selectedSchool}
                >
                  Continue
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition Section - Commented out to keep page full height */}
      {/*
      <div className="py-12 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-16">
            Transforming how <span className="text-blue-600">African</span> students<br className="hidden sm:block" />
            access higher education
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="border border-blue-600 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">
                For <span className="text-blue-600">Applicants</span>
              </h3>
              <p className="text-gray-600 mb-8">
                Students can access the platform on any device, and apply to multiple institutions
                without the hassle of submitting each application individually.
              </p>
              <div className="space-y-4">
                <Button>Create Account</Button>
                <p className="text-sm text-gray-500">Register as a student or applicant</p>
              </div>
            </div>

            <div className="border border-blue-600 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">
                For <span className="text-blue-600">Institutions</span>
              </h3>
              <p className="text-gray-600 mb-8">
                CutoffPoint offers a streamlined admissions process, reducing administrative workloads
                and increasing access to a diverse pool of applicants from across the continent.
              </p>
              <div className="space-y-4">
                <Button>Create Account</Button>
                <p className="text-sm text-gray-500">Register as an institution</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      */}
      </MainLayout>
  );
}