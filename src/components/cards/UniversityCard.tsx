import Badge from '../ui/Badge';
import { MapPin, Users, GraduationCap } from 'lucide-react';

interface UniversityCardProps {
  name: string;
  location: string;
  imageUrl: string;
  studentCount: number;
  programCount: number;
  acceptingApplications: boolean;
  onApply: () => void;
}

export default function UniversityCard({
  name,
  location,
  imageUrl,
  studentCount,
  programCount,
  acceptingApplications,
  onApply
}: UniversityCardProps) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative h-40">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {acceptingApplications && (
          <div className="absolute top-3 right-3">
            <Badge variant="success">Accepting Applications</Badge>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-1.5" />
            <span className="text-sm">{studentCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <GraduationCap className="w-4 h-4 mr-1.5" />
            <span className="text-sm">{programCount} Programs</span>
          </div>
        </div>
        <button
          onClick={onApply}
          className="w-full py-2.5 px-4 bg-[#2d3192] text-white rounded-lg font-medium text-sm
                   hover:bg-blue-700 active:bg-blue-800 transition-colors
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}