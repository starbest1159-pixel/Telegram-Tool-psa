import React, { useState } from 'react';
import { 
  Globe, UserPlus, Users, Search, Send, 
  UserSquare, Clock, Settings, BookOpen, 
  Info, LogOut, MonitorStop, AlertTriangle, AlertCircle
} from 'lucide-react';
import { AppState, MenuKey } from './types';
import { ExtractData } from './components/ExtractData';
import { ProxySettings } from './components/ProxySettings';
import { AddMembers } from './components/AddMembers';
import { SearchGroups } from './components/SearchGroups';
import { SendMessages } from './components/SendMessages';
import { ProfileSearch, WorkHistory, ProgramSettings, Manual, About } from './components/MiscViews';
import { AppProvider, useAppContext } from './context/AppContext';
import { TelegramIcon } from './components/TelegramIcon';

// --- Login Component ---
function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username.trim(), password: password.trim() })
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
        <div className="flex items-center justify-center mb-6 gap-3">
          <TelegramIcon className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-white">ระบบจัดการ Telegram</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/30 p-3 rounded">{error}</div>}
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
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors mt-6 cursor-pointer shadow-md"
          >
            {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ (Login)'}
          </button>
        </form>
        <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg text-xs text-yellow-300 text-center">
          นี่คือระบบจาก PSAistudio หากท่านได้ระบบนี้จากที่อื่นแสดงว่าอาจกำลังถูกหลอก ถ้าต้องการระบบนี้จริงๆต้อง ไลน์ไอดี @255yxtaf เท่านั้น
        </div>
      </div>
    </div>
  );
}

// --- Warning Modal Component ---
function WarningModal({ onClose }: { onClose: () => void }) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1e1e1e] border border-yellow-500/40 rounded-xl p-6 max-w-md w-full shadow-2xl relative text-center">
        <div className="w-12 h-12 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-400" />
        </div>
        <h3 className="text-lg font-bold text-yellow-400 mb-3">ประกาศสำคัญจาก PSAistudio</h3>
        <p className="text-gray-300 text-sm leading-relaxed mb-6 bg-[#121212] p-4 rounded-lg border border-[#333]">
          นี่คือระบบจาก <strong className="text-white">PSAistudio</strong> หากท่านได้ระบบนี้จากที่อื่นแสดงว่าอาจกำลังถูกหลอก ถ้าต้องการระบบนี้จริงๆต้องติดต่อไลน์ไอดี <span className="text-blue-400 font-bold">@255yxtaf</span> เท่านั้น
        </p>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <span>รับทราบและเข้าสู่ระบบ</span>
          <kbd className="hidden sm:inline-block bg-blue-800 text-blue-200 text-[10px] px-1.5 py-0.5 rounded font-mono">Esc / Enter</kbd>
        </button>
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
  const { licenseData } = useAppContext();
  const menuItems: { icon: any; label: string; key: MenuKey; keynum: string }[] = [
    { icon: Globe, label: 'ตั้งค่า Proxy', key: 'proxy', keynum: '1' },
    { icon: UserPlus, label: 'เพิ่มสมาชิกเข้ากลุ่ม', key: 'add-members', keynum: '2' },
    { icon: Users, label: 'ดึงข้อมูลกลุ่ม', key: 'extract-data', keynum: '3' },
    { icon: Search, label: 'ค้นหากลุ่ม', key: 'search-groups', keynum: '4' },
    { icon: Send, label: 'ส่งข้อความ', key: 'send-messages', keynum: '5' },
    { icon: UserSquare, label: 'โปรไฟล์และค้นหาชื่อ', key: 'profile-search', keynum: '6' },
  ];

  const bottomItems: { icon: any; label: string; key: MenuKey }[] = [
    { icon: Clock, label: 'ประวัติการทำงาน', key: 'work-history' },
    { icon: Settings, label: 'ตั้งค่าโปรแกรม', key: 'settings' },
    { icon: BookOpen, label: 'คู่มือการใช้งาน', key: 'manual' },
    { icon: Info, label: 'เกี่ยวกับโปรแกรม', key: 'about' },
  ];

  // Desktop Keyboard Shortcuts (Alt + 1..6)
  React.useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      if (e.altKey && !e.ctrlKey && !e.shiftKey) {
        if (e.key === '1') onMenuChange('proxy');
        if (e.key === '2') onMenuChange('add-members');
        if (e.key === '3') onMenuChange('extract-data');
        if (e.key === '4') onMenuChange('search-groups');
        if (e.key === '5') onMenuChange('send-messages');
        if (e.key === '6') onMenuChange('profile-search');
      }
    };
    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [onMenuChange]);

  return (
    <div className="w-64 bg-[#1e1e1e] border-r border-[#333] flex flex-col h-screen select-none">
      <div className="p-4 flex items-center gap-3 border-b border-[#333]">
        <TelegramIcon className="w-6 h-6" />
        <span className="font-semibold text-gray-200 text-sm">เครื่องมือดึงข้อมูล Telegram</span>
      </div>

      <div className="flex-1 overflow-y-auto py-3">
        <div className="px-3 mb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex justify-between items-center">
          <span>เมนูหลัก (Core Features)</span>
          <span className="text-[9px] text-gray-600 font-mono hidden sm:inline">Alt + [1-6]</span>
        </div>
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.key}>
              <button 
                onClick={() => onMenuChange(item.key)}
                title={`คลิกเพื่อสลับ หรือกด Alt+${item.keynum}`}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                  activeMenu === item.key 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-medium' 
                    : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <kbd className="text-[10px] bg-[#121212] border border-[#333] text-gray-500 px-1.5 py-0.5 rounded font-mono group-hover:text-gray-300">
                  Alt+{item.keynum}
                </kbd>
              </button>
            </li>
          ))}
        </ul>

        <hr className="border-[#333] my-4 mx-4" />

        <div className="px-3 mb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
          <span>ระบบและการตั้งค่า</span>
        </div>
        <ul className="space-y-1 px-2">
          {bottomItems.map((item) => (
            <li key={item.key}>
              <button 
                onClick={() => onMenuChange(item.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                  activeMenu === item.key 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-medium' 
                    : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-200'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 30-Day License Mini Indicator in Sidebar */}
      <div className="p-3 mx-2 mb-2 bg-[#141414] border border-[#2d2d2d] rounded-lg text-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">อายุใช้งาน 30 วัน</span>
          <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
            licenseData?.isExpired ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
          }`}>
            {licenseData?.isExpired ? 'EXPIRED' : 'ACTIVE'}
          </span>
        </div>
        <div className="text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>
            {licenseData 
              ? `${licenseData.formattedTime.days} วัน ${licenseData.formattedTime.hours} ชม. ${licenseData.formattedTime.minutes}น.`
              : '30 วัน 00 ชม.'}
          </span>
        </div>
        <p className="text-[9px] text-gray-500 mt-1">เริ่มนับทันที • ล็อคเวลาบนเซิร์ฟเวอร์</p>
      </div>

      <div className="p-3 border-t border-[#333] bg-[#1a1a1a]">
        <button 
          onClick={onLogout}
          title="ออกจากระบบ"
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            <span>ออกจากระบบ</span>
          </div>
          <span className="text-[10px] text-gray-500">PC User</span>
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

// --- Dashboard Component (Inside AppProvider) ---
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { activeMenu, setActiveMenu, licenseData } = useAppContext();
  const [showWarning, setShowWarning] = useState(true);

  const expireDateString = licenseData?.expiresAt 
    ? new Date(licenseData.expiresAt).toLocaleDateString('th-TH', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : 'กำลังโหลด...';

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0a0a0a] selection:bg-blue-500/30">
      {showWarning && <WarningModal onClose={() => setShowWarning(false)} />}
      
      {/* 30-Day Real-Time Countdown License Header Bar */}
      <div className="bg-[#141414] border-b border-[#2d2d2d] px-4 py-2 flex flex-wrap items-center justify-between gap-3 z-40 select-none shadow-md">
        <div className="flex items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${licenseData?.isExpired ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
            <span className="text-gray-300 font-semibold">อายุการใช้งานระบบ (30 วัน):</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono bg-[#1c1c1c] border border-[#383838] px-3 py-1 rounded-lg text-white shadow-inner">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            {licenseData ? (
              licenseData.isExpired ? (
                <span className="text-rose-400 font-bold">หมดอายุแล้ว (Expired)</span>
              ) : (
                <span className="text-cyan-300 font-bold tracking-wide">
                  {licenseData.formattedTime.days} วัน {licenseData.formattedTime.hours} ชม. {licenseData.formattedTime.minutes} นาที {licenseData.formattedTime.seconds} วินาที
                </span>
              )
            ) : (
              <span className="text-gray-400 text-[11px]">กำลังเชื่อมต่อ API...</span>
            )}
          </div>

          <span className="text-[11px] text-gray-400 hidden lg:inline">
            (เริ่มนับถอยหลังทันที • หมดอายุ: <strong className="text-gray-200">{expireDateString}</strong> • API ทำงานตลอดเวลา ไม่เริ่มนับใหม่)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
            licenseData?.isExpired 
              ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
          }`}>
            {licenseData?.isExpired ? 'EXPIRED' : 'ACTIVE 30D'}
          </span>
          <span className="text-xs text-yellow-400/90 font-medium hidden md:inline">
            ไลน์ไอดี: <strong className="text-white">@255yxtaf</strong>
          </span>
          <button 
            onClick={() => setShowWarning(true)} 
            className="text-[11px] bg-[#222] hover:bg-[#2e2e2e] text-yellow-300 px-2.5 py-1 rounded border border-yellow-500/30 transition-colors"
          >
            ประกาศระบบ
          </button>
        </div>
      </div>

      {/* Warning Notice if Expired */}
      {licenseData?.isExpired && (
        <div className="bg-rose-500/20 border-b border-rose-500/40 px-4 py-2 text-xs text-rose-300 flex items-center justify-between z-30">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>สิทธิ์การใช้งานระบบ 30 วันสิ้นสุดลงแล้ว กรุณาติดต่อต่ออายุสิทธิ์ผ่านไลน์ <strong>@255yxtaf</strong> เพื่อใช้งานต่อ</span>
          </div>
          <a href="https://line.me" target="_blank" rel="noreferrer" className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-0.5 rounded">
            ต่ออายุการใช้งาน
          </a>
        </div>
      )}

      {/* Permanent Watermark / Notice */}
      <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-1.5 text-xs text-yellow-300 flex items-center justify-between z-30 select-none">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
          <span>นี่คือระบบจาก <strong>PSAistudio</strong> หากท่านได้ระบบนี้จากที่อื่นแสดงว่าอาจกำลังถูกหลอก ถ้าต้องการระบบนี้จริงๆต้อง ไลน์ไอดี <strong className="text-white underline">@255yxtaf</strong> เท่านั้น</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeMenu={activeMenu} 
          onMenuChange={setActiveMenu} 
          onLogout={onLogout} 
        />
        <MainContent activeMenu={activeMenu} />
      </div>
    </div>
  );
}

// --- Main App ---
export default function App() {
  const [appState, setAppState] = useState<AppState>('login');

  if (appState === 'login') {
    return <Login onLogin={() => setAppState('dashboard')} />;
  }

  return (
    <AppProvider>
      <Dashboard onLogout={() => setAppState('login')} />
    </AppProvider>
  );
}

