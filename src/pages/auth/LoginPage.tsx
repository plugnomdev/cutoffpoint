import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import PhoneInput from '../../components/auth/PhoneInput';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(phoneNumber);
    navigate('/verify', { state: { phoneNumber } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Left Section */}
      <div className="w-1/2 p-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-16">
            <GraduationCap className="w-10 h-10 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CutoffPoint</span>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to CutoffPoint
              </h1>
              <p className="text-gray-600">
                What's next? Enter your phone number to find out
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <PhoneInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                placeholder="023 4567 890"
              />
              <Button type="submit" fullWidth>
                Continue
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Section - Decorative */}
      <div className="w-1/2 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
        <div className="absolute bottom-8 right-8 w-24 h-24 opacity-20">
          <div className="w-full h-full border-4 border-gray-900 rotate-45" />
        </div>
        <div className="absolute top-8 left-8 w-24 h-24 opacity-20">
          <div className="w-full h-full border-4 border-gray-900 rotate-45" />
        </div>
      </div>
    </div>
  );
}