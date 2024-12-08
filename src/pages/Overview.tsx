import { Sparkles, GraduationCap } from 'lucide-react';
import StatsCard from '../components/cards/StatsCard';
import UniversityCard from '../components/cards/UniversityCard';

const universities = [
  {
    name: 'University of Cape Coast',
    location: 'Cape Coast, Ghana',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3',
    studentCount: 74000,
    programCount: 145,
    acceptingApplications: true,
  },
  {
    name: 'University of Ghana',
    location: 'Accra, Ghana',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3',
    studentCount: 38000,
    programCount: 98,
    acceptingApplications: true,
  },
  {
    name: 'Academic City University',
    location: 'Accra, Ghana',
    imageUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?ixlib=rb-4.0.3',
    studentCount: 12000,
    programCount: 42,
    acceptingApplications: false,
  },
  {
    name: 'Lancaster University',
    location: 'Accra, Ghana',
    imageUrl: 'https://images.unsplash.com/photo-1574958269340-fa927503f3dd?ixlib=rb-4.0.3',
    studentCount: 15000,
    programCount: 56,
    acceptingApplications: true,
  },
  {
    name: 'Ashesi University',
    location: 'Berekuso, Ghana',
    imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-4.0.3',
    studentCount: 8500,
    programCount: 32,
    acceptingApplications: true,
  },
  {
    name: 'KNUST',
    location: 'Kumasi, Ghana',
    imageUrl: 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?ixlib=rb-4.0.3',
    studentCount: 42000,
    programCount: 120,
    acceptingApplications: true,
  },
];

export default function Overview() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <StatsCard
          title="Personalized Recommendations"
          href="/recommendations"
          description="Update your academic profile to get tailored university recommendations"
          icon={<Sparkles className="w-6 h-6" />}
          className="bg-gradient-to-br from-purple-600 to-blue-600"
        />
        <StatsCard
          title="Open Admissions"
          href="/apply"
          description="5 universities are currently accepting applications for 2024"
          icon={<GraduationCap className="w-6 h-6" />}
          className="bg-gradient-to-br from-blue-600 to-cyan-600"
        />
      </div>

      <section className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Featured Universities</h2>
            <p className="text-sm text-gray-500 mt-1">Discover top universities accepting applications</p>
          </div>
          <a href="/universities" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View all universities →
          </a>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {universities.map((university) => (
            <UniversityCard
              key={university.name}
              {...university}
              onApply={() => console.log(`Applying to ${university.name}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}