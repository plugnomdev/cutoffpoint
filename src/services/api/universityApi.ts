// University API Service: Handles API calls for university-related data

export interface Country {
  id: number;
  name: string;
  code: string;
  flag: string;
}

export interface School {
  id: number;
  name: string;
  shortcode: string;
  accepting: number;
  core_cutoff_grade: number;
}

export interface CertificateType {
  id: number;
  name: string;
  description: string;
}

export interface ProgramType {
  id: number;
  name: string;
  description: string;
}

export interface Course {
  id: number;
  name: string;
}

export interface Program {
  id: number;
  name: string;
  description: string | null;
  max_grade: number;
  link: string;
  apply_link: string;
}

export interface Subject {
  id: number;
  name: string;
  subject_code: string;
  type: number;
}

export interface Grade {
  id: number;
  name: string;
  number: number;
}

// Grade Check API Interfaces
export interface InitialOrderRequest {
  user_phone: string;
  user_name: string;
}

export interface InitialOrderResponse {
  code: string;
  user_name: string;
  user_phone: string;
}

export interface ElectiveResult {
  subject_id: number;
  grade: number;
}

export interface GradeCheckRequest {
  code: string;
  school_id: number;
  cert_type_id: number;
  programme_type_id: number;
  country_id: number;
  course_id: number;
  results: {
    core: Record<string, number>;
    electives: ElectiveResult[];
  };
}

export interface QualifiedProgram {
  id: number;
  name: string;
  description: string;
  max_grade: number;
  link: string;
  apply_link: string;
}

export interface GradeCheckSummary {
  total_score: number;
  core_score: number;
  elective_score: number;
  core_grades: number[];
  elective_grades: number[];
}

export interface GradeCheckResponse {
  check_code: string;
  summary: GradeCheckSummary;
  qualified_programs: QualifiedProgram[];
  total_qualified: number;
  school: {
    id: number;
    name: string;
  };
  payment: {
    amount: number;
    currency: string;
    payment_link: string;
  };
}

import tokenData from './token.json';

export async function fetchCountries(): Promise<Country[]> {
  const response = await fetch('https://cutoffpoint.com.gh/api/v1/countries', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch countries');
  return data.data;
}

export async function fetchSchoolsByCountry(country_id: number): Promise<School[]> {
  const response = await fetch(`https://cutoffpoint.com.gh/api/v1/schools?country_id=${country_id}`, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch schools');
  return data.data.schools;
}

export async function fetchCertificateTypes(): Promise<CertificateType[]> {
  const response = await fetch('https://cutoffpoint.com.gh/api/v1/cert-types', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch certificate types');
  return data.data;
}

export async function fetchProgramTypes(): Promise<ProgramType[]> {
  const response = await fetch('https://cutoffpoint.com.gh/api/v1/program-types', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch program types');
  return data.data;
}

export async function fetchCourses(): Promise<Course[]> {
  const response = await fetch('https://cutoffpoint.com.gh/api/v1/courses', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch courses');
  return data.data;
}

export async function fetchProgramsBySchool(schoolId: number): Promise<Program[]> {
  const response = await fetch(`https://cutoffpoint.com.gh/api/v1/programs?school_id=${schoolId}`, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch programs');
  return data.data;
}

export async function fetchSubjects(): Promise<Subject[]> {
  const response = await fetch('https://cutoffpoint.com.gh/api/v1/subjects', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch subjects');
  return data.data;
}

export async function fetchSubjectsByType(type: number): Promise<Subject[]> {
  const response = await fetch(`https://cutoffpoint.com.gh/api/v1/subjects/by-type?type=${type}`, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || `Failed to fetch subjects of type ${type}`);
  return data.data;
}

export async function fetchGrades(): Promise<Grade[]> {
  const response = await fetch('https://cutoffpoint.com.gh/api/v1/grades', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch grades');
  return data.data;
}

export interface CheckRequest {
  background: {
    courseOffered: string;
    certificateType: string;
    programmeLevel: string;
    fullName: string;
    phoneNumber: string;
    country: { id: number; name: string; code: string; flag: string } | null;
    school: { id: number; name: string; shortcode: string } | null;
  };
  coreSubjects: Record<number, string>;
  selectedElectives: string[];
  electiveGrades: Record<string, string>;
}

export interface CheckResponse {
  success: boolean;
  message: string;
  data: {
    check_code: string;
    payment_link: string;
    amount: number;
    currency: string;
  };
}

export async function submitQualificationCheck(checkData: CheckRequest): Promise<CheckResponse> {
  const response = await fetch('https://cutoffpoint.com.gh/api/v1/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenData.access_token}`,
    },
    body: JSON.stringify(checkData),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || 'Failed to submit qualification check');
  return data;
}

export interface PriceInfo {
  service: string;
  amount: number;
  currency: string;
  description: string;
}

export async function fetchServicePrice(serviceType: string = 'qualification_check'): Promise<PriceInfo> {
  const response = await fetch(`https://cutoffpoint.com.gh/api/v1/prices?service=${serviceType}`, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch service price');
  return data.data;
}

export interface QualificationResult {
  check_code: string;
  school: {
    id: number;
    name: string;
  };
  country: {
    id: number;
    name: string;
    code: string;
    flag: string;
  };
  summary: {
    core_grades: number[];
    elective_grades: number[];
    core_score: number;
    elective_score: number;
    total_score: number;
  };
  qualified_programs: Array<{
    id: number;
    name: string;
    description: string | null;
    max_grade: number;
    link: string;
  }>;
  total_qualified: number;
  payment: {
    amount: number;
    currency: string;
    payment_link: string;
  };
}


// Grade Check API Functions
export async function createInitialOrder(request: InitialOrderRequest): Promise<InitialOrderResponse> {
  console.log('API Request to /check/initial:', request);
  const response = await fetch('https://cutoffpoint.com.gh/api/v1/check/initial', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenData.access_token}`,
    },
    body: JSON.stringify(request),
  });
  const data = await response.json();
  console.log('API Response from /check/initial:', data);

  if (!data.success) {
    const errorMessage = data.message || data.error || 'Failed to create initial order';
    console.error('API Error details:', data);
    throw new Error(errorMessage);
  }
  return data.data;
}

export async function completeGradeCheck(request: GradeCheckRequest): Promise<GradeCheckResponse> {
  console.log('API Request to /grade-check:', request);
  const response = await fetch('https://cutoffpoint.com.gh/api/v1/grade-check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenData.access_token}`,
    },
    body: JSON.stringify(request),
  });
  const data = await response.json();
  console.log('API Response from /grade-check:', data);

  if (!data.success) {
    const errorMessage = data.message || data.error || 'Failed to complete grade check';
    console.error('API Error details:', data);
    throw new Error(errorMessage);
  }
  return data.data;
}
