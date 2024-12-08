import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <GraduationCap className="w-8 h-8 text-blue-600" />
      <span className="text-xl font-bold">CutoffPoint</span>
    </Link>
  );
} 