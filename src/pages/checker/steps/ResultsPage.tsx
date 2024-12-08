import { useState } from 'react';
import { FormData } from '../GradeChecker';
import { useChecker } from '../CheckerContext';
import { CheckCircle, XCircle, AlertCircle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../../../components/ui/Button';

type ResultsPageProps = {
  formData: FormData;
}

// Helper function to convert grade to number
const gradeToNumber = (grade: string) => {
  const gradeMap: Record<string, number> = {
    'A1': 1, 'B2': 2, 'B3': 3, 'C4': 4, 'C5': 5, 'C6': 6, 'D7': 7, 'E8': 8, 'F9': 9
  };
  return gradeMap[grade] || 0;
};

// Update DEMO_PROGRAMS type and data
interface Program {
  name: string;
  code: string;
  faculty: string;
  duration: string;
  cutoff: number;
  acceptingApplications: boolean;
  requirements: {
    cores: Record<string, string>;
    electives: string[];
    minGrade: string;
  };
}

const DEMO_PROGRAMS: Program[] = [
  {
    name: 'Bachelor of Medicine and Surgery',
    code: 'MBChB',
    faculty: 'School of Medical Sciences',
    duration: '6 years',
    cutoff: 8,
    acceptingApplications: true,
    requirements: {
      cores: {
        english: 'C6',
        mathematics: 'C6',
        science: 'B3',
        social: 'C6'
      },
      electives: ['Biology', 'Chemistry', 'Physics'],
      minGrade: 'C6'
    }
  },
  {
    name: 'BSc. Computer Science',
    code: 'CSC',
    faculty: 'Faculty of Physical Sciences',
    duration: '4 years',
    cutoff: 12,
    acceptingApplications: false,
    requirements: {
      cores: {
        english: 'C6',
        mathematics: 'C6',
        science: 'C6',
        social: 'D7'
      },
      electives: ['Elective Mathematics', 'Physics'],
      minGrade: 'C6'
    }
  },
  // Add more programs as needed
];

// Add university data
const UNIVERSITIES = [
  {
    name: 'KNUST',
    location: 'Kumasi',
    acceptingApplications: true,
    qualifiedPrograms: 12
  },
  {
    name: 'University of Ghana',
    location: 'Accra',
    acceptingApplications: false,
    qualifiedPrograms: 8
  },
  // Add more universities
];

export default function ResultsPage({ formData }: ResultsPageProps) {
  const [expandedPrograms, setExpandedPrograms] = useState<string[]>([DEMO_PROGRAMS[0].code]);

  const toggleProgram = (code: string) => {
    setExpandedPrograms(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  // Calculate aggregate score (best 6 subjects including cores)
  const calculateAggregate = () => {
    const coreGrades = Object.values(formData.coreSubjects).map(gradeToNumber);
    const electiveGrades = Object.values(formData.electiveGrades).map(gradeToNumber);
    const allGrades = [...coreGrades, ...electiveGrades];
    const bestSix = allGrades.sort((a, b) => a - b).slice(0, 6);
    return bestSix.reduce((sum, grade) => sum + grade, 0);
  };

  const aggregate = calculateAggregate();

  // Check if a program's requirements are met
  const checkProgramRequirements = (program: typeof DEMO_PROGRAMS[0]) => {
    // Check core subject requirements
    const coresMet = Object.entries(program.requirements.cores).every(([subject, minGrade]) => {
      const studentGrade = formData.coreSubjects[subject as keyof typeof formData.coreSubjects];
      return gradeToNumber(studentGrade) <= gradeToNumber(minGrade);
    });

    // Check elective requirements
    const requiredElectivesMet = program.requirements.electives.every(subject => 
      formData.selectedElectives.includes(subject) && 
      gradeToNumber(formData.electiveGrades[subject]) <= gradeToNumber(program.requirements.minGrade)
    );

    // Check aggregate cutoff
    const aggregateMet = aggregate <= program.cutoff;

    return {
      qualified: coresMet && requiredElectivesMet && aggregateMet,
      coresMet,
      requiredElectivesMet,
      aggregateMet
    };
  };

  const ProgramCard = ({ program, requirements }: { program: Program, requirements: ReturnType<typeof checkProgramRequirements> }) => {
    const isExpanded = expandedPrograms.includes(program.code);
    
    return (
      <div 
        className={`border rounded-lg ${
          requirements.qualified ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
        }`}
      >
        {/* Header - Always visible */}
        <div 
          className="p-4 cursor-pointer hover:bg-opacity-50 transition-colors"
          onClick={() => toggleProgram(program.code)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div>
                <h4 className="font-medium text-gray-900">{program.name}</h4>
                <p className="text-sm text-gray-600">{program.faculty}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {requirements.qualified ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
          
          {/* Quick Info - Always visible */}
          <div className="flex gap-4 mt-2 text-sm text-gray-600">
            <span>Cutoff: {program.cutoff}</span>
            <span>•</span>
            <span>{program.duration}</span>
            <span>•</span>
            <span className={program.acceptingApplications ? 'text-green-600' : 'text-amber-600'}>
              {program.acceptingApplications ? 'Accepting Applications' : 'Applications Closed'}
            </span>
          </div>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="border-t p-4">
            <dl className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <dt className="text-gray-500">Program Code</dt>
                <dd className="font-medium text-gray-900">{program.code}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Duration</dt>
                <dd className="font-medium text-gray-900">{program.duration}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Cutoff Point</dt>
                <dd className="font-medium text-gray-900">{program.cutoff}</dd>
              </div>
            </dl>

            {/* Requirements Status */}
            <div className="space-y-2 text-sm mb-4">
              <div className={requirements.coresMet ? 'text-green-600' : 'text-red-500'}>
                {requirements.coresMet ? '✓' : '×'} Core subject requirements met
              </div>
              <div className={requirements.requiredElectivesMet ? 'text-green-600' : 'text-red-500'}>
                {requirements.requiredElectivesMet ? '✓' : '×'} Elective subject requirements met
              </div>
              <div className={requirements.aggregateMet ? 'text-green-600' : 'text-red-500'}>
                {requirements.aggregateMet ? '✓' : '×'} Aggregate cutoff requirement met
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <Button 
                variant="outline"
                onClick={() => window.open(`/programs/${program.code}`, '_blank')}
                className="flex items-center gap-2"
              >
                Read More
                <ArrowRight className="w-4 h-4" />
              </Button>
              
              {requirements.qualified && (
                <Button
                  disabled={!program.acceptingApplications}
                  onClick={() => window.open(`/apply/${program.code}`, '_blank')}
                >
                  Apply Now
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Actions */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2"
        >
          Check Another Programme
        </Button>
      </div>

      {/* Aggregate Score */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-blue-900">Your Results</h2>
        <div className="mt-4 flex items-center gap-4">
          <div className="text-4xl font-bold text-blue-600">{aggregate}</div>
          <div className="text-blue-700">
            <div className="font-medium">Aggregate Score</div>
            <div className="text-sm opacity-75">Based on your best 6 subjects</div>
          </div>
        </div>
      </div>

      {/* Advertisement Card */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Get Professional Guidance</h3>
        <p className="mb-4">
          Speak with our education counselors to make the best choice for your future.
        </p>
        <Button variant="secondary">
          Book a Consultation
        </Button>
      </div>

      {/* Program Qualifications */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Program Qualifications</h3>
        
        <div className="grid gap-4">
          {DEMO_PROGRAMS.map(program => (
            <ProgramCard
              key={program.code}
              program={program}
              requirements={checkProgramRequirements(program)}
            />
          ))}
        </div>
      </div>

      {/* Other Universities */}
      <div className="border rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Other Universities You Qualify For
        </h3>
        <div className="grid grid-cols-2 gap-6">
          {UNIVERSITIES.map(university => (
            <div 
              key={university.name}
              className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{university.name}</h4>
                  <p className="text-sm text-gray-600">{university.location}</p>
                </div>
                {university.acceptingApplications ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Accepting Applications
                  </span>
                ) : (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                    Applications Closed
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {university.qualifiedPrograms} Qualified Programs
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => window.open(`/universities/${university.name}`, '_blank')}
              >
                View Programs
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.print()}>
          Download Results
        </Button>
        <Button onClick={() => window.location.reload()}>
          Check Another Program
        </Button>
      </div>

      <div className="text-sm text-gray-500 border-t pt-4">
        Note: These results are based on the previous year's cutoff points and are for guidance only. 
        Final admission decisions are made by the institutions.
      </div>
    </div>
  );
} 