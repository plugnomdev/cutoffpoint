import { createContext, useContext, ReactNode } from 'react';
import { FormData } from './GradeChecker';

type CheckerContextType = {
  formData: FormData;
  updateFields: (fields: Partial<FormData>) => void;
}

const CheckerContext = createContext<CheckerContextType | undefined>(undefined);

export function CheckerProvider({ 
  children,
  value
}: { 
  children: ReactNode;
  value: CheckerContextType;
}) {
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