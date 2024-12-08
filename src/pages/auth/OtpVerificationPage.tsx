import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, login } = useAuth();
  const phoneNumber = location.state?.phoneNumber;

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyOtp(phoneNumber, otp);
    navigate('/app/overview');
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    await login(phoneNumber);
    setCountdown(30);
    setCanResend(false);
    setOtp('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <div className="w-1/2 p-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="flex items-center gap-2 mb-16">
            <GraduationCap className="w-10 h-10 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CutoffPoint</span>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Verify your phone
              </h1>
              <p className="text-gray-600">
                We sent a verification code to {phoneNumber}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter verification code"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={6}
              />
              <Button type="submit" fullWidth>
                Verify
              </Button>
            </form>

            <div className="text-center">
              <button
                onClick={handleResendOtp}
                disabled={!canResend}
                className={`text-sm ${
                  canResend
                    ? 'text-blue-600 hover:text-blue-700 cursor-pointer'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                {canResend ? (
                  'Resend verification code'
                ) : (
                  `Resend code in ${countdown}s`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

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