import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { router } from './router';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;