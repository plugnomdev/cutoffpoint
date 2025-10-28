import { MessageCircle, ExternalLink } from 'lucide-react';

interface AdBannerProps {
  title: string;
  description: string;
  requirements?: string;
  ctaText: string;
  ctaLink: string;
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

export default function AdBanner({
  title,
  description,
  requirements,
  ctaText,
  ctaLink,
  variant = 'horizontal',
  className = ''
}: AdBannerProps) {
  const isHorizontal = variant === 'horizontal';

  return (
    <div className={`bg-white border-2 border-dashed border-blue-300 rounded-xl overflow-hidden shadow-sm ${className}`}>
      <div className={`${isHorizontal ? 'p-4 sm:p-6' : 'p-4'}`}>
        <div className={`${isHorizontal ? 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4' : 'space-y-3'}`}>
          {/* Content */}
          <div className={`${isHorizontal ? 'flex-1' : ''}`}>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-2">
              {description}
            </p>
            {requirements && (
              <p className="text-blue-600 text-xs sm:text-sm leading-relaxed font-medium">
                {requirements}
              </p>
            )}
          </div>

          {/* CTA Button */}
          <div className={`${isHorizontal ? 'flex-shrink-0' : ''}`}>
            <a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {ctaText}
              <ExternalLink className="w-3 h-3 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}