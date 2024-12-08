import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Logo from '../ui/Logo';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="w-64 bg-white border-r fixed h-full">
        <div className="p-6">
          <Logo />
        </div>
        <Sidebar />
      </div>
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-6 max-w-7xl mx-auto">
          <div className="mt-16">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}