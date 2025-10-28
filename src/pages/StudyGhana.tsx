import { Helmet } from 'react-helmet-async';
import { GraduationCap, ArrowRight, MapPin, Users, BookOpen, DollarSign, Building, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/ui/Button';
import MainLayout from '../components/layout/MainLayout';

const navItems = [
  { id: 'about', label: 'About Ghana', icon: MapPin },
  { id: 'universities', label: 'Universities', icon: Building },
  { id: 'requirements', label: 'Requirements', icon: BookOpen },
  { id: 'fees', label: 'Fees & Costs', icon: DollarSign },
];

export default function StudyGhana() {
  const [activeSection, setActiveSection] = useState('about');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <MainLayout>
      <>
        <Helmet>
          <title>Study in Ghana - Over 12 Major Universities</title>
          <meta name="description" content="World-class education in Africa's most stable democracy." />
          <meta property="og:title" content="Study in Ghana - Over 12 Major Universities" />
          <meta property="og:description" content="World-class education in Africa's most stable democracy." />
          <meta property="og:image" content="https://schoolfinder.tortoisepath.com/wp-content/uploads/2024/07/University-of-Ghana-Legon-Accra-Ghana-SchoolFinder-TortoisePathcom-8.jpeg" />
          <meta property="og:url" content="https://cutoffpoint.africa/study-ghana" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Study in Ghana - Over 12 Major Universities" />
          <meta name="twitter:description" content="World-class education in Africa's most stable democracy." />
          <meta name="twitter:image" content="https://schoolfinder.tortoisepath.com/wp-content/uploads/2024/07/University-of-Ghana-Legon-Accra-Ghana-SchoolFinder-TortoisePathcom-8.jpeg" />
          <meta name="keywords" content="study in Ghana, universities in Ghana, Ghana education, African universities, international students Ghana, University of Ghana, KNUST, Ashesi University" />
        </Helmet>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-[#2d3192] via-[#3b3fb8] to-[#4a4fc6] overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <div className="lg:col-span-6 text-center lg:text-left space-y-4 sm:space-y-6">
                <div className="space-y-2 sm:space-y-3">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight" id="main-heading">
                    Study in <span className="text-yellow-300 font-extrabold">Ghana</span>
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-white/80 max-w-xl leading-relaxed px-4 sm:px-0">
                    World-class education in Africa's most stable democracy
                  </p>
                </div>

                <div className="px-4 sm:px-0">
                  {/* Mobile: Stacked and centered */}
                  <div className="flex flex-col gap-3 lg:hidden">
                    <div className="flex justify-center">
                      <button
                        onClick={() => window.location.href = '/checker'}
                        className="bg-green-500 text-white hover:bg-green-600 transition-all duration-200 shadow-lg px-6 py-3 text-sm sm:text-base font-medium rounded-lg group inline-flex items-center justify-center w-full max-w-xs"
                      >
                        <span className="whitespace-nowrap">Check Eligibility</span>
                        <ArrowRight className="w-4 h-4 ml-2 text-white group-hover:translate-x-0.5 transition-transform duration-200 flex-shrink-0" />
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => scrollToSection('about')}
                        className="border border-white/40 text-white/90 hover:bg-white/10 transition-all duration-200 px-6 py-3 text-sm sm:text-base font-medium rounded-lg w-full max-w-xs flex items-center justify-center"
                      >
                        <span className="whitespace-nowrap">About Ghana</span>
                      </button>
                    </div>
                  </div>

                  {/* Desktop: Side by side */}
                  <div className="hidden lg:flex gap-3 justify-start">
                    <button
                      onClick={() => window.location.href = '/checker'}
                      className="bg-green-500 text-white hover:bg-green-600 transition-all duration-200 shadow-lg px-6 py-3 text-base font-medium rounded-lg group inline-flex items-center justify-center"
                    >
                      <span className="whitespace-nowrap">Check Eligibility</span>
                      <ArrowRight className="w-4 h-4 ml-2 text-white group-hover:translate-x-0.5 transition-transform duration-200 flex-shrink-0" />
                    </button>
                    <button
                      onClick={() => scrollToSection('about')}
                      className="border border-white/40 text-white/90 hover:bg-white/10 transition-all duration-200 px-6 py-3 text-base font-medium rounded-lg flex items-center justify-center"
                    >
                      <span className="whitespace-nowrap">About Ghana</span>
                    </button>
                  </div>
                </div>

                {/* Minimal Stats */}
                <div className="flex justify-center lg:justify-start gap-4 sm:gap-6 lg:gap-8 pt-4 px-4 sm:px-0">
                  <div className="text-center">
                    <div className="text-lg sm:text-xl lg:text-xl font-bold text-white">12+</div>
                    <div className="text-[10px] sm:text-sm lg:text-xs text-white/60 uppercase tracking-wider font-medium leading-tight">Major Universities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl lg:text-xl font-bold text-white">32M+</div>
                    <div className="text-[10px] sm:text-sm lg:text-xs text-white/60 uppercase tracking-wider font-medium leading-tight">Population</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl lg:text-xl font-bold text-white">3K$</div>
                    <div className="text-[10px] sm:text-sm lg:text-xs text-white/60 uppercase tracking-wider font-medium leading-tight">AVERAGE TUITION</div>
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="lg:col-span-6 relative mt-8 lg:mt-0">
                <div className="relative max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
                  {/* Main Image */}
                  <div className="relative">
                    <img
                      src="https://schoolfinder.tortoisepath.com/wp-content/uploads/2024/07/University-of-Ghana-Legon-Accra-Ghana-SchoolFinder-TortoisePathcom-8.jpeg"
                      alt="University of Ghana campus"
                      className="w-full h-[280px] sm:h-[320px] lg:h-[450px] object-cover rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl transform hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl lg:rounded-3xl"></div>
                  </div>

                  {/* Floating Cards - Hidden on mobile, shown on larger screens */}
                  <div className="hidden sm:block absolute -top-4 -left-4 lg:-top-6 lg:-left-6 bg-white/95 backdrop-blur-lg rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-xl border border-white/20 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs lg:text-sm font-semibold text-gray-900">Safe Environment</div>
                        <div className="text-xs text-gray-600">Peaceful & Stable</div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:block absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 bg-white/95 backdrop-blur-lg rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-xl border border-white/20 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs lg:text-sm font-semibold text-gray-900">Quality Education</div>
                        <div className="text-xs text-gray-600">World-Class Standards</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-12">
            {/* Mobile Navigation Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center justify-center w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="w-5 h-5 mr-2" />
                <span className="font-medium text-sm">Quick Navigation</span>
              </button>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
                <div className="absolute top-0 left-0 w-full max-w-sm h-full bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-bold text-gray-900 text-lg">Quick Navigation</h3>
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                        aria-label="Close navigation menu"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <nav className="space-y-2">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              scrollToSection(item.id);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full text-left px-5 py-4 rounded-xl flex items-center transition-all duration-200 ${
                              activeSection === item.id
                                ? 'bg-[#2d3192] text-white shadow-lg'
                                : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
                            }`}
                            aria-label={`Navigate to ${item.label} section`}
                          >
                            <Icon className="w-5 h-5 mr-4" />
                            <span className="font-medium text-base">{item.label}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Navigation */}
            <div className="hidden lg:block lg:w-64 flex-shrink-0">
              <div className="sticky top-8 bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                <h3 className="font-semibold text-gray-900 mb-6 text-lg">Quick Navigation</h3>
                <nav className="space-y-3">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-all duration-200 group ${
                          activeSection === item.id
                            ? 'bg-[#2d3192] text-white shadow-md'
                            : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                        }`}
                        aria-label={`Navigate to ${item.label} section`}
                      >
                        <Icon className={`w-5 h-5 mr-4 transition-colors ${
                          activeSection === item.id ? 'text-white' : 'text-[#2d3192] group-hover:text-[#2d3192]'
                        }`} />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* About Ghana */}
              <section id="about" className="mb-8 sm:mb-12 lg:mb-16 scroll-mt-8">
                <div className="flex items-center mb-6 sm:mb-8">
                  <div className="bg-gradient-to-br from-[#2d3192] to-[#4a4fc6] p-3 sm:p-4 rounded-xl sm:rounded-2xl mr-4 sm:mr-6 shadow-lg">
                    <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">About Ghana</h2>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600">Your gateway to world-class education in West Africa</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg">
                  <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                          <span className="bg-[#2d3192] text-white rounded-lg p-2 mr-3">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                          </span>
                          Why Study in Ghana?
                        </h3>
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex items-start p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                            <div className="bg-green-100 text-green-700 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-bold mr-3 sm:mr-4 mt-0.5 text-sm">✓</div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Safe & Stable Environment</h4>
                              <p className="text-gray-600 text-xs sm:text-sm">Peaceful democracy with excellent infrastructure</p>
                            </div>
                          </div>
                          <div className="flex items-start p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                            <div className="bg-blue-100 text-blue-700 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-bold mr-3 sm:mr-4 mt-0.5 text-sm">✓</div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">English-Speaking Country</h4>
                              <p className="text-gray-600 text-xs sm:text-sm">No language barriers for international students</p>
                            </div>
                          </div>
                          <div className="flex items-start p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                            <div className="bg-purple-100 text-purple-700 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-bold mr-3 sm:mr-4 mt-0.5 text-sm">✓</div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Affordable Education</h4>
                              <p className="text-gray-600 text-xs sm:text-sm">Quality education at competitive costs</p>
                            </div>
                          </div>
                          <div className="flex items-start p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                            <div className="bg-orange-100 text-orange-700 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-bold mr-3 sm:mr-4 mt-0.5 text-sm">✓</div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Rich Cultural Experience</h4>
                              <p className="text-gray-600 text-xs sm:text-sm">Diverse traditions and welcoming communities</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                          <span className="bg-[#2d3192] text-white rounded-lg p-2 mr-3">
                            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                          </span>
                          Quick Facts
                        </h3>
                        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                          <div className="grid grid-cols-2 gap-4 sm:gap-6">
                            <div className="text-center">
                              <div className="text-2xl sm:text-3xl font-bold text-[#2d3192] mb-1 sm:mb-2">32M</div>
                              <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">Population</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl sm:text-3xl font-bold text-[#2d3192] mb-1 sm:mb-2">Accra</div>
                              <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">Capital</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl sm:text-3xl font-bold text-[#2d3192] mb-1 sm:mb-2">🇬🇭</div>
                              <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">Country</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl sm:text-3xl font-bold text-[#2d3192] mb-1 sm:mb-2">EN</div>
                              <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">Language</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-[#2d3192] to-[#4a4fc6] rounded-lg sm:rounded-xl p-4 sm:p-6 text-white">
                        <h4 className="font-bold mb-2 text-sm sm:text-base">🌟 Did You Know?</h4>
                        <p className="text-xs sm:text-sm opacity-90">
                          Ghana is Africa's first sub-Saharan country to gain independence and has been a stable democracy since 1992.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Universities */}
              <section id="universities" className="mb-8 sm:mb-12 lg:mb-16 scroll-mt-8">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#2d3192]/10 p-3 rounded-lg mr-4">
                    <Building className="w-8 h-8 text-[#2d3192]" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Top Universities</h2>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Leading institutions for higher education</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center mb-3">
                      <div className="bg-[#2d3192]/10 p-2 rounded-lg mr-3">
                        <GraduationCap className="w-5 h-5 text-[#2d3192]" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">University of Ghana</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Premier university in Accra with programmes in Medicine, Law, and Business</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center mb-3">
                      <div className="bg-[#2d3192]/10 p-2 rounded-lg mr-3">
                        <GraduationCap className="w-5 h-5 text-[#2d3192]" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">KNUST</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Leading science and technology university in Kumasi</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center mb-3">
                      <div className="bg-[#2d3192]/10 p-2 rounded-lg mr-3">
                        <GraduationCap className="w-5 h-5 text-[#2d3192]" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">University of Cape Coast</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Excellent programmes in Education, Arts, and Sciences</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center mb-3">
                      <div className="bg-[#2d3192]/10 p-2 rounded-lg mr-3">
                        <GraduationCap className="w-5 h-5 text-[#2d3192]" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">Ashesi University</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Liberal arts and business programmes with innovative approach</p>
                  </div>
                </div>
              </section>

              {/* Requirements */}
              <section id="requirements" className="mb-8 sm:mb-12 lg:mb-16 scroll-mt-8">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#2d3192]/10 p-3 rounded-lg mr-4">
                    <BookOpen className="w-8 h-8 text-[#2d3192]" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Admission Requirements</h2>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">What you need to study in Ghana</p>
                  </div>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center mb-4 sm:mb-6">
                      <div className="bg-green-100 p-3 rounded-lg mr-4">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">For Local Students</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-3 sm:space-y-4">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Academic Requirements</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start">
                            <span className="bg-[#2d3192]/10 text-[#2d3192] rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">✓</span>
                            <span className="text-sm">WASSCE Certificate (Grades A1-C6)</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-[#2d3192]/10 text-[#2d3192] rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">✓</span>
                            <span className="text-sm">Minimum aggregate score of 24</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-[#2d3192]/10 text-[#2d3192] rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">✓</span>
                            <span className="text-sm">English Language and Mathematics</span>
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Documents Needed</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start">
                            <span className="bg-[#2d3192]/10 text-[#2d3192] rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">✓</span>
                            <span className="text-sm">Birth Certificate</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-[#2d3192]/10 text-[#2d3192] rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">✓</span>
                            <span className="text-sm">Passport-size photographs</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-[#2d3192]/10 text-[#2d3192] rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">✓</span>
                            <span className="text-sm">Application fee payment</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center mb-4 sm:mb-6">
                      <div className="bg-blue-100 p-3 rounded-lg mr-4">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">For International Students</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-3 sm:space-y-4">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Academic Requirements</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start">
                            <span className="bg-[#2d3192]/10 text-[#2d3192] rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">✓</span>
                            <span className="text-sm">Equivalent of WASSCE or high school diploma</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-[#2d3192]/10 text-[#2d3192] rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">✓</span>
                            <span className="text-sm">English proficiency (TOEFL/IELTS if required)</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-[#2d3192]/10 text-[#2d3192] rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">✓</span>
                            <span className="text-sm">Minimum grade requirements vary by programme</span>
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Additional Documents</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start">
                            <span className="bg-[#2d3192]/10 text-[#2d3192] rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">✓</span>
                            <span className="text-sm">Passport and visa</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-[#2d3192]/10 text-[#2d3192] rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">✓</span>
                            <span className="text-sm">Health insurance</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-[#2d3192]/10 text-[#2d3192] rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">✓</span>
                            <span className="text-sm">Financial proof for visa</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Fees & Costs */}
              <section id="fees" className="mb-8 sm:mb-12 lg:mb-16 scroll-mt-8">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#2d3192]/10 p-3 rounded-lg mr-4">
                    <DollarSign className="w-8 h-8 text-[#2d3192]" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Fees & Costs</h2>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Affordable quality education</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
                    <div className="flex items-center mb-4 sm:mb-6">
                      <div className="bg-green-100 p-3 rounded-lg mr-3">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-green-900">Local Students</h3>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-white/70 rounded-lg p-3">
                        <div className="text-xs sm:text-sm text-green-700 font-medium mb-1">Tuition (Undergraduate)</div>
                        <div className="text-lg sm:text-xl font-bold text-green-800">₵1,500 - ₵5,000</div>
                        <div className="text-xs text-green-600">per year</div>
                      </div>
                      <div className="bg-white/70 rounded-lg p-3">
                        <div className="text-xs sm:text-sm text-green-700 font-medium mb-1">Accommodation</div>
                        <div className="text-lg sm:text-xl font-bold text-green-800">₵1,000 - ₵3,000</div>
                        <div className="text-xs text-green-600">per year</div>
                      </div>
                      <div className="bg-white/70 rounded-lg p-3">
                        <div className="text-xs sm:text-sm text-green-700 font-medium mb-1">Application Fee</div>
                        <div className="text-lg sm:text-xl font-bold text-green-800">₵200 - ₵500</div>
                        <div className="text-xs text-green-600">one-time</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
                    <div className="flex items-center mb-4 sm:mb-6">
                      <div className="bg-blue-100 p-3 rounded-lg mr-3">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-blue-900">International Students</h3>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-white/70 rounded-lg p-3">
                        <div className="text-xs sm:text-sm text-blue-700 font-medium mb-1">Tuition (Undergraduate)</div>
                        <div className="text-lg sm:text-xl font-bold text-blue-800">$3,000 - $8,000</div>
                        <div className="text-xs text-blue-600">per year</div>
                      </div>
                      <div className="bg-white/70 rounded-lg p-3">
                        <div className="text-xs sm:text-sm text-blue-700 font-medium mb-1">Accommodation</div>
                        <div className="text-lg sm:text-xl font-bold text-blue-800">$1,000 - $3,000</div>
                        <div className="text-xs text-blue-600">per year</div>
                      </div>
                      <div className="bg-white/70 rounded-lg p-3">
                        <div className="text-xs sm:text-sm text-blue-700 font-medium mb-1">Application Fee</div>
                        <div className="text-lg sm:text-xl font-bold text-blue-800">$100 - $300</div>
                        <div className="text-xs text-blue-600">one-time</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <p className="text-blue-800 text-xs sm:text-sm">
                    <strong>Note:</strong> Costs vary by university and programme. Medicine and specialized programmes may have higher fees.
                    Additional costs include health insurance, books, and living expenses.
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gray-50 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Ready to Start Your Journey?</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
              Check which Ghanaian universities and programmes you qualify for with our AI-powered admission checker
            </p>
            <Link to="/checker">
              <Button size="lg" className="bg-green-500 text-white hover:bg-green-600 transition-all duration-200 shadow-lg px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold rounded-lg inline-flex items-center w-full sm:w-auto">
                <span className="whitespace-nowrap">Check Your Eligibility Now</span>
                <ArrowRight className="w-5 h-5 ml-2 flex-shrink-0" />
              </Button>
            </Link>
          </div>
        </div>
      </>
    </MainLayout>
  );
}
