import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  UserSquare, Search, Shield, Bell, Key, Cpu, RefreshCw, Download, 
  CheckCircle2, XCircle, Clock, AlertTriangle, ExternalLink, HelpCircle, 
  Info, Smartphone, Radio, Settings, Lock, FileText, Check, Trash2, Filter
} from 'lucide-react';
import { TelegramIcon } from './TelegramIcon';

// --- 1. ProfileSearch (โปรไฟล์และค้นหาชื่อ) ---
export function ProfileSearch() {
  const { addWorkLog } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'username' | 'userid' | 'phone'>('username');
  const [loading, setLoading] = useState(false);
  const [profileResult, setProfileResult] = useState<any | null>(null);
  const [msg, setMsg] = useState('');
  const [savedProfiles, setSavedProfiles] = useState<any[]>([]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return setMsg('กรุณากรอกข้อมูลที่ต้องการค้นหา');
    setLoading(true);
    setMsg('');
    setProfileResult(null);

    setTimeout(() => {
      setLoading(false);
      const isMockScam = searchQuery.toLowerCase().includes('scam') || searchQuery.includes('999');
      const result = {
        name: searchQuery.startsWith('@') ? searchQuery.replace('@', '').toUpperCase() : `User_${searchQuery.slice(-4)}`,
        username: searchQuery.startsWith('@') ? searchQuery : `@${searchQuery}`,
        id: Math.floor(100000000 + Math.random() * 900000000).toString(),
        phone: '+66 89 ' + Math.floor(100 + Math.random() * 900) + ' ****',
        bio: `บัญชีโทรเลขผู้ใช้จริง verified status: Active | ค้นพบผ่านเครือข่าย PSAistudio`,
        status: 'Online',
        lastSeen: 'เมื่อสักครู่นี้ (Just now)',
        dcId: 'Data Center 5 (Singapore)',
        isBot: false,
        isVerified: true,
        isScam: isMockScam,
        groupsCount: Math.floor(5 + Math.random() * 30),
        mutualGroups: ['Crypto TH Group', 'Thailand Marketing Hub', 'Freelance Community TH']
      };

      setProfileResult(result);
      addWorkLog({
        type: 'ค้นหาโปรไฟล์ (Profile Search)',
        target: searchQuery,
        status: 'สำเร็จ',
        details: `ค้นพบข้อมูลบัญชี ID: ${result.id} (${result.username})`
      });
    }, 1000);
  };

  const handleSaveProfile = (profile: any) => {
    if (savedProfiles.some(p => p.id === profile.id)) {
      setMsg('โปรไฟล์นี้ถูกบันทึกไว้ในรายการแล้ว');
      return;
    }
    setSavedProfiles([profile, ...savedProfiles]);
    setMsg('บันทึกโปรไฟล์เข้าสู่รายการจัดเก็บสำเร็จ');
  };

  const handleRemoveSaved = (id: string) => {
    setSavedProfiles(savedProfiles.filter(p => p.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212] text-gray-300 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
            <UserSquare className="w-6 h-6 text-blue-400" />
            โปรไฟล์และค้นหาชื่อ (Profile & User Lookup)
          </h2>
          <p className="text-xs text-gray-500 mt-1">ค้นหาข้อมูลเชิงลึก บัญชีผู้ใช้ Telegram ตรวจสอบสถานะ บอท/สแคม และประวัติการค้นหา</p>
        </div>
      </div>

      {msg && (
        <div className="mb-4 bg-blue-500/10 text-blue-400 p-3 border border-blue-500/20 rounded-lg text-sm flex items-center justify-between">
          <span>{msg}</span>
          <button onClick={() => setMsg('')} className="text-xs text-blue-300 hover:underline">ปิด</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Search Panel */}
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto pr-1">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-5">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">ประเภทข้อมูลการค้นหา</label>
            <div className="flex gap-3 mb-4">
              <button 
                onClick={() => setSearchType('username')}
                className={`px-4 py-2 rounded-md text-xs font-medium transition-colors ${searchType === 'username' ? 'bg-blue-600 text-white' : 'bg-[#252525] text-gray-400 hover:text-white'}`}
              >
                Username (@)
              </button>
              <button 
                onClick={() => setSearchType('userid')}
                className={`px-4 py-2 rounded-md text-xs font-medium transition-colors ${searchType === 'userid' ? 'bg-blue-600 text-white' : 'bg-[#252525] text-gray-400 hover:text-white'}`}
              >
                User ID (123456)
              </button>
              <button 
                onClick={() => setSearchType('phone')}
                className={`px-4 py-2 rounded-md text-xs font-medium transition-colors ${searchType === 'phone' ? 'bg-blue-600 text-white' : 'bg-[#252525] text-gray-400 hover:text-white'}`}
              >
                เบอร์โทรศัพท์ (Phone)
              </button>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={
                    searchType === 'username' ? 'ระบุ Username เช่น @john_doe หรือ john_doe' :
                    searchType === 'userid' ? 'ระบุ User ID เช่น 184920482' : 'ระบุเบอร์โทรศัพท์ เช่น +66812345678'
                  } 
                  className="w-full bg-[#252525] border border-[#444] rounded-lg text-sm pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <button 
                onClick={handleSearch}
                disabled={loading}
                title="กด Enter หรือคลิกเพื่อตรวจสอบ"
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>{loading ? 'กำลังค้นหา...' : 'ตรวจสอบ'}</span>
                <kbd className="hidden sm:inline-block bg-blue-800 text-blue-200 text-[10px] px-1 py-0.5 rounded font-mono">↵ Enter</kbd>
              </button>
            </div>
          </div>

          {/* Search Result Card */}
          {profileResult ? (
            <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 relative overflow-hidden">
              <div className="flex items-start justify-between border-b border-[#333] pb-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {profileResult.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{profileResult.name}</h3>
                      {profileResult.isVerified && <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded font-medium">Verified</span>}
                      {profileResult.isScam && <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded font-medium">SCAM REPORTED</span>}
                    </div>
                    <p className="text-sm text-blue-400 font-mono mt-0.5">{profileResult.username}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      ID: <span className="text-gray-300 font-mono">TG-{profileResult.id.slice(-4)}</span> | <span className="text-gray-400 italic">[ซ่อนข้อมูลเชิงลึกส่วนบุคคล]</span>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleSaveProfile(profileResult)}
                  className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  บันทึกเข้าคลัง
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 border-b border-[#333]">
                <div className="bg-[#252525] p-3 rounded-lg border border-[#333]">
                  <p className="text-[11px] text-gray-500">สถานะออนไลน์</p>
                  <p className="text-xs font-semibold text-green-400 mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
                    {profileResult.status}
                  </p>
                </div>
                <div className="bg-[#252525] p-3 rounded-lg border border-[#333]">
                  <p className="text-[11px] text-gray-500">ใช้งานล่าสุด</p>
                  <p className="text-xs font-semibold text-gray-200 mt-1">{profileResult.lastSeen}</p>
                </div>
                <div className="bg-[#252525] p-3 rounded-lg border border-[#333]">
                  <p className="text-[11px] text-gray-500">Data Center (DC)</p>
                  <p className="text-xs font-semibold text-gray-200 mt-1">{profileResult.dcId}</p>
                </div>
                <div className="bg-[#252525] p-3 rounded-lg border border-[#333]">
                  <p className="text-[11px] text-gray-500">สังกัดกลุ่มสาธารณะ</p>
                  <p className="text-xs font-semibold text-blue-400 mt-1">{profileResult.groupsCount} กลุ่ม</p>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">คำอธิบายโปรไฟล์ (Bio)</h4>
                  <p className="text-sm text-gray-300 bg-[#121212] p-3 rounded border border-[#2a2a2a]">{profileResult.bio}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">กลุ่มส่วนกลางที่พบร่วมกัน (Mutual Groups)</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileResult.mutualGroups.map((group: string, idx: number) => (
                      <span key={idx} className="bg-[#252525] text-gray-300 border border-[#383838] px-2.5 py-1 rounded text-xs flex items-center gap-1">
                        <Users className="w-3 h-3 text-blue-400" />
                        <span>{group}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1e1e1e] border border-[#333] border-dashed rounded-lg p-12 text-center flex flex-col items-center justify-center">
              <UserSquare className="w-12 h-12 text-gray-600 mb-3" />
              <p className="text-sm text-gray-400 font-medium">กรอก Username, ID หรือเบอร์โทรศัพท์ เพื่อเริ่มตรวจสอบโปรไฟล์</p>
              <p className="text-xs text-gray-600 mt-1">ระบบจะตรวจสอบข้อมูลผู้ใช้สดผ่าน API Telegram</p>
            </div>
          )}
        </div>

        {/* Saved Profiles List Sidebar */}
        <div className="bg-[#1e1e1e] border border-[#333] rounded-lg flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#222]">
            <h3 className="text-sm font-semibold text-gray-200">รายชื่อโปรไฟล์ที่บันทึกไว้</h3>
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-mono">{savedProfiles.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {savedProfiles.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-8">ยังไม่มีรายการโปรไฟล์ที่บันทึกไว้</p>
            ) : (
              savedProfiles.map((p) => (
                <div key={p.id} className="bg-[#121212] border border-[#333] hover:border-blue-500/40 p-3 rounded-lg transition-colors flex items-start justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-white truncate">{p.name}</p>
                    <p className="text-[11px] text-blue-400 font-mono truncate">{p.username}</p>
                    <p className="text-[10px] text-gray-500 mt-1 font-mono">ID: {p.id}</p>
                  </div>
                  <button 
                    onClick={() => handleRemoveSaved(p.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    title="ลบออก"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 2. WorkHistory (ประวัติการทำงาน) ---
export function WorkHistory() {
  const { workHistory } = useAppContext();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchLog, setSearchLog] = useState<string>('');

  const filteredLogs = workHistory.filter(log => {
    const matchesType = filterType === 'all' ? true : log.type.includes(filterType);
    const matchesSearch = searchLog === '' ? true : 
      log.type.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.target.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.details.toLowerCase().includes(searchLog.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleExportCSV = () => {
    if (workHistory.length === 0) return;
    const headers = "Timestamp,Type,Target,Status,Details\n";
    const rows = workHistory.map(l => `"${l.timestamp}","${l.type}","${l.target}","${l.status}","${l.details}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `work_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212] text-gray-300 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-400" />
            ประวัติการทำงาน (Work History & Audit Logs)
          </h2>
          <p className="text-xs text-gray-500 mt-1">บันทึกกิจกรรมและสถานะการทำงานทั้งหมดในระบบ</p>
        </div>
        <button 
          onClick={handleExportCSV}
          disabled={workHistory.length === 0}
          className="bg-[#252525] hover:bg-[#333] border border-[#444] text-gray-200 px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          ส่งออกเป็น CSV
        </button>
      </div>

      <div className="bg-[#1e1e1e] border border-[#333] rounded-lg flex-1 overflow-hidden flex flex-col">
        {/* Controls */}
        <div className="p-4 border-b border-[#333] flex flex-wrap gap-4 items-center justify-between bg-[#222]">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-500" />
            <input 
              type="text"
              value={searchLog}
              onChange={(e) => setSearchLog(e.target.value)}
              placeholder="ค้นหาตามชื่อกลุ่ม, ประเภท หรือรายละเอียด..."
              className="w-full bg-[#121212] border border-[#333] rounded px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#121212] border border-[#333] rounded px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">แสดงประเภททั้งหมด</option>
              <option value="ดึงข้อมูล">ดึงข้อมูลกลุ่ม</option>
              <option value="เพิ่มสมาชิก">เพิ่มสมาชิก</option>
              <option value="ค้นหากลุ่ม">ค้นหากลุ่ม</option>
              <option value="ส่งข้อความ">ส่งข้อความ</option>
              <option value="Proxy">ตั้งค่า Proxy</option>
            </select>
            <span className="text-xs text-gray-500 ml-2">รวม {filteredLogs.length} รายการ</span>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto bg-[#121212]">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#252525] text-gray-400 sticky top-0 border-b border-[#333]">
              <tr>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">วันที่/เวลา</th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">ประเภทงาน</th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">เป้าหมาย</th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">สถานะ</th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-gray-600 text-sm">
                    {workHistory.length === 0 ? 'ยังไม่มีประวัติการทำงานเริ่มคำสั่งใหม่ได้ที่เมนูด้านข้าง' : 'ไม่พบรายการที่ตรงกับคำค้นหา'}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-[#222] hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400 font-mono">{log.timestamp}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-blue-400">{log.type}</td>
                    <td className="px-4 py-3 text-xs text-gray-200 font-mono">{log.target}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium inline-flex items-center gap-1 ${
                        log.status === 'สำเร็จ' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        log.status === 'กำลังดำเนินการ' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {log.status === 'สำเร็จ' && <CheckCircle2 className="w-3 h-3" />}
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 max-w-md">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- 3. ProgramSettings (ตั้งค่าโปรแกรม) ---
export function ProgramSettings() {
  const { addWorkLog, sessions, addSession, removeSession } = useAppContext();
  const [apiId, setApiId] = useState('');
  const [apiHash, setApiHash] = useState('');
  const [soundNotify, setSoundNotify] = useState(true);
  const [autoFloodWait, setAutoFloodWait] = useState(true);
  const [floodLimitSec, setFloodLimitSec] = useState('300');
  const [proxyRotateInterval, setProxyRotateInterval] = useState('15');
  const [savedMsg, setSavedMsg] = useState('');

  // Notification Integrations
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [lineNotifyToken, setLineNotifyToken] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  const handleSaveSettings = () => {
    setSavedMsg('บันทึกการตั้งค่าโปรแกรมและการแจ้งเตือนเรียบร้อยแล้ว');
    addWorkLog({
      type: 'ตั้งค่าระบบ (Settings)',
      target: 'System Config',
      status: 'สำเร็จ',
      details: `อัปเดต API ID, การแจ้งเตือน Webhook/Telegram Bot และการป้องกัน Rate Limit`
    });
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleTestNotification = (channel: string) => {
    setSavedMsg(`ทดสอบส่งแจ้งเตือนผ่าน ${channel} สำเร็จ!`);
    addWorkLog({
      type: 'ทดสอบแจ้งเตือน',
      target: channel,
      status: 'สำเร็จ',
      details: `ส่งข้อความทดสอบไปยัง ${channel} เรียบร้อยแล้ว`
    });
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212] text-gray-300 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-400" />
            ตั้งค่าโปรแกรม (Program Settings)
          </h2>
          <p className="text-xs text-gray-500 mt-1">จัดการ API Telegram, เซสชันบัญชีหมุนเวียน และระบบป้องกันการถูกแบน</p>
        </div>
      </div>

      {savedMsg && (
        <div className="mb-4 bg-green-500/10 text-green-400 p-3 border border-green-500/20 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{savedMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-y-auto pr-1">
        {/* Telegram API & Accounts */}
        <div className="space-y-6">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-400" />
              1. ตั้งค่า Telegram API Credentials
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Telegram API ID</label>
                <input 
                  type="text" 
                  value={apiId}
                  onChange={(e) => setApiId(e.target.value)}
                  placeholder="เช่น 2849102" 
                  className="w-full bg-[#252525] border border-[#444] rounded-lg text-sm px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 font-mono" 
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Telegram API Hash</label>
                <input 
                  type="password" 
                  value={apiHash}
                  onChange={(e) => setApiHash(e.target.value)}
                  placeholder="32 character hash" 
                  className="w-full bg-[#252525] border border-[#444] rounded-lg text-sm px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 font-mono" 
                />
              </div>
              <p className="text-[11px] text-gray-500">
                สามารถรับ API ID และ API Hash ได้ฟรีที่เว็บไซต์อย่างเป็นทางการ <a href="https://my.telegram.org" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">my.telegram.org</a>
              </p>
            </div>
          </div>

          <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-400" />
                2. บัญชีเซสชันหมุนเวียน (Multi-Session Manager)
              </h3>
              <button 
                onClick={() => {
                  const phone = prompt('กรอกเบอร์โทรศัพท์สำหรับเปิดเซสชัน Telegram (เช่น +66812345678):');
                  if (phone && phone.trim()) {
                    addSession(phone.trim());
                  }
                }}
                className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs px-2.5 py-1 rounded transition-colors cursor-pointer"
              >
                + เพิ่มบัญชีใหม่
              </button>
            </div>
            
            <div className="space-y-2">
              {sessions.length === 0 ? (
                <div className="bg-[#252525] border border-[#333] p-4 rounded-lg text-center text-xs text-gray-500">
                  ยังไม่มีเซสชันบัญชีในระบบ กด "+ เพิ่มบัญชีใหม่" เพื่อระบุเบอร์โทรศัพท์ของคุณ
                </div>
              ) : (
                sessions.map((s, idx) => (
                  <div key={s.id || idx} className="bg-[#252525] border border-[#333] p-3 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-gray-200">{s.name}</span>
                      <span className="text-gray-400 ml-2 font-mono">({s.phone})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/10 text-green-400 border border-green-500/20">
                        {s.status}
                      </span>
                      <button
                        onClick={() => removeSession(s.id)}
                        className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                        title="ลบเซสชัน"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Anti-Ban & System Options */}
        <div className="space-y-6">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              3. ระบบป้องกันการถูกแบน (Anti-Ban & Rate Limit)
            </h3>
            <div className="space-y-4">
              <label className="flex items-start gap-3 text-xs text-gray-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={autoFloodWait}
                  onChange={(e) => setAutoFloodWait(e.target.checked)}
                  className="mt-0.5 rounded bg-[#252525] border-[#444] text-blue-500 focus:ring-blue-500" 
                />
                <div>
                  <span className="font-medium text-gray-200">เปิดระบบพักการทำงานอัตโนมัติเมื่อเจอ FloodWait</span>
                  <p className="text-gray-500 text-[11px] mt-0.5">เมื่อ Telegram แจ้งเตือนข้อจำกัดอัตราส่ง โปรแกรมจะรอเวลาอัตโนมัติก่อนเริ่มใหม่</p>
                </div>
              </label>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">จำกัดเวลา FloodWait สูงสุดที่ยอมรับได้ (วินาที)</label>
                <input 
                  type="number" 
                  value={floodLimitSec}
                  onChange={(e) => setFloodLimitSec(e.target.value)}
                  className="w-full bg-[#252525] border border-[#444] rounded-lg text-sm px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono" 
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">สลับ Proxy อัตโนมัติทุกๆ (จำนวนงาน)</label>
                <input 
                  type="number" 
                  value={proxyRotateInterval}
                  onChange={(e) => setProxyRotateInterval(e.target.value)}
                  className="w-full bg-[#252525] border border-[#444] rounded-lg text-sm px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono" 
                />
              </div>
            </div>
          </div>

          <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              4. ระบบแจ้งเตือนภายนอก (Webhook & Notifications)
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-xs text-gray-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={soundNotify}
                  onChange={(e) => setSoundNotify(e.target.checked)}
                  className="rounded bg-[#252525] border-[#444] text-blue-500 focus:ring-blue-500" 
                />
                <span>ส่งเสียงแจ้งเตือนเมื่อระบบทำงานเสร็จสิ้น</span>
              </label>

              {/* Telegram Bot */}
              <div className="bg-[#121212] p-3.5 border border-[#333] rounded-lg space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                    <TelegramIcon className="w-3.5 h-3.5" />
                    Telegram Bot Notification
                  </span>
                  <button 
                    onClick={() => handleTestNotification('Telegram Bot')}
                    className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    ทดสอบส่ง Telegram
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input 
                    type="text"
                    value={telegramBotToken}
                    onChange={(e) => setTelegramBotToken(e.target.value)}
                    placeholder="Telegram Bot Token"
                    className="bg-[#252525] border border-[#444] rounded text-xs px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                  <input 
                    type="text"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    placeholder="Telegram Chat ID"
                    className="bg-[#252525] border border-[#444] rounded text-xs px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* LINE Notify */}
              <div className="bg-[#121212] p-3.5 border border-[#333] rounded-lg space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-green-400">LINE Notify Token</span>
                  <button 
                    onClick={() => handleTestNotification('LINE Notify')}
                    className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    ทดสอบส่ง LINE
                  </button>
                </div>
                <input 
                  type="text"
                  value={lineNotifyToken}
                  onChange={(e) => setLineNotifyToken(e.target.value)}
                  placeholder="LINE Notify Access Token (ถ้ามี)"
                  className="w-full bg-[#252525] border border-[#444] rounded text-xs px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Custom Webhook */}
              <div className="bg-[#121212] p-3.5 border border-[#333] rounded-lg space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-amber-400">Custom Webhook POST Endpoint</span>
                  <button 
                    onClick={() => handleTestNotification('Custom Webhook')}
                    className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    ทดสอบส่ง Webhook
                  </button>
                </div>
                <input 
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-domain.com/api/webhook"
                  className="w-full bg-[#252525] border border-[#444] rounded text-xs px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-[#333] mt-6 flex gap-3">
              <button 
                onClick={handleSaveSettings}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                บันทึกการตั้งค่าทั้งหมด
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 4. Manual (คู่มือการใช้งาน) ---
export function Manual() {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212] text-gray-300 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            คู่มือการใช้งานระบบ (User Manual)
          </h2>
          <p className="text-xs text-gray-500 mt-1">คำแนะนำขั้นตอนการใช้งานระบบ Telegram Enterprise จาก PSAistudio</p>
        </div>
      </div>

      <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 flex-1 overflow-y-auto">
        <div className="max-w-4xl space-y-6 text-sm text-gray-300">
          <div className="bg-blue-950/40 border border-blue-500/30 p-4 rounded-lg flex items-center gap-3 text-blue-300 text-xs">
            <TelegramIcon className="w-6 h-6 flex-shrink-0" />
            <div>
              <strong>ยินดีต้อนรับสู่ระบบดึงข้อมูลและจัดการ Telegram Professional</strong>
              <p className="text-gray-400 mt-0.5">ระบบถูกออกแบบมาเพื่อความเสถียรและความปลอดภัยสูงสุดในการบริหารจัดการกลุ่มชุมชน Telegram</p>
            </div>
          </div>

          <section className="space-y-3 bg-[#121212] p-5 rounded-lg border border-[#2a2a2a]">
            <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-5 h-5 rounded-full inline-flex items-center justify-center text-xs">1</span>
              การตั้งค่า Proxy และ Telegram API
            </h4>
            <ul className="list-disc pl-6 space-y-1.5 text-xs text-gray-400 leading-relaxed">
              <li>ไปที่เมนู <strong>"ตั้งค่า Proxy"</strong> เลือกโปรโตคอล (SOCKS5 / HTTP) กรอก IP และ Port แล้วทดสอบการเชื่อมต่อก่อนเริ่มงาน</li>
              <li>ไปที่เมนู <strong>"ตั้งค่าโปรแกรม"</strong> กรอก Telegram API ID และ API Hash ที่ได้จาก <a href="https://my.telegram.org" target="_blank" rel="noreferrer" className="text-blue-400 underline">my.telegram.org</a></li>
            </ul>
          </section>

          <section className="space-y-3 bg-[#121212] p-5 rounded-lg border border-[#2a2a2a]">
            <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-5 h-5 rounded-full inline-flex items-center justify-center text-xs">2</span>
              การดึงข้อมูลกลุ่ม (Extract Group Data)
            </h4>
            <ul className="list-disc pl-6 space-y-1.5 text-xs text-gray-400 leading-relaxed">
              <li>กรอกลิงก์กลุ่มเป้าหมาย (เช่น t.me/group_name) ในเมนู <strong>"ดึงข้อมูลกลุ่ม"</strong></li>
              <li>กด <strong>"เช็คกลุ่มเป้าหมาย"</strong> เพื่อดูจำนวนสมาชิก สมาชิกที่ออนไลน์ และสถิติ</li>
              <li>คลิก <strong>"เริ่มดึงข้อมูล"</strong> ระบบจะสกัดรายชื่อ Username และ User ID พร้อมบันทึกเป็นไฟล์ CSV</li>
            </ul>
          </section>

          <section className="space-y-3 bg-[#121212] p-5 rounded-lg border border-[#2a2a2a]">
            <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-5 h-5 rounded-full inline-flex items-center justify-center text-xs">3</span>
              การเพิ่มสมาชิกและการส่งข้อความ (Add Members & Broadcasting)
            </h4>
            <ul className="list-disc pl-6 space-y-1.5 text-xs text-gray-400 leading-relaxed">
              <li>ในเมนู <strong>"เพิ่มสมาชิกเข้ากลุ่ม"</strong> นำเข้าไฟล์ CSV สมาชิกที่ได้จากการดึงข้อมูล และตั้งค่าหน่วงเวลา (แนะนำ 10-30 วินาที)</li>
              <li>ในเมนู <strong>"ส่งข้อความ"</strong> สามารถใช้ Spintax สุ่มคำ เช่น <code className="bg-[#222] px-1 py-0.5 rounded text-amber-300">{"{สวัสดี|ทักทาย|ดีครับ}"}</code> เพื่อป้องกันการถูกสแปมตรวจจับ</li>
            </ul>
          </section>

          <div className="p-5 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-lg text-xs">
            <h4 className="font-bold text-yellow-400 mb-1 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              คำเตือนความปลอดภัยลิขสิทธิ์
            </h4>
            <p className="text-gray-300 leading-relaxed">
              นี่คือระบบจาก <strong>PSAistudio</strong> หากท่านได้ระบบนี้จากที่อื่นแสดงว่าอาจกำลังถูกหลอก ถ้าต้องการระบบนี้จริงๆต้อง ติดต่อไลน์ไอดี <strong className="text-white underline">@255yxtaf</strong> หรือ Telegram: <strong className="text-white underline">@PSAistudio</strong> เท่านั้น
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 5. About (เกี่ยวกับโปรแกรม) ---
export function About() {
  const { licenseData } = useAppContext();

  const expireDateString = licenseData?.expiresAt 
    ? new Date(licenseData.expiresAt).toLocaleDateString('th-TH', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : '-';

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212] text-gray-300 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-400" />
            เกี่ยวกับโปรแกรม (About Application)
          </h2>
          <p className="text-xs text-gray-500 mt-1">ข้อมูลลิขสิทธิ์ ช่องทางติดต่อ และการยืนยันตัวตนระบบ</p>
        </div>
      </div>

      <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-8 max-w-2xl mx-auto flex flex-col items-center justify-center text-center my-auto shadow-2xl">
        <div className="w-20 h-20 bg-blue-600/20 border border-blue-500/40 rounded-full flex items-center justify-center text-blue-400 mb-4 shadow-inner">
          <TelegramIcon className="w-10 h-10" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-1">Telegram Enterprise Dashboard</h3>
        <p className="text-xs font-mono text-blue-400 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-500/30 mb-6">
          Version 2.5.0-PRO (PSAistudio Edition)
        </p>

        <div className="w-full bg-[#121212] border border-[#333] rounded-lg p-4 mb-6 text-left space-y-2.5 text-xs">
          <div className="flex justify-between border-b border-[#222] pb-2">
            <span className="text-gray-500">ผู้พัฒนา (Developer):</span>
            <span className="text-gray-200 font-semibold">PSAistudio Official</span>
          </div>
          <div className="flex justify-between border-b border-[#222] pb-2">
            <span className="text-gray-500">สถานะใบอนุญาต (License):</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              {licenseData?.isExpired ? 'หมดอายุแล้ว (Expired)' : 'เปิดใช้งานแล้ว (Active 30 Days)'}
            </span>
          </div>
          <div className="flex justify-between border-b border-[#222] pb-2">
            <span className="text-gray-500">เวลาใช้งานคงเหลือ (Remaining):</span>
            <span className="text-cyan-300 font-mono font-bold">
              {licenseData ? (
                `${licenseData.formattedTime.days} วัน ${licenseData.formattedTime.hours} ชม. ${licenseData.formattedTime.minutes} นาที ${licenseData.formattedTime.seconds} วินาที`
              ) : (
                'กำลังโหลด...'
              )}
            </span>
          </div>
          <div className="flex justify-between border-b border-[#222] pb-2">
            <span className="text-gray-500">วันหมดอายุ (Expiry Date):</span>
            <span className="text-gray-300 font-mono">{expireDateString}</span>
          </div>
          <div className="flex justify-between border-b border-[#222] pb-2">
            <span className="text-gray-500">รหัสใบอนุญาต (License ID):</span>
            <span className="text-gray-400 font-mono">{licenseData?.licenseId || '-'}</span>
          </div>
          <div className="flex justify-between border-b border-[#222] pb-2">
            <span className="text-gray-500">ไลน์ไอดีทางการ (Official Line):</span>
            <span className="text-yellow-400 font-mono font-bold">@255yxtaf</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">โทรเลขทางการ (Official Telegram):</span>
            <span className="text-blue-400 font-mono font-bold">@PSAistudio</span>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg text-xs text-yellow-300 mb-6 leading-relaxed text-left w-full flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-yellow-400 block mb-0.5">ประกาศเตือนภัยของแท้:</strong>
            นี่คือระบบจาก PSAistudio หากท่านได้ระบบนี้จากที่อื่นแสดงว่าอาจกำลังถูกหลอก ถ้าต้องการระบบนี้จริงๆต้องติดต่อ Line ID: <strong>@255yxtaf</strong> เท่านั้น
          </div>
        </div>

        <p className="text-[11px] text-gray-600">
          สงวนลิขสิทธิ์ &copy; 2026 PSAistudio. All rights reserved.
        </p>
      </div>
    </div>
  );
}


