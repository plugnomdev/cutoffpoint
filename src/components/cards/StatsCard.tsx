import { ArrowRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  href: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function StatsCard({ title, href, description, icon, className = '' }: StatsCardProps) {
  return (
    <a
      href={href}
      className={`group block p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {icon && <div className="mb-4 text-white/90">{icon}</div>}
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-white/90 leading-relaxed">{description}</p>
        </div>
        <ArrowRight className="w-6 h-6 text-white/50 group-hover:text-white/90 transition-colors" />
      </div>
    </a>
  );
}