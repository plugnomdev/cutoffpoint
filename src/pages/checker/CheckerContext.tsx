import { createContext, useContext, ReactNode } from 'react';
import { FormData } from './GradeChecker';
import { Subject, Grade } from '../../services/api/universityApi';

type CheckerContextType = {
  formData: FormData;
  updateFields: (fields: Partial<FormData>) => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
  coreSubjects: Subject[];
  electiveSubjects: Subject[];
  availableGrades: Grade[];
}

const CheckerContext = createContext<CheckerContextType | undefined>(undefined);

type CheckerProviderProps = {
  children: ReactNode;
  value: Omit<CheckerContextType, 'coreSubjects' | 'electiveSubjects' | 'availableGrades'> & {
    coreSubjects: Subject[];
    electiveSubjects: Subject[];
    availableGrades: Grade[];
  };
}

export function CheckerProvider({ 
  children,
  value
}: CheckerProviderProps) {
  return (
    <CheckerContext.Provider value={value}>
      {children}
    </CheckerContext.Provider>
  );
}

export function useChecker() {
  const context = useContext(CheckerContext);
  if (context === undefined) {
    throw new Error('useChecker must be used within a CheckerProvider');
  }
  return context;
}
