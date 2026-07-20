import React, { useState } from 'react';
import { 
  Globe, UserPlus, Users, Search, Send, 
  UserSquare, Clock, Settings, BookOpen, 
  Info, LogOut, MonitorStop
} from 'lucide-react';
import { AppState, MenuKey } from './types';
import { ExtractData } from './components/ExtractData';
import { ProxySettings } from './components/ProxySettings';
import { AddMembers } from './components/AddMembers';
import { SearchGroups } from './components/SearchGroups';
import { SendMessages } from './components/SendMessages';
import { ProfileSearch, WorkHistory, ProgramSettings, Manual, About } from './components/MiscViews';

// --- Login Component ---
function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        
        if (data.success) {
          onLogin();
        } else {
          setError(data.message || 'Login failed');
        }
      } catch (err) {
        setError('Connection error');
      } finally {
        setLoading(false);
      }
    } else {
      setError('กรุณากรอกยูสเซอร์เนมและรหัสผ่าน');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="bg-[#1c1c1c] p-8 rounded-xl border border-[#333] w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-center mb-8 gap-3">
          <MonitorStop className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-white">ระบบจัดการ Telegram</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">ยูสเซอร์เนม (Username)</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#121212] border border-[#333] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="กรอกยูสเซอร์เนม"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">รหัสผ่าน (Password)</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#121212] border border-[#333] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="กรอกรหัสผ่าน"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors mt-6"
          >
            {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ (Login)'}
          </button>
        </form>
        <p className="text-xs text-gray-500 text-center mt-6">
          รองรับการเข้าใช้งานหลายยูสเซอร์เนมด้วยช่องทางล๊อกอินเดียวกัน
        </p>
      </div>
    </div>
  );
}

// --- Dashboard Sidebar Component ---
function Sidebar({ 
  activeMenu, 
  onMenuChange, 
  onLogout 
}: { 
  activeMenu: MenuKey; 
  onMenuChange: (key: MenuKey) => void;
  onLogout: () => void; 
}) {
  const menuItems: { icon: any; label: string; key: MenuKey }[] = [
    { icon: Globe, label: 'ตั้งค่า Proxy', key: 'proxy' },
    { icon: UserPlus, label: 'เพิ่มสมาชิกเข้ากลุ่ม', key: 'add-members' },
    { icon: Users, label: 'ดึงข้อมูลกลุ่ม', key: 'extract-data' },
    { icon: Search, label: 'ค้นหากลุ่ม', key: 'search-groups' },
    { icon: Send, label: 'ส่งข้อความ', key: 'send-messages' },
    { icon: UserSquare, label: 'โปรไฟล์และค้นหาชื่อ', key: 'profile-search' },
  ];

  const bottomItems: { icon: any; label: string; key: MenuKey }[] = [
    { icon: Clock, label: 'ประวัติการทำงาน', key: 'work-history' },
    { icon: Settings, label: 'ตั้งค่าโปรแกรม', key: 'settings' },
    { icon: BookOpen, label: 'คู่มือการใช้งาน', key: 'manual' },
    { icon: Info, label: 'เกี่ยวกับโปรแกรม', key: 'about' },
  ];

  return (
    <div className="w-64 bg-[#1e1e1e] border-r border-[#333] flex flex-col h-screen">
      <div className="p-4 flex items-center gap-3 border-b border-[#333]">
        <MonitorStop className="w-6 h-6 text-blue-500" />
        <span className="font-semibold text-gray-200">เครื่องมือดึงข้อมูล Telegram</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.key}>
              <button 
                onClick={() => onMenuChange(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${activeMenu === item.key ? 'bg-[#2a2a2a] text-blue-400' : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-200'}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <hr className="border-[#333] my-4 mx-4" />

        <ul className="space-y-1 px-2">
          {bottomItems.map((item) => (
            <li key={item.key}>
              <button 
                onClick={() => onMenuChange(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${activeMenu === item.key ? 'bg-[#2a2a2a] text-blue-400' : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-200'}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-[#333]">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
}

// --- Dashboard Main Content Component ---
function MainContent({ activeMenu }: { activeMenu: MenuKey }) {
  switch (activeMenu) {
    case 'proxy': return <ProxySettings />;
    case 'add-members': return <AddMembers />;
    case 'extract-data': return <ExtractData />;
    case 'search-groups': return <SearchGroups />;
    case 'send-messages': return <SendMessages />;
    case 'profile-search': return <ProfileSearch />;
    case 'work-history': return <WorkHistory />;
    case 'settings': return <ProgramSettings />;
    case 'manual': return <Manual />;
    case 'about': return <About />;
    default: return <ExtractData />;
  }
}

// --- Main App ---
export default function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [activeMenu, setActiveMenu] = useState<MenuKey>('extract-data');

  if (appState === 'login') {
    return <Login onLogin={() => setAppState('dashboard')} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a] selection:bg-blue-500/30">
      <Sidebar 
        activeMenu={activeMenu} 
        onMenuChange={setActiveMenu} 
        onLogout={() => setAppState('login')} 
      />
      <MainContent activeMenu={activeMenu} />
    </div>
  );
}

