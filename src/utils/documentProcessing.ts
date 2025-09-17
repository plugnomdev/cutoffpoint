import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source to local file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';

export interface ParsedDocumentData {
  extractedSubjects: Array<{
    name: string;
    grade: string;
  }>;
  studentInfo: {
    name?: string;
    certificateType?: string;
  };
  rawText: string;
}

// AI-powered parsing using Google Gemini API
async function parseWithAI(text: string): Promise<ParsedDocumentData> {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const prompt = `Extract student information, course offered, and grades from this WASSCE results document. Return ONLY a valid JSON object with this exact structure:

{
  "studentInfo": {
    "name": "string or null",
    "certificateType": "WASSCE or SSSCE or GBCE or null"
  },
  "courseOffered": "Science or Arts or Business or Technical or Agricultural or null",
  "extractedSubjects": [
    {
      "name": "subject name",
      "grade": "A1 or B2 or B3 or C4 or C5 or C6 or D7 or E8 or F9"
    }
  ]
}

Look for the course/program offered (like Science, Arts, Business, etc.) in the document. Document text:
${text}

Return ONLY the JSON object, no explanations or additional text.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
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
          temperature: 0.1,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid Gemini API response');
    }

    const generatedText = data.candidates[0].content.parts[0].text;

    // Clean the response - remove markdown code blocks if present
    let cleanText = generatedText.trim();

    // Remove markdown code blocks (```json ... ``` or ``` ... ```)
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Extract JSON from the cleaned text
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Gemini response');
    }

    const parsedData = JSON.parse(jsonMatch[0]);

    // Validate the response structure
    if (!parsedData.studentInfo || !Array.isArray(parsedData.extractedSubjects)) {
      throw new Error('Invalid response structure from Gemini');
    }

    // Ensure courseOffered is a string or null
    if (parsedData.courseOffered && typeof parsedData.courseOffered !== 'string') {
      parsedData.courseOffered = null;
    }

    return {
      ...parsedData,
      rawText: text
    } as ParsedDocumentData;

  } catch (error) {
    console.error('Gemini API parsing failed:', error);
    throw new Error(`Document parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Grade mappings for WASSCE format
const GRADE_MAPPINGS: Record<string, string> = {
  'a1': 'A1', 'b2': 'B2', 'b3': 'B3', 'c4': 'C4', 'c5': 'C5', 'c6': 'C6', 'd7': 'D7', 'e8': 'E8', 'f9': 'F9',
  '1': 'A1', '2': 'B2', '3': 'B3', '4': 'C4', '5': 'C5', '6': 'C6', '7': 'D7', '8': 'E8', '9': 'F9'
};

export async function processImageFile(file: File): Promise<ParsedDocumentData> {
  try {
    // Try AI-powered parsing first
    const base64Image = await fileToBase64(file);
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (GEMINI_API_KEY) {
      const prompt = `Analyze this WASSCE results image and extract the student information, course offered, and grades. Return ONLY a valid JSON object with this exact structure:

{
  "studentInfo": {
    "name": "string or null",
    "certificateType": "WASSCE or SSSCE or GBCE or null"
  },
  "courseOffered": "Science or Arts or Business or Technical or Agricultural or null",
  "extractedSubjects": [
    {
      "name": "subject name",
      "grade": "A1 or B2 or B3 or C4 or C5 or C6 or D7 or E8 or F9"
    }
  ]
}

Look for the RESULTS section and extract subject names with their corresponding grades. Also look for the course/program offered (like Science, Arts, Business, etc.). Return ONLY the JSON object, no explanations or additional text.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: prompt
              },
              {
                inline_data: {
                  mime_type: file.type,
                  data: base64Image
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          const generatedText = data.candidates[0].content.parts[0].text;
          let cleanText = generatedText.trim();

          if (cleanText.startsWith('```json')) {
            cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          } else if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
          }

          const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsedData = JSON.parse(jsonMatch[0]);
            if (parsedData.studentInfo && Array.isArray(parsedData.extractedSubjects)) {
              return {
                ...parsedData,
                rawText: `Image processed by Gemini Vision API. Extracted ${parsedData.extractedSubjects.length} subjects.`
              } as ParsedDocumentData;
            }
          }
        }
      }
    }

    // Fallback to OCR + regex parsing
    const worker = await createWorker('eng');
    try {
      const { data: { text } } = await worker.recognize(file);
      return parseDocumentText(text);
    } finally {
      await worker.terminate();
    }

  } catch (error) {
    console.error('Image processing failed:', error);
    throw new Error(`Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function processPDFFile(file: File): Promise<ParsedDocumentData> {
  try {
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Concatenate text items
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');

      fullText += pageText + ' ';
    }

    // Try AI parsing first for PDFs
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (GEMINI_API_KEY) {
      try {
        return await parseWithAI(fullText);
      } catch (aiError) {
        console.warn('AI parsing failed for PDF, falling back to regex:', aiError);
      }
    }

    // Fallback to regex parsing
    return parseDocumentText(fullText);
  } catch (error) {
    console.error('PDF processing error:', error);
    throw new Error('Failed to process PDF file. Please ensure it\'s a valid PDF document with readable text.');
  }
}

// Helper function to convert file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:image/jpeg;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

function parseDocumentText(text: string): ParsedDocumentData {
  const cleanText = text.toLowerCase().replace(/\s+/g, ' ').trim();

  // Extract student name
  const nameMatch = cleanText.match(/(?:name|candidate)[\s:]+([a-z\s]{3,50})/i);
  const extractedName = nameMatch ? nameMatch[1].trim() : undefined;

  const result: ParsedDocumentData = {
    extractedSubjects: [],
    studentInfo: {
      name: extractedName,
      certificateType: 'WASSCE'
    },
    rawText: text
  };

  // Extract subjects and grades
  const subjectGradePattern = /([a-z\s]+?)\s*[:\-]?\s*([a-d]\d|\d)/gi;
  const foundSubjects: Array<{ name: string; grade: string }> = [];

  let match;
  while ((match = subjectGradePattern.exec(cleanText)) !== null) {
    const subjectName = match[1].trim();
    const gradeValue = match[2].trim();

    const cleanSubjectName = subjectName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const mappedGrade = GRADE_MAPPINGS[gradeValue.toLowerCase()] || gradeValue.toUpperCase();

    if (cleanSubjectName.length >= 3 && /^[A-F]\d$/.test(mappedGrade)) {
      foundSubjects.push({ name: cleanSubjectName, grade: mappedGrade });
    }
  }

  // Remove duplicates
  result.extractedSubjects = foundSubjects.filter((subject, index, self) =>
    index === self.findIndex(s => s.name.toLowerCase() === subject.name.toLowerCase())
  );

  return result;
}

export async function detectCountryFromIP(): Promise<string> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_name || 'Ghana';
  } catch (error) {
    console.warn('IP detection failed:', error);
    return 'Ghana';
  }
}

// Core subjects are handled by the AI matching priority system

// Manual mapping for core subjects (since API type field is undefined)
export const CORE_SUBJECT_MAPPING: Record<string, { id: number; name: string; subject_code: string; type: number }> = {
  'Mathematics': { id: 1, name: 'Mathematics', subject_code: 'Math', type: 1 },
  'English': { id: 2, name: 'English', subject_code: 'English', type: 1 },
  'Science': { id: 3, name: 'Science', subject_code: 'Science', type: 1 },
  'Social Studies': { id: 4, name: 'Social Studies', subject_code: 'Social', type: 1 },
  'Integrated Science': { id: 3, name: 'Integrated Science', subject_code: 'Science', type: 1 },
  'English Language': { id: 2, name: 'English Language', subject_code: 'English', type: 1 },
  'Social': { id: 4, name: 'Social Studies', subject_code: 'Social', type: 1 }
};

// Elective subjects that should never be treated as core
export const ELECTIVE_SUBJECTS = [
  'Elective Mathematics',
  'Mathematics (Elect)',
  'Elective Maths',
  'Mathematics Elective'
];

// AI-powered subject matching with API subjects
export async function matchSubjectsWithAI(
  extractedSubjects: Array<{ name: string; grade: string }>,
  apiSubjects: Array<{ id: number; name: string; subject_code: string; type: number }>
): Promise<Array<{ name: string; grade: string; matchedSubject?: { id: number; name: string; subject_code: string; type: number } }>> {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return extractedSubjects.map(subject => ({
      ...subject,
      matchedSubject: findBestSubjectMatch(subject.name, apiSubjects)
    }));
  }

  try {
    // Prepare the prompt for AI matching
    const subjectsList = apiSubjects.map(s => `${s.name} (ID: ${s.id}, Type: ${s.type === 1 ? 'Core' : 'Elective'})`).join('\n');
    const extractedList = extractedSubjects.map(s => `${s.name}: ${s.grade}`).join('\n');

    const prompt = `I have extracted subjects and grades from a WASSCE results document. I need to match each extracted subject to the correct subject from our API database.

IMPORTANT: These subjects MUST be treated as CORE subjects (type=1):
- Mathematics (or Math) - BUT NOT "Mathematics (Elect)" or "Elective Mathematics"
- English (or English Language)
- Science (or Integrated Science)
- Social Studies (or Social)

IMPORTANT: These subjects MUST be treated as ELECTIVE subjects (type=2):
- Mathematics (Elect) or Elective Mathematics
- Any subject with "(Elect)" in the name
- All other subjects not listed as core

EXTRACTED SUBJECTS:
${extractedList}

API SUBJECTS DATABASE:
${subjectsList}

For each extracted subject, find the best matching subject from the API database. Consider:
- CORE SUBJECTS (Mathematics, English, Science, Social Studies) should match type=1 subjects
- ELECTIVE SUBJECTS should match type=2 subjects
- Exact name matches first
- Partial name matches
- Subject codes
- Common abbreviations (e.g., "Math" matches "Mathematics")
- Ghanaian subject naming conventions

Return ONLY a JSON array where each object has:
- "name": the original extracted subject name
- "grade": the original grade
- "matchedSubjectId": the ID of the best matching API subject (or null if no good match)

Example output:
[
  {"name": "Mathematics", "grade": "A1", "matchedSubjectId": 1},
  {"name": "English Language", "grade": "B2", "matchedSubjectId": 2}
]

Return ONLY the JSON array, no explanations.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
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
          temperature: 0.1,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;

    // Clean and parse the response
    let cleanText = generatedText.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in Gemini response');
    }

    const aiMatches = JSON.parse(jsonMatch[0]);

    // Apply AI matches to extracted subjects
    return extractedSubjects.map(extracted => {
      // PRIORITY 1: Manual core subject override (Mathematics, English, Science, Social Studies)
      // EXCLUDE elective subjects (containing "elect" or "(elect)")
      const isElectiveSubject = extracted.name.toLowerCase().includes('elect') || extracted.name.toLowerCase().includes('(elect)');
      
      const manualCoreMatch = !isElectiveSubject && Object.keys(CORE_SUBJECT_MAPPING).find(key =>
        extracted.name.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(extracted.name.toLowerCase()) ||
        extracted.name.toLowerCase().includes('core') // If subject name contains "core"
      );

      if (manualCoreMatch) {
        return {
          ...extracted,
          matchedSubject: CORE_SUBJECT_MAPPING[manualCoreMatch]
        };
      }

      // PRIORITY 2: Use AI match if available
      const aiMatch = aiMatches.find((match: any) =>
        match.name.toLowerCase() === extracted.name.toLowerCase()
      );

      if (aiMatch && aiMatch.matchedSubjectId) {
        const matchedSubject = apiSubjects.find(s => s.id === aiMatch.matchedSubjectId);
        return {
          ...extracted,
          matchedSubject
        };
      }

      // PRIORITY 3: Fallback to basic matching
      return {
        ...extracted,
        matchedSubject: findBestSubjectMatch(extracted.name, apiSubjects)
      };
    });

  } catch (error) {
    // Fallback to basic matching
    return extractedSubjects.map(subject => ({
      ...subject,
      matchedSubject: findBestSubjectMatch(subject.name, apiSubjects)
    }));
  }
}

// Enhanced subject matching with type priority (Elective subjects prioritized for (Elect) variants)
export function findBestSubjectMatch(subjectName: string, apiSubjects: Array<{ id: number; name: string; subject_code: string; type: number }>) {
  const normalizedSubject = subjectName.toLowerCase().trim();
  
  // First check if this is a known elective subject that should never be treated as core
  const isKnownElective = ELECTIVE_SUBJECTS.some(elective => 
    elective.toLowerCase().includes(normalizedSubject) || normalizedSubject.includes(elective.toLowerCase())
  );
  
  // Check if this is an elective subject (contains "elect" or "(elect)")
  const isElectiveSubject = isKnownElective || normalizedSubject.includes('elect') || normalizedSubject.includes('(elect)');
  
  // Filter subjects by type based on whether it's elective
  const relevantSubjects = isElectiveSubject 
    ? apiSubjects.filter(s => s.type === 2) // Only elective subjects
    : apiSubjects; // All subjects for non-elective

  // Exact match first - try subject_code then name (within relevant subjects)
  const exactCodeMatch = relevantSubjects.find(s => s.subject_code.toLowerCase() === normalizedSubject);
  if (exactCodeMatch) return exactCodeMatch;
  
  const exactNameMatch = relevantSubjects.find(s => s.name.toLowerCase() === normalizedSubject);
  if (exactNameMatch) return exactNameMatch;

  // Contains match - try subject_code then name (within relevant subjects)
  const containsCodeMatch = relevantSubjects.find(s =>
    s.subject_code.toLowerCase().includes(normalizedSubject) || normalizedSubject.includes(s.subject_code.toLowerCase())
  );
  if (containsCodeMatch) return containsCodeMatch;
  
  const containsNameMatch = relevantSubjects.find(s =>
    s.name.toLowerCase().includes(normalizedSubject) || normalizedSubject.includes(s.name.toLowerCase())
  );
  if (containsNameMatch) return containsNameMatch;

  // Special handling for Mathematics (Elect) -> Elective Maths (prioritize exact match)
  if (normalizedSubject.includes('math') && normalizedSubject.includes('elect')) {
    // First try exact match for 'Elective Maths' name
    const electiveMathExactMatch = relevantSubjects.find(s => 
      s.name.toLowerCase() === 'elective maths'
    );
    if (electiveMathExactMatch) return electiveMathExactMatch;
    
    // Then try contains match for 'Elective Maths' name
    const electiveMathNameMatch = relevantSubjects.find(s => 
      s.name.toLowerCase().includes('elective') && s.name.toLowerCase().includes('math')
    );
    if (electiveMathNameMatch) return electiveMathNameMatch;
    
    // Finally try subject_code matching
    const electiveMathMatch = relevantSubjects.find(s => 
      s.subject_code.toLowerCase().includes('elective') && s.subject_code.toLowerCase().includes('math')
    );
    if (electiveMathMatch) return electiveMathMatch;
  }

  // Word-based matching - try subject_code then name (within relevant subjects)
  const subjectWords = normalizedSubject.split(/\s+/);
  for (const word of subjectWords) {
    if (word.length > 3) {
      // Try subject_code first
      const codeWordMatch = relevantSubjects.find(s =>
        s.subject_code.toLowerCase().includes(word)
      );
      if (codeWordMatch) return codeWordMatch;
      
      // Then try name
      const nameWordMatch = relevantSubjects.find(s =>
        s.name.toLowerCase().includes(word)
      );
      if (nameWordMatch) return nameWordMatch;
    }
  }

  // Fallback: try all subjects if no match found in relevant subjects
  if (isElectiveSubject) {
    // Try exact match in all subjects - subject_code then name
    const fallbackExactCodeMatch = apiSubjects.find(s => s.subject_code.toLowerCase() === normalizedSubject);
    if (fallbackExactCodeMatch) return fallbackExactCodeMatch;
    
    const fallbackExactNameMatch = apiSubjects.find(s => s.name.toLowerCase() === normalizedSubject);
    if (fallbackExactNameMatch) return fallbackExactNameMatch;
    
    // Try contains match in all subjects - subject_code then name
    const fallbackContainsCodeMatch = apiSubjects.find(s =>
      s.subject_code.toLowerCase().includes(normalizedSubject) || normalizedSubject.includes(s.subject_code.toLowerCase())
    );
    if (fallbackContainsCodeMatch) return fallbackContainsCodeMatch;
    
    const fallbackContainsNameMatch = apiSubjects.find(s =>
      s.name.toLowerCase().includes(normalizedSubject) || normalizedSubject.includes(s.name.toLowerCase())
    );
    if (fallbackContainsNameMatch) return fallbackContainsNameMatch;
  }

  return undefined;
}

// Simple console log test for API endpoints
export async function testAPIs() {

  try {
    // Test core subjects (type=1)
    const coreResponse = await fetch('https://cutoffpoint.com.gh/api/v1/subjects/by-type?type=1', {
      headers: { Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNDI4OGZhYjE1Zjc2NGExZmU2ZTFiZGU0OTVlMDBiNDdlYmZiYjRkNTMzN2E4NGUwMTFhODc2NTgzZDM0N2NhNTI3MzMzOWNlNTc5Y2NkZjQiLCJpYXQiOjE3NTE5OTU1MjIuMjIwOTUxLCJuYmYiOjE3NTE5OTU1MjIuMjIwOTUzLCJleHAiOjE3ODM1MzE1MjIuMjA5MTczLCJzdWIiOiIyIiwic2NvcGVzIjpbXX0.mCHujZxR8eGFG_bdVP5YTDoL4dnGYEwsmu2RtmQmn-N7F06RtGBLxWxw9s5JzZVyQCZ8UV-AriNRIoRqhtfeZJfsvA0loN5ZrzhWErApZ5x08bNaNUQOVSWB-hnhQd8TvCq7pZF4QPNtr7BUsM3w-obabdESUagx15IApsZ2AHBCWafx4CvSOneugeo110QIFshDzudUZbXg0k3d1kNoRmCR_FCXF9w_Tb9nLWZDABL0ehiZlXeduF7S2AW0Y1gP85zcMOvyyTCo2dBTX73yrC9IUuhOEYFswv8PynKrydIRh5dtNTzIOlsYU_pb58FPDqO64tjigRbRaa_abgXAoZzne_InDmsAir1Wymuyhyyk6h8IvEMiI4j4_pMora-iA4bGZStS7zHacHBr50LQhq5OJdPUWDfv-1RU48WlT-KTbkrPqOLW7LiG9C3Sw2F2PbNTvGw-fG9BL0avfY6aEKDq9jJ_fxKsGehUYz8OjclthJMGGvmdLmGmIu1uGJ3keGYznnBZyV6vrCk8ZDKCHbJbV2pnxGbZOLJhUUD7imCXoiVhGL1h35z_jYtxgwGER7uYKHkjbXPhhNPQaDtL5XCcTUulHNUh6N951u-aLb1uFAwGoMpTKZ66M2_Hy5EG-oieLC0FkZpxmHsHBsCLOXioE3eP9-IDeRgfwPfQvrw` }
    });
    await coreResponse.json();

    // Test elective subjects (type=2)
    const electiveResponse = await fetch('https://cutoffpoint.com.gh/api/v1/subjects/by-type?type=2', {
      headers: { Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNDI4OGZhYjE1Zjc2NGExZmU2ZTFiZGU0OTVlMDBiNDdlYmZiYjRkNTMzN2E4NGUwMTFhODc2NTgzZDM0N2NhNTI3MzMzOWNlNTc5Y2NkZjQiLCJpYXQiOjE3NTE5OTU1MjIuMjIwOTUxLCJuYmYiOjE3NTE5OTU1MjIuMjIwOTUzLCJleHAiOjE3ODM1MzE1MjIuMjA5MTczLCJzdWIiOiIyIiwic2NvcGVzIjpbXX0.mCHujZxR8eGFG_bdVP5YTDoL4dnGYEwsmu2RtmQmn-N7F06RtGBLxWxw9s5JzZVyQCZ8UV-AriNRIoRqhtfeZJfsvA0loN5ZrzhWErApZ5x08bNaNUQOVSWB-hnhQd8TvCq7pZF4QPNtr7BUsM3w-obabdESUagx15IApsZ2AHBCWafx4CvSOneugeo110QIFshDzudUZbXg0k3d1kNoRmCR_FCXF9w_Tb9nLWZDABL0ehiZlXeduF7S2AW0Y1gP85zcMOvyyTCo2dBTX73yrC9IUuhOEYFswv8PynKrydIRh5dtNTzIOlsYU_pb58FPDqO64tjigRbRaa_abgXAoZzne_InDmsAir1Wymuyhyyk6h8IvEMiI4j4_pMora-iA4bGZStS7zHacHBr50LQhq5OJdPUWDfv-1RU48WlT-KTbkrPqOLW7LiG9C3Sw2F2PbNTvGw-fG9BL0avfY6aEKDq9jJ_fxKsGehUYz8OjclthJMGGvmdLmGmIu1uGJ3keGYznnBZyV6vrCk8ZDKCHbJbV2pnxGbZOLJhUUD7imCXoiVhGL1h35z_jYtxgwGER7uYKHkjbXPhhNPQaDtL5XCcTUulHNUh6N951u-aLb1uFAwGoMpTKZ66M2_Hy5EG-oieLC0FkZpxmHsHBsCLOXioE3eP9-IDeRgfwPfQvrw` }
    });
    await electiveResponse.json();

  } catch (error) {
  }
}