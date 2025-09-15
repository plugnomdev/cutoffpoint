export type CoreSubjects = Record<number, string>; // subject_id -> grade

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
  coreSubjects: CoreSubjects;
  selectedElectives: string[];
  electiveGrades: Record<string, string>; // subject_name -> grade
  paid: boolean;
}
