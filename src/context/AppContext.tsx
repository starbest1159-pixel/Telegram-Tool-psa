import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface WorkLog {
  id: string;
  timestamp: string;
  type: string;
  target: string;
  status: string;
  details: string;
}

interface AppContextType {
  workHistory: WorkLog[];
  addWorkLog: (log: Omit<WorkLog, 'id' | 'timestamp'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [workHistory, setWorkHistory] = useState<WorkLog[]>([]);

  const addWorkLog = (log: Omit<WorkLog, 'id' | 'timestamp'>) => {
    const newLog: WorkLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString('th-TH', { 
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      })
    };
    setWorkHistory(prev => [newLog, ...prev]);
  };

  return (
    <AppContext.Provider value={{ workHistory, addWorkLog }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
