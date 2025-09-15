import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchCountries, Country } from '../services/api/universityApi';
import { School, fetchSchoolsByCountry } from '../services/api/universityApi';
import { Helmet } from 'react-helmet-async';

import MainLayout from '../components/layout/MainLayout';

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
      <div className="bg-blue-600 py-12 sm:py-20 relative flex items-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMinYMin meet">
            <defs>
              <pattern id="grid" patternUnits="userSpaceOnUse" width="20" height="20"> {/* Increased size */}
                <path d="M 20 0 L 20 100" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" /> {/* Reduced opacity */}
                <path d="M 0 20 L 100 20" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" /> {/* Reduced opacity */}
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
            <div className="text-white sm:pr-8 flex flex-col justify-center text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Match Your <span className="text-yellow-400">Results</span> to <br className="hidden sm:block" />
                 Great Programmes
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
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <div className="relative">
                    <select 
                      id="country"
                      className="w-full p-3 pl-12 border rounded-lg appearance-none bg-white cursor-pointer"
                      value={selectedCountry}
                      onChange={(e) => {
                        setSelectedCountry(e.target.value);
                        setSelectedSchool('');
                      }}
                      required
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    {selectedCountry && (
                      <span
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none"
                      >
                        {countries.find(c => c.code === selectedCountry)?.flag}
                      </span>
                    )}
                  </div>
                </div>

                {/* School Selection */}
                <div className="space-y-2">
                  <label htmlFor="school" className="block text-sm font-medium text-gray-700">
                    School
                  </label>
                  <select 
                    id="school"
                    className="w-full p-3 border rounded-lg cursor-pointer"
                    value={selectedSchool}
                    onChange={(e) => setSelectedSchool(e.target.value)}
                    disabled={!selectedCountry || loadingSchools}
                    required
                  >
                    <option value="">
                      {selectedCountry ? (loadingSchools ? 'Loading...' : 'Select School') : 'Select country first'}
                    </option>
                    {schoolError && (
                      <option value="" disabled>{schoolError}</option>
                    )}
                    {schools.map(school => (
                      <option key={school.id} value={school.id.toString()}>
                        {school.name}
                      </option>
                    ))}
                  </select>
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