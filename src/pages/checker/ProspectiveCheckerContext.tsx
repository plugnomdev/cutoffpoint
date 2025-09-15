import { createContext, useContext, ReactNode } from 'react';
import { ProspectiveFormData } from './ProspectiveStudentChecker';
import { Subject, Grade } from '../../services/api/universityApi';

type ProspectiveCheckerContextType = {
  formData: ProspectiveFormData;
  updateFields: (fields: Partial<ProspectiveFormData>) => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
  coreSubjects: Subject[];
  electiveSubjects: Subject[];
  availableGrades: Grade[];
}

const ProspectiveCheckerContext = createContext<ProspectiveCheckerContextType | undefined>(undefined);

type ProspectiveCheckerProviderProps = {
  children: ReactNode;
  value: ProspectiveCheckerContextType;
}

export function ProspectiveCheckerProvider({
  children,
  value
}: ProspectiveCheckerProviderProps) {
  return (
    <ProspectiveCheckerContext.Provider value={value}>
      {children}
    </ProspectiveCheckerContext.Provider>
  );
}

export function useProspectiveChecker() {
  const context = useContext(ProspectiveCheckerContext);
  if (context === undefined) {
    throw new Error('useProspectiveChecker must be used within a ProspectiveCheckerProvider');
  }
  return context;
}