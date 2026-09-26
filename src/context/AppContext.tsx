import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuKey } from '../types';

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

export interface LicenseData {
  licenseId: string;
  plan: string;
  activatedAt: number;
  expiresAt: number;
  durationDays: number;
  remainingSeconds: number;
  isExpired: boolean;
  formattedTime: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  supportContact: string;
}

interface AppContextType {
  workHistory: WorkLog[];
  addWorkLog: (log: Omit<WorkLog, 'id' | 'timestamp'>) => void;
  sessions: TelegramSession[];
  addSession: (phone: string, name?: string) => TelegramSession;
  removeSession: (id: string) => void;
  toggleSelectSession: (id: string) => void;
  licenseData: LicenseData | null;
  fetchLicense: () => Promise<void>;
  activeMenu: MenuKey;
  setActiveMenu: (key: MenuKey) => void;
  extractPrefillLink: string;
  setExtractPrefillLink: (link: string) => void;
  navigateToExtractGroup: (groupLink: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [workHistory, setWorkHistory] = useState<WorkLog[]>([]);
  const [sessions, setSessions] = useState<TelegramSession[]>([]);
  const [licenseData, setLicenseData] = useState<LicenseData | null>(null);
  const [activeMenu, setActiveMenu] = useState<MenuKey>('extract-data');
  const [extractPrefillLink, setExtractPrefillLink] = useState('');

  const fetchLicense = async () => {
    try {
      const res = await fetch('/api/license');
      const data = await res.json();
      if (data.success && data.data) {
        setLicenseData(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch license data', err);
    }
  };

  // Immediate license fetch on mount
  useEffect(() => {
    fetchLicense();
  }, []);

  // Real-time ticking countdown (decrements smoothly every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setLicenseData(prev => {
        if (!prev) return null;
        const now = Date.now();
        const remainingMs = Math.max(0, prev.expiresAt - now);
        const remainingSeconds = Math.floor(remainingMs / 1000);
        const isExpired = remainingSeconds <= 0;

        const days = Math.floor(remainingSeconds / (24 * 3600));
        const hours = Math.floor((remainingSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;

        return {
          ...prev,
          remainingSeconds,
          isExpired,
          formattedTime: {
            days,
            hours,
            minutes,
            seconds,
          }
        };
      });
    }, 1000);

    // Periodic sync with server every 30 seconds
    const syncInterval = setInterval(() => {
      fetchLicense();
    }, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(syncInterval);
    };
  }, []);

  const navigateToExtractGroup = (groupLink: string) => {
    setExtractPrefillLink(groupLink);
    setActiveMenu('extract-data');
  };

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
      toggleSelectSession,
      licenseData,
      fetchLicense,
      activeMenu,
      setActiveMenu,
      extractPrefillLink,
      setExtractPrefillLink,
      navigateToExtractGroup
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
