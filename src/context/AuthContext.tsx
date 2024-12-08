import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (phoneNumber: string) => Promise<void>;
  verifyOtp: (phoneNumber: string, otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (phoneNumber: string) => {
    // Here you would typically make an API call to send OTP
    // For now, we'll just simulate the OTP sending
    console.log(`Sending OTP to ${phoneNumber}`);
    // Don't set isAuthenticated here, wait for OTP verification
  };

  const verifyOtp = async (phoneNumber: string, otp: string) => {
    // Here you would typically verify the OTP with your backend
    // For now, we'll just simulate a successful verification
    console.log(`Verifying OTP ${otp} for ${phoneNumber}`);
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}