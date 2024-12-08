import { useState } from 'react';
import { UserCircle, Bell, LogOut } from 'lucide-react';
import SearchBar from '../ui/SearchBar';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Header() {
  const { logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="h-20 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10">
      <div className="h-full px-8 flex items-center justify-between">
        <SearchBar />
        <div className="flex items-center gap-6">
          <button className="relative hover:bg-gray-100 p-2 rounded-full transition-colors">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="text-right">
                <p className="font-semibold text-gray-900">Kojo Antwi</p>
                <p className="text-sm text-gray-600">Student</p>
              </div>
              <UserCircle className="w-10 h-10 text-gray-700" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}