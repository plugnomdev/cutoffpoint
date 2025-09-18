import { Helmet } from 'react-helmet-async';
import { AlertTriangle, Info } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';

export default function Disclaimer() {
  return (
    <MainLayout>
      <>
        <Helmet>
          <title>Disclaimer | CutoffPoint Africa</title>
          <meta name="description" content="Important disclaimer information for using CutoffPoint Africa services." />
        </Helmet>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-[#2d3192] via-[#3b3fb8] to-[#4a4fc6] py-16 sm:py-20">
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                <AlertTriangle className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Disclaimer
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Important information about our services and limitations
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 lg:p-12">
            <div className="prose prose-lg max-w-none">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-yellow-800 text-sm font-medium">
                    Please read this disclaimer carefully before using our services.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Accuracy</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                CutoffPoint Africa strives to provide accurate and up-to-date information regarding university admissions, cutoff points, and program requirements. However, we cannot guarantee the absolute accuracy of all information provided.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Guarantee of Admission</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Our platform provides guidance and information to help you make informed decisions about your educational choices. However, we do not guarantee admission to any university or program. Admission decisions are made solely by the respective institutions.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Responsibility</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Users are responsible for verifying all information independently. We recommend consulting directly with universities and relevant authorities for the most current and accurate information. You should not rely solely on our platform for making important educational decisions.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Limitations</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Our services are provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service. While we use reasonable efforts to maintain the accuracy of our information, circumstances beyond our control may affect the timeliness and accuracy of the data provided.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Grade Checker Tool</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                The grade checker tool provides estimates based on available data and algorithms. Results are for informational purposes only and should not be considered as official admission decisions. Actual admission requirements may vary and change without notice.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">External Links</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Our platform may contain links to external websites. We are not responsible for the content, accuracy, or practices of these external sites. Visiting external links is at your own risk.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                If you have any questions about this disclaimer or our services, please contact us through the appropriate channels provided on our platform.
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-8">
                <p className="text-gray-600 text-sm">
                  <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    </MainLayout>
  );
}