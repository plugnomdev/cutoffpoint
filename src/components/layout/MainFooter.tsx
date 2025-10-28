import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function MainFooter() {
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');

  const handleMaintenanceClick = (pageName: string) => {
    setMaintenanceMessage(`${pageName} is currently under development. We're working hard to bring you this as soon as possible!`);
    setShowMaintenanceModal(true);
  };
  return (
    <footer className="bg-gray-50 py-6 border-t">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <button
              onClick={() => handleMaintenanceClick('University Cut-off Points')}
              className="text-gray-600 hover:text-gray-900 block mb-2 text-sm text-left w-full"
            >
              University Cut-off Points
            </button>
            <button
              onClick={() => handleMaintenanceClick('Programmes Overview')}
              className="text-gray-600 hover:text-gray-900 block mb-2 text-sm text-left w-full"
            >
              Programmes Overview
            </button>
          </div>
          <div>
            <Link to="/study-ghana" className="text-gray-600 hover:text-gray-900 block mb-2 text-sm">
              Study in Ghana 🇬🇭
            </Link>
          </div>
          <div>
            <button
              onClick={() => handleMaintenanceClick('Team')}
              className="text-gray-600 hover:text-gray-900 block mb-2 text-sm text-left w-full"
            >
              Team
            </button>
            <button
              onClick={() => handleMaintenanceClick('Partners')}
              className="text-gray-600 hover:text-gray-900 block mb-2 text-sm text-left w-full"
            >
              Partners
            </button>
          </div>
          <div>
            <Link to="/disclaimer" className="text-gray-600 hover:text-gray-900 block mb-2 text-sm">
              Disclaimer
            </Link>
            <Link to="/policy" className="text-gray-600 hover:text-gray-900 block mb-2 text-sm">
              Policy
            </Link>
          </div>
        </div>
        <div className="mt-6 text-xs text-gray-500 border-t pt-4 text-center">
          <p className="leading-relaxed">
            Results on this platform do not guarantee admission.<br />
            Use this for analysis and planning only.
          </p>
        </div>
      </div>

      {/* Maintenance Modal */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon!</h3>
              <p className="text-gray-600 mb-6">{maintenanceMessage}</p>
              <button
                onClick={() => setShowMaintenanceModal(false)}
                className="w-full bg-gradient-to-r from-[#2d3192] to-blue-600 text-white py-2 px-4 rounded-lg hover:from-[#252a7a] hover:to-blue-700 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}