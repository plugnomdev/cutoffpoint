export type CoreSubjects = Record<number, string>; // subject_id -> grade

export type MatchedSubjectInfo = {
  id: number;
  name: string;
  subject_code: string;
  type: number;
}

export type FormData = {
  background: {
    courseOffered: string;
    certificateType: string;
    programmeLevel: 'Certificate' | 'Diploma' | 'Degree';
    fullName: string;
    phoneNumber: string;
    country: any | null;
    school: any | null;
  };
  gradeEntryMethod?: 'manual' | 'upload';
  coreSubjects: CoreSubjects;
  coreSubjectNames: Record<number, string>; // subject_id -> subject_name
  selectedElectives: string[];
  electiveGrades: Record<string, string>; // subject_name -> grade
  paid: boolean;
}
