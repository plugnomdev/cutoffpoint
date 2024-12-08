import Logo from '../ui/Logo';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

type CheckerLayoutProps = {
  children: React.ReactNode;
}

export default function CheckerLayout({ children }: CheckerLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between w-full">
        <Logo />
        <div className="space-x-4">
          <Link to="/checker" className="text-gray-600 hover:text-gray-900">
            Check Cutoff
          </Link>
          <Link to="/previous-checks" className="text-gray-600 hover:text-gray-900">
            Previous Checks
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-8">
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
              <Link to="/study-nigeria" className="text-gray-600 hover:text-gray-900 block mb-2">
                Study in Nigeria 🇳🇬
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
          <div className="mt-8 text-sm text-gray-500 border-t pt-4">
            Results on this platform do not guarantee admission.<br />
            Use this for analysis and planning only.
          </div>
        </div>
      </footer>
    </div>
  );
} 