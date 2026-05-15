
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Semester = 'Semua' | 'Ganjil' | 'Genap';

interface SettingsContextType {
  academicYear: string;
  setAcademicYear: (year: string) => void;
  semester: Semester;
  setSemester: (semester: Semester) => void;
  availableYears: string[];
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [semester, setSemester] = useState<Semester>('Semua');
  
  const availableYears = ['Semua', '2026/2027', '2025/2026', '2024/2025', '2023/2024'];

  // Optional: Load from localStorage
  useEffect(() => {
    const savedYear = localStorage.getItem('academicYear');
    const savedSemester = localStorage.getItem('semester');
    if (savedYear) setAcademicYear(savedYear);
    if (savedSemester) setSemester(savedSemester as Semester);
  }, []);

  useEffect(() => {
    localStorage.setItem('academicYear', academicYear);
    localStorage.setItem('semester', semester);
  }, [academicYear, semester]);

  return (
    <SettingsContext.Provider value={{ academicYear, setAcademicYear, semester, setSemester, availableYears }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
