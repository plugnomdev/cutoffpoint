import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  History,
  Calculator,
  FileEdit,
  CheckCircle,
  ListChecks,
  Info,
  BarChart2
} from 'lucide-react';

const menuItems = [
  {
    title: 'Overview',
    href: '/app/overview',
    icon: LayoutDashboard
  },

  {
    title: 'Start Application',
    href: '/app/apply',
    icon: FileEdit
  },
  {
    title: 'Check Status',
    href: '/app/status',
    icon: CheckCircle
  },
  {
    title: 'Recommendations',
    href: '/app/recommendations',
    icon: ListChecks
  },
  {
    title: 'Update Info',
    href: '/app/update',
    icon: Info
  },
  {
    title: 'Performance',
    href: '/app/performance',
    icon: BarChart2
  }
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">CutoffPoint</h1>
            <p className="text-xs text-gray-500">Apply Easily & Informed!</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 py-6">
        <div className="px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center px-3 py-2.5 mb-1 rounded-lg text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-blue-100 hover:text-blue-700'
                  }`}
              >
                <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 
                  ${isActive ? 'text-blue-600' : 'text-gray-400 hover:scale-110'}`} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 mx-3 mb-6 rounded-lg bg-blue-50">
        <h3 className="text-sm font-medium text-blue-900 mb-1">Need Help?</h3>
        <p className="text-xs text-blue-700 mb-3">Contact our support team for assistance.</p>
        <a
          href="/support"
          className="text-xs font-medium text-blue-700 hover:text-blue-800 flex items-center"
        >
          Get Support →
        </a>
      </div>
    </aside>
  );
}