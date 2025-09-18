import { Helmet } from 'react-helmet-async';
import { Home, Search, ArrowRight, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

export default function NotFound() {
  return (
    <MainLayout>
      <>
        <Helmet>
          <title>Page Not Found | CutoffPoint Africa</title>
          <meta name="description" content="The page you're looking for doesn't exist. Check your eligibility for Ghanaian universities instead!" />
        </Helmet>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-[#2d3192] via-[#3b3fb8] to-[#4a4fc6] py-20 sm:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-6">
                <Search className="w-16 h-16 text-white" />
              </div>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-4 opacity-90">
              404
            </h1>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              Page Not Found
            </h2>

            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              The page you're looking for doesn't exist. But don't worry - let's help you find the right path to your educational goals!
            </p>

            {/* Primary CTA - Eligibility Checker */}
            <div className="mb-8">
              <Link to="/checker">
                <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center group">
                  <GraduationCap className="w-5 h-5 mr-3" />
                  Check Your Eligibility
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </Link>
            </div>

            {/* Secondary Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/">
                <button className="border border-white/40 text-white/90 hover:bg-white/10 px-6 py-3 text-base font-medium rounded-lg transition-all duration-200 inline-flex items-center">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </button>
              </Link>
              <Link to="/study-ghana">
                <button className="border border-white/40 text-white/90 hover:bg-white/10 px-6 py-3 text-base font-medium rounded-lg transition-all duration-200 inline-flex items-center">
                  Study in Ghana
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              What would you like to do instead?
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/checker" className="group">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <div className="bg-[#2d3192]/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2d3192]/20 transition-colors">
                    <GraduationCap className="w-6 h-6 text-[#2d3192]" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Check Eligibility</h4>
                  <p className="text-gray-600 text-sm">Find out which universities you qualify for</p>
                </div>
              </Link>

              <Link to="/study-ghana" className="group">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <div className="bg-[#2d3192]/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2d3192]/20 transition-colors">
                    <Search className="w-6 h-6 text-[#2d3192]" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Study in Ghana</h4>
                  <p className="text-gray-600 text-sm">Learn about universities and requirements</p>
                </div>
              </Link>

              <Link to="/about" className="group">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <div className="bg-[#2d3192]/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2d3192]/20 transition-colors">
                    <Home className="w-6 h-6 text-[#2d3192]" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">About Us</h4>
                  <p className="text-gray-600 text-sm">Learn about CutoffPoint Africa</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </>
    </MainLayout>
  );
}