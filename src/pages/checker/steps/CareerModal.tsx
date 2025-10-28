import { useState, useEffect } from 'react';
import { X, Briefcase, MapPin, Globe } from 'lucide-react';

interface CareerModalProps {
  isOpen: boolean;
  onClose: () => void;
  programName: string;
  result?: any; // Add result prop to access qualification data
}

interface CareerSummary {
  ghana: string;
  africa: string;
  global: string;
}

export default function CareerModal({ isOpen, onClose, programName, result }: CareerModalProps) {
  const [careerSummary, setCareerSummary] = useState<CareerSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && programName) {
      console.log('Modal opened for program:', programName);
      generateCareerSummary();
    }
  }, [isOpen, programName]);

  const generateCareerSummary = async () => {
    setLoading(true);
    setError(null);
    setCareerSummary(null); // Reset previous summary

    try {
      const contextInfo = result ? `
Student's academic profile:
- Total Score: ${result.summary?.total_score || 'N/A'}
- Core Score: ${result.summary?.core_score || 'N/A'}
- Elective Score: ${result.summary?.elective_score || 'N/A'}
- Qualified Programs: ${result.total_qualified || 0}
- Institution: ${result.school?.name || 'N/A'}
- Grades: Core subjects (${result.summary?.core_grades?.length || 0}), Elective subjects (${result.summary?.elective_grades?.length || 0})
` : '';

      const prompt = `Provide a concise career overview for someone with a degree in ${programName}. Include 3 sections: Ghana, Africa, and Global perspectives. Each section should be 2-3 sentences maximum, focusing on job opportunities, salary ranges, and growth potential. Keep it practical and useful for Ghanaian/African students.

${contextInfo}

Consider the student's academic performance and qualifications when providing career insights. Format as JSON with keys: "ghana", "africa", "global".`;

      console.log('Generating career summary for:', programName);

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', response.status, errorData);
        throw new Error(`Failed to generate career summary: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      const generatedText = data.candidates[0].content.parts[0].text;
      console.log('Generated text:', generatedText);

      // Parse the JSON response
      const summary = JSON.parse(generatedText);
      console.log('Parsed summary:', summary);
      setCareerSummary(summary);
    } catch (err) {
      console.error('Error generating career summary:', err);
      setError(`Failed to load career information: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 10000 }}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl" style={{ position: 'relative', zIndex: 10001 }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Briefcase className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Career Opportunities</h2>
                <p className="text-blue-100 text-sm">{programName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Generating career insights...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
              <button
                onClick={generateCareerSummary}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          )}

          {careerSummary && (
            <div className="space-y-6">
              {/* Ghana Section */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">Ghana</h3>
                </div>
                <p className="text-green-700 leading-relaxed">{careerSummary.ghana}</p>
              </div>

              {/* Africa Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-800">Africa</h3>
                </div>
                <p className="text-blue-700 leading-relaxed">{careerSummary.africa}</p>
              </div>

              {/* Global Section */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-purple-800">Global</h3>
                </div>
                <p className="text-purple-700 leading-relaxed">{careerSummary.global}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}