import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Patient } from '../types';
import { clearAccessToken } from '../services/api';

const AUTHENTICATED_USER_STORAGE_KEY = 'medikiosk_authenticated_user';

const getPersistedUser = (): User | null => {
  const savedUser = sessionStorage.getItem(AUTHENTICATED_USER_STORAGE_KEY);
  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser) as User;
  } catch {
    sessionStorage.removeItem(AUTHENTICATED_USER_STORAGE_KEY);
    return null;
  }
};

interface AppContextType {
  language: 'en' | 'hi' | 'te';
  setLanguage: (lang: 'en' | 'hi' | 'te') => void;
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
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
  const [user, setUserState] = useState<User | null>(getPersistedUser);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<Partial<Patient>>({});

  const setUser = (nextUser: User | null) => {
    setUserState(nextUser);

    if (nextUser) {
      sessionStorage.setItem(AUTHENTICATED_USER_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      sessionStorage.removeItem(AUTHENTICATED_USER_STORAGE_KEY);
    }
  };

  const logout = () => {
    setUser(null);
    clearAccessToken();
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        user,
        setUser,
        logout,
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
