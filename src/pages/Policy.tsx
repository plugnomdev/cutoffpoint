import { Helmet } from 'react-helmet-async';
import { Shield, Lock, FileText } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';

export default function Policy() {
  return (
    <MainLayout>
      <>
        <Helmet>
          <title>Privacy Policy & Terms | CutoffPoint Africa</title>
          <meta name="description" content="Privacy policy and terms of service for CutoffPoint Africa platform." />
        </Helmet>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-[#2d3192] via-[#3b3fb8] to-[#4a4fc6] py-16 sm:py-20">
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                <Shield className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Privacy Policy & Terms
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              How we protect your data and our terms of service
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Privacy Policy Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 lg:p-12 mb-8">
            <div className="flex items-center mb-8">
              <div className="bg-[#2d3192]/10 p-3 rounded-lg mr-4">
                <Lock className="w-8 h-8 text-[#2d3192]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Privacy Policy</h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Information We Collect</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, use our grade checker tool, or contact us for support. This may include your name, email address, and educational information.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">How We Use Your Information</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Security</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Sharing</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Rights</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                You have the right to access, update, or delete your personal information. You may also opt out of receiving promotional communications from us by following the instructions in those communications.
              </p>
            </div>
          </div>

          {/* Terms of Service Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 lg:p-12">
            <div className="flex items-center mb-8">
              <div className="bg-[#2d3192]/10 p-3 rounded-lg mr-4">
                <FileText className="w-8 h-8 text-[#2d3192]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Terms of Service</h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                By accessing and using CutoffPoint Africa, you accept and agree to be bound by the terms and provision of this agreement.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Use License</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Permission is granted to temporarily access the materials on our platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">User Responsibilities</h3>
              <ul className="text-gray-700 mb-6 space-y-2">
                <li>• Provide accurate and complete information</li>
                <li>• Use the service for lawful purposes only</li>
                <li>• Not to interfere with or disrupt the service</li>
                <li>• Respect the intellectual property rights of others</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Service Availability</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We strive to provide continuous service but do not guarantee that our platform will be available at all times. We reserve the right to modify or discontinue our services with or without notice.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Limitation of Liability</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                In no event shall CutoffPoint Africa be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our services.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                If you have any questions about these Terms of Service or Privacy Policy, please contact us through the appropriate channels provided on our platform.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-8">
            <p className="text-gray-600 text-sm text-center">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </>
    </MainLayout>
  );
}