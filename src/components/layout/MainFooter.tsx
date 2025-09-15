import { Link } from 'react-router-dom';

export default function MainFooter() {
  return (
    <footer className="bg-gray-50 py-8 border-t">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <Link to="/cutoff-points" className="text-gray-600 hover:text-gray-900 block mb-2">
              University Cut-off Points
            </Link>
            <Link to="/programs" className="text-gray-600 hover:text-gray-900 block mb-2">
              Programmes Overview
            </Link>
          </div>
          <div>
            <Link to="/study-ghana" className="text-gray-600 hover:text-gray-900 block mb-2">
              Study in Ghana 🇬🇭
            </Link>
          </div>
          <div>
            <Link to="/team" className="text-gray-600 hover:text-gray-900 block mb-2">
              Team
            </Link>
            <Link to="/partners" className="text-gray-600 hover:text-gray-900 block mb-2">
              Partners
            </Link>
          </div>
          <div>
            <Link to="/disclaimer" className="text-gray-600 hover:text-gray-900 block mb-2">
              Disclaimer
            </Link>
            <Link to="/policy" className="text-gray-600 hover:text-gray-900 block mb-2">
              Policy
            </Link>
          </div>
        </div>
        <div className="mt-8 text-sm text-gray-500 border-t pt-4 text-center sm:text-left">
          Results on this platform do not guarantee admission.<br className="hidden sm:block" />
          Use this for analysis and planning only.
        </div>
      </div>
    </footer>
  );
} 