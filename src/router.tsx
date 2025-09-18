import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

import OtpVerificationPage from './pages/auth/OtpVerificationPage';
import Overview from './pages/Overview';
import HomePage from './pages/HomePage';
import DashboardLayout from './components/layout/DashboardLayout';
import { useAuth } from './context/AuthContext';
import GradeChecker from './pages/checker/GradeChecker';
import PreviousChecks from './pages/checker/PreviousChecks';
import ResultsPage from './pages/checker/steps/ResultsPage';
import StudyGhana from './pages/StudyGhana';
import About from './pages/About';
import Disclaimer from './pages/Disclaimer';
import Policy from './pages/Policy';
import NotFound from './pages/NotFound';


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
  return <ResultsPage />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/study-ghana',
    element: <StudyGhana />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/disclaimer',
    element: <Disclaimer />
  },
  {
    path: '/policy',
    element: <Policy />
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
  },
  {
    path: '*',
    element: <NotFound />
  }
], {
  future: {
    // Opt into React Router v7 future behavior to suppress warnings
    // Note: Available flags may vary by React Router version
  },
});