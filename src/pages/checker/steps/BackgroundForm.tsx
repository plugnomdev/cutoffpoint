import { FormData } from '../GradeChecker';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

type BackgroundFormProps = FormData['background'] & {
  updateFields: (fields: Partial<FormData>) => void;
}

const COURSE_OPTIONS = [
  'General Arts',
  'General Science',
  'Business',
  'Visual Arts',
  'Home Economics',
  'Agricultural Science',
  'Technical'
];

const PROGRAMME_LEVELS = [
  'Certificate',
  'Diploma',
  'Degree'
] as const;

const COUNTRIES = [
  { code: 'GH', name: 'Ghana', flag: 'https://flagcdn.com/gh.svg' },
  { code: 'NG', name: 'Nigeria', flag: 'https://flagcdn.com/ng.svg' }
];

const SCHOOLS = {
  GH: [
    'KNUST',
    'University of Ghana',
    'University of Cape Coast',
    'Ashesi University'
  ],
  NG: [
    'University of Lagos',
    'University of Ibadan',
    'Covenant University'
  ]
};

export default function BackgroundForm({
  courseOffered,
  programmeLevel,
  fullName,
  phoneNumber,
  school,
  country,
  updateFields
}: BackgroundFormProps) {
  const location = useLocation();

  // Check for pre-filled data from homepage
  useEffect(() => {
    if (location.state?.country && location.state?.school) {
      updateFields({
        background: {
          courseOffered,
          programmeLevel,
          fullName,
          phoneNumber,
          country: location.state.country,
          school: location.state.school
        }
      });
    }
  }, [location.state]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Background Information</h2>

      {/* Country Selection */}
      <div className="space-y-2">
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <div className="relative">
          <select 
            id="country"
            className="w-full p-3 pl-12 border rounded-lg appearance-none bg-white cursor-pointer"
            value={country}
            onChange={e => updateFields({ 
              background: { 
                courseOffered,
                certificateType: 'WASSCE',
                programmeLevel,
                fullName,
                phoneNumber,
                country: e.target.value,
                school: ''
              } 
            })}
            required
          >
            <option value="">Select Country</option>
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          {country && (
            <img 
              src={COUNTRIES.find(c => c.code === country)?.flag}
              alt="Country flag"
              className="w-6 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          )}
        </div>
      </div>

      {/* School Selection */}
      <div className="space-y-2">
        <label htmlFor="school" className="block text-sm font-medium text-gray-700">
          School
        </label>
        <select 
          id="school"
          className="w-full p-3 border rounded-lg cursor-pointer"
          value={school}
          onChange={e => updateFields({ 
            background: { 
              courseOffered,
              certificateType: 'WASSCE',
              programmeLevel,
              fullName,
              phoneNumber,
              country,
              school: e.target.value
            } 
          })}
          disabled={!country}
          required
        >
          <option value="">
            {country ? 'Select School' : 'Select country first'}
          </option>
          {country && SCHOOLS[country as keyof typeof SCHOOLS]?.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Programme Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Programme Level
        </label>
        <div className="grid grid-cols-3 gap-4">
          {PROGRAMME_LEVELS.map(level => (
            <button
              key={level}
              type="button"
              onClick={() => updateFields({ 
                background: { 
                  programmeLevel: level,
                  certificateType: 'WASSCE',
                  courseOffered,
                  fullName,
                  phoneNumber,
                  country,
                  school
                } 
              })}
              className={`p-3 border rounded-lg text-center ${
                programmeLevel === level 
                  ? 'border-blue-600 bg-blue-50 text-blue-600' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Course Offered */}
      <div>
        <label htmlFor="courseOffered" className="block text-sm font-medium text-gray-700 mb-2">
          Course Offered in SHS
        </label>
        <select
          id="courseOffered"
          value={courseOffered}
          onChange={e => updateFields({ 
            background: { 
              courseOffered: e.target.value,
              certificateType: 'WASSCE',
              programmeLevel,
              fullName,
              phoneNumber,
              country,
              school
            } 
          })}
          className="w-full p-3 border rounded-lg"
          required
        >
          <option value="">Select Course</option>
          {COURSE_OPTIONS.map(course => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          value={fullName}
          onChange={e => updateFields({ 
            background: { 
              fullName: e.target.value,
              certificateType: 'WASSCE',
              programmeLevel,
              courseOffered,
              phoneNumber,
              country,
              school
            } 
          })}
          className="w-full p-3 border rounded-lg"
          placeholder="Enter your full name"
          required
        />
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={e => updateFields({ 
            background: { 
              phoneNumber: e.target.value,
              certificateType: 'WASSCE',
              programmeLevel,
              courseOffered,
              fullName,
              country,
              school
            } 
          })}
          className="w-full p-3 border rounded-lg"
          placeholder="Enter your phone number"
          required
        />
      </div>
    </div>
  );
} 