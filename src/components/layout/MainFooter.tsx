import { Link } from 'react-router-dom';

export default function MainFooter() {
  return (
    <footer className="bg-gray-50 py-6 border-t">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <Link to="/cutoff-points" className="text-gray-600 hover:text-gray-900 block mb-2 text-sm">
              University Cut-off Points
            </Link>
            <Link to="/programs" className="text-gray-600 hover:text-gray-900 block mb-2 text-sm">
              Programmes Overview
            </Link>
          </div>
          <div>
            <Link to="/study-ghana" className="text-gray-600 hover:text-gray-900 block mb-2 text-sm">
              Study in Ghana 🇬🇭
            </Link>
          </div>
          <div>
            <Link to="/team" className="text-gray-600 hover:text-gray-900 block mb-2 text-sm">
              Team
            </Link>
            <Link to="/partners" className="text-gray-600 hover:text-gray-900 block mb-2 text-sm">
              Partners
            </Link>
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
    </footer>
  );
}