import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import OtpVerificationPage from './pages/auth/OtpVerificationPage';
import Overview from './pages/Overview';
import HomePage from './pages/HomePage';
import DashboardLayout from './components/layout/DashboardLayout';
import { useAuth } from './context/AuthContext';
import GradeChecker from './pages/checker/GradeChecker';
import PreviousChecks from './pages/checker/PreviousChecks';
import ResultsPage from './pages/checker/steps/ResultsPage';

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
}

function PublicRoute() {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/app/overview" replace />;
  }
  
  return <Outlet />;
}

// Create a wrapper component to handle the formData
function ResultsPageWrapper() {
  // You can get formData from URL state or localStorage
  const formData = JSON.parse(localStorage.getItem('formData') || '{}');
  return <ResultsPage formData={formData} />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/login',
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <LoginPage />
      }
    ]
  },
  {
    path: '/verify',
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <OtpVerificationPage />
      }
    ]
  },
  {
    path: '/checker',
    element: <GradeChecker />,
  },
  {
    path: '/checker/results/:id',
    element: <ResultsPageWrapper />,
  },
  {
    path: '/previous-checks',
    element: <PreviousChecks />
  },
  {
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: 'overview',
            element: <Overview />
          },
          {
            path: 'previous-checks',
            element: <PreviousChecks />
          }
        ]
      }
    ]
  }
]); 