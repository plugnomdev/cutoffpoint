import { Clock, School, ArrowRight, Filter, Search, Loader, X, ChevronUp, ChevronDown } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { Helmet } from 'react-helmet-async';
import { fetchPastCheck, fetchCountries, fetchSchoolsByCountry, Country, School as SchoolType } from '../../services/api/universityApi';

// Define the type for previous checks from API
interface PreviousCheck {
  check_code: string;
  index_number: string;
  phone_number: string;
  date: string;
  payment_status: string;
  summary: {
    total_score: number;
    core_score: number;
    elective_score: number;
    core_grades: number[];
    elective_grades: number[];
  };
  qualified_programs: Array<{
    id: number;
    name: string;
    description: string;
    max_grade: number;
    link: string;
    apply_link: string;
  }>;
  total_qualified: number;
  school: {
    id: number;
    name: string;
  };
}

// Dynamic filter options from API
export default function PreviousChecks() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<Country[]>([]);
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [previousChecks, setPreviousChecks] = useState<PreviousCheck[]>([]);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    school: '',
    country: ''
  });
  const [showSearch, setShowSearch] = useState(true);

  // Fetch countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoadingFilters(true);
        const countriesData = await fetchCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      } finally {
        setLoadingFilters(false);
      }
    };
    loadCountries();
  }, []);

  // Fetch schools when country changes
  useEffect(() => {
    const loadSchools = async () => {
      if (filters.country) {
        const selectedCountry = countries.find(c => c.name === filters.country);
        if (selectedCountry) {
          try {
            setLoadingFilters(true);
            const schoolsData = await fetchSchoolsByCountry(selectedCountry.id);
            setSchools(schoolsData || []);
          } catch (error) {
            console.error('Failed to fetch schools:', error);
            setSchools([]);
          } finally {
            setLoadingFilters(false);
          }
        }
      } else {
        setSchools([]);
      }
    };
    loadSchools();
  }, [filters.country, countries]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setError('');

    try {
      // Determine if input is phone or code
      const isPhone = searchInput.startsWith('+') || /^\d{10,}$/.test(searchInput);
      const response = await fetchPastCheck(isPhone ? undefined : searchInput, isPhone ? searchInput : undefined);

      if (response.success && response.data) {
        setPreviousChecks([response.data]);
        setHasSearched(true);
      } else {
        setError('No checks found for this number. Please verify and try again.');
        setPreviousChecks([]);
      }
    } catch (err) {
      setError('Failed to fetch past checks. Please try again.');
      setPreviousChecks([]);
    }

    setIsSearching(false);
  };

  // Filter the checks based on selected filters
  const filteredChecks = previousChecks.filter(check => {
    if (filters.school && check.school.name !== filters.school) return false;
    // Add country filter when data includes country
    return true;
  });

  const clearFilters = () => {
    setFilters({
      school: '',
      country: ''
    });
  };

  // Clear school filter when country changes
  const handleCountryChange = (countryName: string) => {
    setFilters(prev => ({
      ...prev,
      country: countryName,
      school: '' // Clear school when country changes
    }));
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
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="space-y-6 sm:space-y-8">
            {/* Search Section */}
            <div className="bg-white rounded-lg shadow-sm">
              {/* Search Header - Always visible */}
              <div 
                className="p-4 sm:p-6 flex justify-between items-center cursor-pointer"
                onClick={() => setShowSearch(!showSearch)}
              >
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Find Your Previous Checks
                  </h2>
                  {!showSearch && hasSearched && (
                    <p className="text-sm text-gray-500 mt-1">
                      Click to search with a different number
                    </p>
                  )}
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  {showSearch ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Search Form - Collapsible */}
              {showSearch && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t">
                  <p className="text-gray-500 mt-4 mb-4 sm:mb-6">
                    Enter your phone number or check code to view your previous checks
                  </p>
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter phone number or check code"
                            required
                          />
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        disabled={isSearching}
                        className="w-full sm:w-32 flex items-center justify-center"
                      >
                        {isSearching ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin mr-2" />
                            Searching...
                          </>
                        ) : (
                          'Search'
                        )}
                      </Button>
                    </div>
                    {error && (
                      <div className="text-red-600 text-sm">
                        {error}
                      </div>
                    )}
                  </form>
                </div>
              )}
            </div>

            {hasSearched && previousChecks.length > 0 ? (
              <>
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Previous Checks</h1>
                    <p className="text-gray-500 mt-1">View and compare your previous program qualification checks</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2 w-full sm:w-auto justify-center"
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        <Filter className="w-4 h-4" />
                        Filter
                        {(filters.school || filters.country) && (
                          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                            {Object.values(filters).filter(Boolean).length}
                          </span>
                        )}
                      </Button>

                      {/* Filter Panel */}
                      {showFilters && (
                        <div className="absolute right-0 sm:top-12 w-full sm:w-72 bg-white rounded-lg shadow-lg border p-4 z-10 mt-2 sm:mt-0">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-gray-900">Filters</h3>
                            {(filters.school || filters.country) && (
                              <button
                                onClick={clearFilters}
                                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                              >
                                <X className="w-4 h-4" />
                                Clear all
                              </button>
                            )}
                          </div>
                          
                          {/* School Filter */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              School
                            </label>
                            <select
                              value={filters.school}
                              onChange={(e) => setFilters(prev => ({ ...prev, school: e.target.value }))}
                              className="w-full p-2 border rounded-lg text-sm"
                              disabled={loadingFilters}
                            >
                              <option value="">
                                {loadingFilters ? 'Loading schools...' : 'All Schools'}
                              </option>
                              {schools.map(school => (
                                <option key={school.id} value={school.name}>
                                  {school.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Country Filter */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country
                            </label>
                            <select
                              value={filters.country}
                              onChange={(e) => handleCountryChange(e.target.value)}
                              className="w-full p-2 border rounded-lg text-sm"
                              disabled={loadingFilters}
                            >
                              <option value="">
                                {loadingFilters ? 'Loading countries...' : 'All Countries'}
                              </option>
                              {countries.map(country => (
                                <option key={country.id} value={country.name}>
                                  {country.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Applied Filters */}
                          {(filters.school || filters.country) && (
                            <div className="border-t pt-3 mt-3">
                              <div className="text-sm text-gray-500 mb-2">Applied Filters:</div>
                              <div className="flex flex-wrap gap-2">
                                {filters.school && (
                                  <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm">
                                    {filters.school}
                                    <button 
                                      onClick={() => setFilters(prev => ({ ...prev, school: '' }))}
                                      className="hover:text-blue-900"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                                {filters.country && (
                                  <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm">
                                    {filters.country}
                                    <button 
                                      onClick={() => setFilters(prev => ({ ...prev, country: '' }))}
                                      className="hover:text-blue-900"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => navigate('/checker')}
                      className="w-full sm:w-auto"
                    >
                      New Check
                    </Button>
                  </div>
                </div>

                {/* Stats Overview */}
                <div className="flex flex-row sm:grid sm:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto pb-2 sm:pb-0">
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm min-w-[160px] sm:min-w-0">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1">Total Checks</div>
                    <div className="text-lg sm:text-2xl font-bold text-gray-900">{previousChecks.length}</div>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm min-w-[160px] sm:min-w-0">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1">Qualified Schools</div>
                    <div className="text-lg sm:text-2xl font-bold text-green-600">
                      {previousChecks.filter(check => check.total_qualified > 0).length}
                    </div>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm min-w-[160px] sm:min-w-0">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1">Best Aggregate</div>
                    <div className="text-lg sm:text-2xl font-bold text-blue-600">
                      {Math.min(...previousChecks.map(check => check.summary.total_score))}
                    </div>
                  </div>
                </div>

                {/* Checks List */}
                <div className="bg-white rounded-lg shadow-sm divide-y">
                  {filteredChecks.map((check) => {
                    const isQualified = check.total_qualified > 0;
                    const status = isQualified ? 'Qualified' : 'Not Qualified';
                    const minCutoff = check.qualified_programs.length > 0 ? Math.min(...check.qualified_programs.map(p => p.max_grade)) : 'N/A';

                    return (
                      <div
                        key={check.check_code}
                        className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(check.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <School className="w-5 h-5 text-blue-600" />
                              <span className="font-medium text-lg">{check.school.name}</span>
                            </div>
                            <div className="text-gray-600">
                              {isQualified
                                ? `You qualified for ${check.total_qualified} programmes in this school`
                                : `You did not qualify for any programmes in this school`
                              }
                            </div>
                          </div>
                          <div className="text-left sm:text-right space-y-3">
                            <div className="flex sm:justify-end">
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                isQualified
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {status}
                              </div>
                            </div>
                            <div className="flex items-center sm:justify-end gap-4 sm:gap-8">
                              <div>
                                <div className="text-sm text-gray-500">Your Aggregate</div>
                                <div className="text-lg font-bold text-gray-900">{check.summary.total_score}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Minimum Cutoff Point</div>
                                <div className="text-lg font-bold text-gray-900">{minCutoff}</div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              className={`flex items-center gap-2 w-full sm:w-auto justify-center ${
                                !isQualified ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              onClick={() => {
                                if (isQualified) {
                                  navigate(`/checker/results/${check.check_code}`);
                                }
                              }}
                              disabled={!isQualified}
                            >
                              View Programmes
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : hasSearched && previousChecks.length > 0 && filteredChecks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg mt-4">
                <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Matching Results</h3>
                <p className="text-gray-500 mb-4">
                  No checks match your current filters.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Enter Your Details</h3>
                <p className="text-gray-500">
                  Search using your phone number or check code to view your previous checks
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 