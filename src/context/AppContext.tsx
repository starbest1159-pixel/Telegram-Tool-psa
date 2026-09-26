import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface WorkLog {
  id: string;
  timestamp: string;
  type: string;
  target: string;
  status: string;
  details: string;
}

export interface TelegramSession {
  id: string;
  phone: string;
  name: string;
  status: 'Connected' | 'Pending' | 'Disconnected';
  isSelected: boolean;
}

interface AppContextType {
  workHistory: WorkLog[];
  addWorkLog: (log: Omit<WorkLog, 'id' | 'timestamp'>) => void;
  sessions: TelegramSession[];
  addSession: (phone: string, name?: string) => TelegramSession;
  removeSession: (id: string) => void;
  toggleSelectSession: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [workHistory, setWorkHistory] = useState<WorkLog[]>([]);
  const [sessions, setSessions] = useState<TelegramSession[]>([]);

  const addSession = (phone: string, name?: string): TelegramSession => {
    const newSession: TelegramSession = {
      id: `sess-${Date.now()}`,
      phone: phone.trim(),
      name: name?.trim() || `Session_${sessions.length + 1}`,
      status: 'Connected',
      isSelected: true
    };
    setSessions(prev => [...prev, newSession]);
    return newSession;
  };

  const removeSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const toggleSelectSession = (id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, isSelected: !s.isSelected } : s));
  };

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
    <AppContext.Provider value={{ 
      workHistory, 
      addWorkLog, 
      sessions, 
      addSession, 
      removeSession, 
      toggleSelectSession 
    }}>
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
