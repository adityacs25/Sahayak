import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Patient } from '../types';

interface AppContextType {
  language: 'en' | 'hi' | 'te';
  setLanguage: (lang: 'en' | 'hi' | 'te') => void;
  user: User | null;
  setUser: (user: User | null) => void;
  patientId: string | null;
  setPatientId: (id: string | null) => void;
  caseId: string | null;
  setCaseId: (id: string | null) => void;
  patientData: Partial<Patient>;
  setPatientData: (data: Partial<Patient>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'hi' | 'te'>('en');
  const [user, setUser] = useState<User | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<Partial<Patient>>({});

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        user,
        setUser,
        patientId,
        setPatientId,
        caseId,
        setCaseId,
        patientData,
        setPatientData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
