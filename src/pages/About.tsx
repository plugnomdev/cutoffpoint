import { Helmet } from 'react-helmet-async';
import { GraduationCap, Target, Users, Globe, Lightbulb, Heart } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';

export default function About() {
  return (
    <MainLayout>
      <>
        <Helmet>
          <title>About CutoffPoint Africa | Leading EdTech Platform</title>
          <meta name="description" content="Learn about CutoffPoint Africa, the leading EdTech platform helping university applicants with structured information about grades and program options." />
        </Helmet>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-[#2d3192] via-[#3b3fb8] to-[#4a4fc6] py-16 sm:py-20 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              About <span className="text-yellow-300">CutoffPoint Africa</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Leading EdTech platform assisting university applicants with structured information about grades and program options
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Mission Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Making tertiary applications and admissions highly efficient and accurate for applicants across Africa
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="bg-[#2d3192]/10 p-3 rounded-lg mr-4">
                    <Target className="w-8 h-8 text-[#2d3192]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Platform</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  CutoffPoint Africa is a leading EdTech platform assisting university and other tertiary-cycle applicants with structured information about their grades and probable program options to match.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our AI-powered platform enables us to provide applicants with reliable guidance in their program selection and admission process.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="bg-[#2d3192]/10 p-3 rounded-lg mr-4">
                    <Heart className="w-8 h-8 text-[#2d3192]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Story</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Born in Ghana in the midst of uncertainty around tertiary applications with WASSCE results which affects over 400,000 applicants each year.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The same challenge exists in Sierra Leone, Nigeria, and other countries who offer WASSCE examinations.
                </p>
              </div>
            </div>
          </div>

          {/* Impact Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Serving students across West Africa with accurate, reliable information
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center border border-blue-200">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">400K+</h3>
                <p className="text-blue-700 font-medium">Annual Applicants</p>
                <p className="text-blue-600 text-sm mt-1">Helped each year</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center border border-green-200">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">4+</h3>
                <p className="text-green-700 font-medium">West African Countries</p>
                <p className="text-green-600 text-sm mt-1">Currently serving</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 text-center border border-purple-200 sm:col-span-2 lg:col-span-1">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-purple-900 mb-2">AI-Powered</h3>
                <p className="text-purple-700 font-medium">Smart Guidance</p>
                <p className="text-purple-600 text-sm mt-1">Reliable recommendations</p>
              </div>
            </div>
          </div>

          {/* Vision Section */}
          <div className="bg-gradient-to-r from-[#2d3192] to-[#4a4fc6] rounded-2xl p-8 lg:p-12 text-white text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg sm:text-xl leading-relaxed opacity-90">
                CutoffPoint Africa is on a journey to make tertiary applications and admissions highly efficient and accurate for applicants across West Africa. We believe that every student deserves clear, reliable information to make informed decisions about their future.
              </p>
              <div className="mt-8 pt-8 border-t border-white/20">
                <p className="text-base sm:text-lg font-medium">
                  "Empowering the next generation of African leaders through education"
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    </MainLayout>
  );
}