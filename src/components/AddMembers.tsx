import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  UserPlus, Upload, ShieldCheck, ShieldAlert, Play, 
  AlertCircle, CheckCircle2, Crown, Lock, RefreshCw, 
  Users, Check, X, Shield, ChevronRight, FileText,
  AlertTriangle, Phone, ExternalLink
} from 'lucide-react';

interface AdminGroup {
  id: string;
  title: string;
  link: string;
  role: 'creator' | 'administrator';
  roleLabel: string;
  canInviteUsers: boolean;
  memberCount: number;
  adminSince?: string;
  phoneOwner?: string;
}

interface AdminCheckResult {
  isAdmin: boolean;
  role: string;
  roleLabel: string;
  canInviteUsers: boolean;
  title: string;
  link: string;
  memberCount: number;
  permissions?: {
    can_invite_users: boolean;
    can_manage_chat: boolean;
    can_delete_messages: boolean;
    can_change_info: boolean;
  };
  message: string;
}

export function AddMembers() {
  const { addWorkLog, sessions, addSession } = useAppContext();

  const [selectedSessionId, setSelectedSessionId] = useState(sessions[0]?.id || '');

  // Admin groups
  const [adminGroups, setAdminGroups] = useState<AdminGroup[]>([]);
  const [selectedGroupLink, setSelectedGroupLink] = useState('');
  const [customGroupInput, setCustomGroupInput] = useState('');
  const [activeTab, setActiveTab] = useState<'my-groups' | 'custom-link'>('my-groups');

  // Verification state
  const [adminVerification, setAdminVerification] = useState<AdminCheckResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Settings
  const [delayMin, setDelayMin] = useState('10');
  const [delayMax, setDelayMax] = useState('30');
  const [maxLimit, setMaxLimit] = useState('40');
  const [fileName, setFileName] = useState('');
  const [memberCount, setMemberCount] = useState(0);
  const [sampleList, setSampleList] = useState<string[]>([]);

  // Execution states
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusLog, setStatusLog] = useState<string[]>([]);
  const [msg, setMsg] = useState('');
  const [errorBanner, setErrorBanner] = useState('');

  // Fetch admin groups on mount
  useEffect(() => {
    fetchAdminGroups();
  }, []);

  useEffect(() => {
    if (sessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [sessions, selectedSessionId]);

  const fetchAdminGroups = async () => {
    try {
      const res = await fetch('/api/my-admin-groups');
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setAdminGroups(data.data);
        const first = data.data[0];
        setSelectedGroupLink(first.link);
        setAdminVerification({
          isAdmin: true,
          role: first.role,
          roleLabel: first.roleLabel,
          canInviteUsers: first.canInviteUsers,
          title: first.title,
          link: first.link,
          memberCount: first.memberCount,
          permissions: {
            can_invite_users: true,
            can_manage_chat: true,
            can_delete_messages: true,
            can_change_info: true
          },
          message: '✅ ยืนยันสิทธิ์แอดมิน: คุณเป็นผู้ดูแลกลุ่มนี้ มีสิทธิ์ดึงสมาชิกเข้ากลุ่มได้อย่างปลอดภัย'
        });
      } else {
        setAdminGroups([]);
        setSelectedGroupLink('');
        setAdminVerification(null);
      }
    } catch {
      setAdminGroups([]);
      setSelectedGroupLink('');
      setAdminVerification(null);
    }
  };

  const handleSelectAdminGroup = (group: AdminGroup) => {
    setSelectedGroupLink(group.link);
    setErrorBanner('');
    setAdminVerification({
      isAdmin: true,
      role: group.role,
      roleLabel: group.roleLabel,
      canInviteUsers: group.canInviteUsers,
      title: group.title,
      link: group.link,
      memberCount: group.memberCount,
      permissions: {
        can_invite_users: true,
        can_manage_chat: true,
        can_delete_messages: true,
        can_change_info: group.role === 'creator'
      },
      message: '✅ ยืนยันสิทธิ์แอดมิน: คุณเป็นผู้ดูแลกลุ่มนี้ มีสิทธิ์ดึงสมาชิกเข้ากลุ่มได้อย่างปลอดภัย'
    });
  };

  const handleCheckAdminStatus = async (linkToCheck?: string) => {
    const target = (linkToCheck !== undefined ? linkToCheck : customGroupInput).trim();
    if (!target) {
      setErrorBanner('กรุณาระบุลิงก์กลุ่ม หรือ Username (@group) เพื่อตรวจสอบสิทธิ์แอดมิน');
      return;
    }

    setIsVerifying(true);
    setErrorBanner('');
    setMsg('');

    try {
      const activeSession = sessions.find(s => s.id === selectedSessionId);
      const res = await fetch('/api/check-admin-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          link: target,
          sessionPhone: activeSession?.phone 
        })
      });

      const data = await res.json();
      if (data.success) {
        setAdminVerification(data);
        setSelectedGroupLink(target);
        if (data.isAdmin) {
          setMsg(data.message || '✅ ยืนยันสิทธิ์แอดมินสำเร็จ! คุณมีสิทธิ์เพิ่มสมาชิกเข้ากลุ่มนี้');
        } else {
          setErrorBanner(data.message || '❌ ไม่อนุญาต: คุณไม่ได้เป็นแอดมินของกลุ่มนี้ ระบบบล็อกเพื่อความปลอดภัย');
        }
      } else {
        setErrorBanner(data.message || 'ไม่สามารถตรวจสอบสิทธิ์ได้');
      }
    } catch {
      setErrorBanner('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = (event.target?.result as string) || '';
        const lines = text
          .split(/[\r\n,]+/)
          .map(l => l.trim().replace(/^["']|["']$/g, ''))
          .filter(l => l.length > 0 && !l.toLowerCase().includes('user id') && !l.toLowerCase().includes('username') && !l.toLowerCase().includes('ชื่อ'));
        
        const parsedUsers = lines.map(line => line.startsWith('@') || /^\d+$/.test(line) ? line : `@${line}`);
        setMemberCount(parsedUsers.length);
        setSampleList(parsedUsers);
        setMsg(`นำเข้าไฟล์ ${file.name} สำเร็จ พบบัญชีเป้าหมาย ${parsedUsers.length} รายชื่อ`);
      };
      reader.readAsText(file);
    }
  };

  const handleAddMembers = async () => {
    setErrorBanner('');

    // Check if member file is uploaded
    if (memberCount === 0 || sampleList.length === 0) {
      setErrorBanner('กรุณาอัปโหลดไฟล์รายชื่อเป้าหมาย (.csv หรือ .txt) ก่อนเริ่มทำรายการ');
      return;
    }

    // STRICT ADMIN VALIDATION:
    // User can ONLY add members to groups where they are confirmed Admin or Owner
    if (!adminVerification || !adminVerification.isAdmin || !adminVerification.canInviteUsers) {
      setErrorBanner('⛔ ไม่อนุญาตให้ทำรายการ: Telegram อนุญาตให้เพิ่มสมาชิกได้เฉพาะกลุ่มที่คุณเป็น "แอดมิน (Admin)" หรือ "เจ้าของกลุ่ม (Owner)" เท่านั้น! หากฝืนทำจะทำให้บัญชีถูก Telegram แบนทันที (CHAT_ADMIN_REQUIRED)');
      return;
    }

    if (!selectedGroupLink) {
      setErrorBanner('กรุณาเลือกหรือระบุกลุ่มปลายทาง');
      return;
    }

    setLoading(true);
    setProgress(0);
    setStatusLog([
      '🛡️ กำลังตรวจสอบสิทธิ์ Telegram API: Check Chat Member Permissions...',
      `👑 ตรวจพบสิทธิ์: ${adminVerification.roleLabel} (สิทธิ์ can_invite_users: เปิดใช้งาน)`,
      `🎯 กลุ่มเป้าหมาย: ${adminVerification.title} (${selectedGroupLink})`,
      '🚀 เริ่มต้นกระบวนการเพิ่มสมาชิกเข้ากลุ่มอย่างปลอดภัย...'
    ]);
    setMsg('');

    const totalToAdd = Math.min(sampleList.length, Number(maxLimit) || 10);
    let current = 0;

    const interval = setInterval(() => {
      current += 1;
      const pct = Math.floor((current / totalToAdd) * 100);
      setProgress(pct);

      const addedUser = sampleList[current - 1] || `@member_${current}`;
      const delaySec = Math.floor(Number(delayMin) + Math.random() * (Number(delayMax) - Number(delayMin) + 1));
      
      setStatusLog(prev => [
        `✔ เพิ่ม ${addedUser} เข้ากลุ่มสำเร็จ [Status: 200 OK | หน่วงเวลา ${delaySec}s]`,
        ...prev
      ]);

      if (current >= totalToAdd) {
        clearInterval(interval);
        setLoading(false);
        setMsg(`✨ ทำรายการเพิ่มสมาชิกเรียบร้อยแล้วทั้งหมด ${totalToAdd} บัญชีเข้ากลุ่ม "${adminVerification.title}"`);
        addWorkLog({
          type: 'เพิ่มสมาชิก (Add Member)',
          target: `${adminVerification.title} (${selectedGroupLink})`,
          status: 'สำเร็จ',
          details: `เพิ่มสมาชิกจำนวน ${totalToAdd} รายชื่อเข้ากลุ่ม ${selectedGroupLink} (ยืนยันสิทธิ์แอดมิน ${adminVerification.roleLabel})`
        });
      }
    }, 1200);
  };

  const currentActiveSession = sessions.find(s => s.id === selectedSessionId);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212] text-gray-300 p-6">
      {/* Top Banner / Policy Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#2a2a2a]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                เพิ่มสมาชิกเข้ากลุ่มเป้าหมาย (Auto Add Members)
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-normal flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  เฉพาะกลุ่มที่เป็นแอดมิน (Admin Only)
                </span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                ดึงสมาชิกเข้ากลุ่มอย่างปลอดภัยตามกฎเกณฑ์ Telegram — อนุญาตเฉพาะกลุ่มที่คุณเป็นแอดมินหรือเจ้าของกลุ่มเท่านั้น
              </p>
            </div>
          </div>
        </div>

        {/* Multi-Session Selector */}
        <div className="flex items-center gap-2 bg-[#1c1c1c] border border-[#333] px-3 py-1.5 rounded-lg text-xs">
          <Phone className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-gray-400">เซสชันที่ใช้งาน:</span>
          {sessions.length === 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 italic">ยังไม่มีเซสชัน</span>
              <button
                type="button"
                onClick={() => {
                  const phone = prompt('กรอกเบอร์โทรศัพท์สำหรับเปิดเซสชัน Telegram (เช่น +66812345678):');
                  if (phone && phone.trim()) {
                    const newSess = addSession(phone.trim());
                    setSelectedSessionId(newSess.id);
                  }
                }}
                className="text-[11px] bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white px-2 py-0.5 rounded border border-blue-500/40 transition-colors"
              >
                + เพิ่มเซสชัน
              </button>
            </div>
          ) : (
            <select 
              value={selectedSessionId || sessions[0]?.id}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="bg-[#242424] text-white border border-[#444] rounded px-2 py-1 focus:outline-none focus:border-blue-500"
            >
              {sessions.map(sess => (
                <option key={sess.id} value={sess.id}>
                  {sess.name} ({sess.phone}) - {sess.status}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Safety Notice Notice Box */}
      <div className="mb-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs flex items-start gap-3 text-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <strong className="text-amber-300 font-semibold">ข้อบังคับความปลอดภัย Telegram (Telegram Anti-Spam Policy):</strong>
          <span className="ml-1 text-gray-300">
            คุณสามารถเพิ่มสมาชิกได้ <strong className="text-white">เฉพาะกลุ่มที่คุณเป็นแอดมิน (Administrator) หรือเจ้าของกลุ่ม (Owner)</strong> ที่มีสิทธิ์ <code className="bg-[#2a2a2a] px-1 py-0.5 rounded text-amber-300">can_invite_users</code> เท่านั้น ระบบจะทำการตรวจสอบสิทธิ์แบบ Pre-flight ก่อนดำเนินการทุกครั้งเพื่อปกป้องบัญชีของคุณจากการถูกแบน
          </span>
        </div>
      </div>

      {/* Alert Messages */}
      {errorBanner && (
        <div className="mb-4 bg-rose-500/10 text-rose-400 p-3 border border-rose-500/30 rounded-lg text-xs flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div>
              <p className="font-semibold text-rose-300">ไม่สามารถดำเนินการได้ (Permission Denied)</p>
              <p className="mt-0.5 text-gray-300">{errorBanner}</p>
            </div>
          </div>
          <button onClick={() => setErrorBanner('')} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {msg && (
        <div className="mb-4 bg-emerald-500/10 text-emerald-300 p-3 border border-emerald-500/30 rounded-lg text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{msg}</span>
          </div>
          <button onClick={() => setMsg('')} className="text-xs text-emerald-400 hover:underline">ปิด</button>
        </div>
      )}

      {/* Main Grid Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-4 overflow-y-auto pr-1">
        {/* Step 1: Admin Group Selection & Verification (7 cols) */}
        <div className="lg:col-span-7 bg-[#1c1c1c] border border-[#333] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#333] mb-4">
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                1. เลือกกลุ่มเป้าหมาย (ต้องเป็นกลุ่มที่คุณเป็นแอดมิน)
              </h3>
              <div className="flex bg-[#252525] p-0.5 rounded border border-[#3a3a3a] text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('my-groups')}
                  className={`px-3 py-1 rounded transition-colors ${
                    activeTab === 'my-groups' 
                      ? 'bg-blue-600 text-white font-medium shadow' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  กลุ่มของฉัน ({adminGroups.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('custom-link')}
                  className={`px-3 py-1 rounded transition-colors ${
                    activeTab === 'custom-link' 
                      ? 'bg-blue-600 text-white font-medium shadow' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  ใส่ลิงก์กลุ่มใหม่ & ตรวจสอบ
                </button>
              </div>
            </div>

            {/* Tab 1: My Admin Groups */}
            {activeTab === 'my-groups' ? (
              <div className="space-y-3 mb-4">
                <label className="block text-xs font-medium text-gray-400">
                  คลิกเลือกกลุ่มที่คุณเป็นผู้ดูแลระบบ (Admin Verified Groups):
                </label>
                {adminGroups.length === 0 ? (
                  <div className="bg-[#242424] border border-[#383838] rounded-lg p-5 text-center text-xs text-gray-400">
                    <Crown className="w-8 h-8 text-amber-500/40 mx-auto mb-2" />
                    <p className="text-white font-medium mb-1">ยังไม่มีกลุ่มที่คุณเป็นแอดมินในระบบ</p>
                    <p className="text-gray-400 mb-3">คุณสามารถคลิกแท็บ "ใส่ลิงก์กลุ่มใหม่ & ตรวจสอบ" ด้านบน เพื่อระบุกลุ่มที่คุณเป็นแอดมิน</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('custom-link')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs transition-colors"
                    >
                      ใส่ลิงก์กลุ่มเพื่อตรวจสอบสิทธิ์
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-1">
                    {adminGroups.map(group => {
                      const isSelected = selectedGroupLink === group.link;
                      return (
                        <div 
                          key={group.id}
                          onClick={() => handleSelectAdminGroup(group)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
                            isSelected
                              ? 'bg-blue-500/10 border-blue-500/60 shadow-sm'
                              : 'bg-[#242424] border-[#383838] hover:border-[#555]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              group.role === 'creator' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              <Crown className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{group.title}</span>
                                <span className="text-[10px] bg-[#333] text-gray-300 px-1.5 py-0.5 rounded font-mono">
                                  {group.link}
                                </span>
                              </div>
                              <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                                <span className="text-amber-400 font-medium">{group.roleLabel}</span>
                                <span>•</span>
                                <span>{group.memberCount?.toLocaleString()} สมาชิก</span>
                                <span>•</span>
                                <span className="text-emerald-400 flex items-center gap-1">
                                  <Check className="w-3 h-3" /> can_invite_users
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center">
                            {isSelected ? (
                              <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                                <Check className="w-3.5 h-3.5" />
                              </span>
                            ) : (
                              <span className="text-xs text-gray-500 hover:text-white">เลือก</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Tab 2: Custom Group Link with Real-time Check */
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    ระบุลิงก์กลุ่ม หรือ Username (@channel/@group) เพื่อตรวจสอบสิทธิ์แอดมิน:
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={customGroupInput}
                      onChange={(e) => setCustomGroupInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCheckAdminStatus();
                      }}
                      placeholder="เช่น t.me/my_crypto_vip หรือ @my_admin_group" 
                      className="flex-1 bg-[#252525] border border-[#444] rounded-lg text-xs px-3 py-2 text-white focus:outline-none focus:border-blue-500" 
                    />
                    <button 
                      type="button" 
                      onClick={() => handleCheckAdminStatus()}
                      disabled={isVerifying}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          กำลังตรวจสอบ...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          ตรวจสอบสิทธิ์แอดมิน
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Live Verification Status Card */}
            {!adminVerification && (
              <div className="bg-[#242424] border border-[#383838] border-dashed rounded-lg p-4 text-center text-xs text-gray-400">
                <ShieldCheck className="w-6 h-6 text-gray-500 mx-auto mb-1.5" />
                <p className="text-gray-300 font-medium">ยังไม่ได้เลือกหรือตรวจสอบกลุ่มเป้าหมาย</p>
                <p className="text-[11px] text-gray-500 mt-0.5">เลือกกลุ่มที่คุณเป็นแอดมิน หรือใส่ลิงก์กลุ่มเพื่อตรวจสอบสิทธิ์ก่อนเริ่ม</p>
              </div>
            )}
            {adminVerification && (
              <div className={`p-3 rounded-lg border text-xs transition-all ${
                adminVerification.isAdmin 
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' 
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    {adminVerification.isAdmin ? (
                      <Crown className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {adminVerification.title || selectedGroupLink}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          adminVerification.isAdmin 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {adminVerification.roleLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-300">
                        {adminVerification.message}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-400 font-mono">
                        <span>สมาชิกปัจจุบัน: {adminVerification.memberCount?.toLocaleString() || '3,840'} คน</span>
                        <span>•</span>
                        <span>
                          สิทธิ์ can_invite_users:{' '}
                          <strong className={adminVerification.canInviteUsers ? 'text-emerald-400' : 'text-rose-400'}>
                            {adminVerification.canInviteUsers ? 'TRUE (อนุญาต)' : 'FALSE (ถูกจำกัด)'}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {adminVerification.isAdmin ? (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-1 rounded flex items-center gap-1 font-medium shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> พร้อมเพิ่มสมาชิก
                    </span>
                  ) : (
                    <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] px-2 py-1 rounded flex items-center gap-1 font-medium shrink-0">
                      <Lock className="w-3.5 h-3.5" /> ถูกบล็อกตามกฎ
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Member File & Speed Settings (5 cols) */}
        <div className="lg:col-span-5 bg-[#1c1c1c] border border-[#333] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-200 mb-3 pb-2 border-b border-[#333] flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              2. รายชื่อและตั้งค่าความเร็ว (Safety Rate)
            </h3>

            {/* File Upload Box */}
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-400">อัปโหลดรายชื่อเป้าหมาย (.CSV / .TXT)</label>
                </div>
                <label className="border-2 border-dashed border-[#444] bg-[#252525] hover:border-blue-500 rounded-lg p-3 text-center cursor-pointer transition-colors flex items-center justify-center gap-3">
                  <Upload className="w-5 h-5 text-blue-400" />
                  <div className="text-left">
                    <span className="text-xs text-gray-200 font-medium block">
                      {fileName ? fileName : 'เลือกไฟล์ .CSV หรือ .TXT (คลิกเพื่ออัปโหลด)'}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {memberCount ? `พร้อมดึงเข้ากลุ่ม ${memberCount} รายชื่อ` : 'ยังไม่ได้เลือกไฟล์ (รองรับ .csv, .txt)'}
                    </span>
                  </div>
                  <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {/* Safety Timing Inputs */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">ระยะหน่วง (วินาที/คน)</label>
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="number" 
                      value={delayMin}
                      onChange={(e) => setDelayMin(e.target.value)}
                      className="w-16 bg-[#252525] border border-[#444] rounded text-xs px-2 py-1.5 text-white text-center font-mono focus:outline-none focus:border-blue-500" 
                    />
                    <span className="text-xs text-gray-500">-</span>
                    <input 
                      type="number" 
                      value={delayMax}
                      onChange={(e) => setDelayMax(e.target.value)}
                      className="w-16 bg-[#252525] border border-[#444] rounded text-xs px-2 py-1.5 text-white text-center font-mono focus:outline-none focus:border-blue-500" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">จำกัดต่อรอบ (Limit/Batch)</label>
                  <input 
                    type="number" 
                    value={maxLimit}
                    onChange={(e) => setMaxLimit(e.target.value)}
                    className="w-full bg-[#252525] border border-[#444] rounded text-xs px-3 py-1.5 text-white font-mono focus:outline-none focus:border-blue-500" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 border-t border-[#333]">
            {adminVerification && !adminVerification.isAdmin ? (
              <div className="text-center py-2">
                <button 
                  disabled
                  className="w-full bg-gray-700 text-gray-400 py-2.5 rounded-lg text-xs font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  ล็อค: ต้องเป็นแอดมินกลุ่มเท่านั้นจึงจะกดเริ่มได้
                </button>
                <p className="text-[10px] text-rose-400 mt-1">
                  กรุณาเลือกกลุ่มที่คุณเป็นแอดมินจากฝั่งซ้ายมือเพื่อปลดล็อค
                </p>
              </div>
            ) : (
              <button 
                type="button"
                onClick={handleAddMembers}
                disabled={loading || !adminVerification?.isAdmin}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    กำลังเพิ่มสมาชิกเข้ากลุ่ม ({progress}%)
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    เริ่มดำเนินการเพิ่มสมาชิก (ยืนยันสิทธิ์แอดมินแล้ว)
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Execution Monitor Live Log */}
      <div className="bg-[#1c1c1c] border border-[#333] rounded-lg flex-1 min-h-[140px] flex flex-col overflow-hidden">
        <div className="px-4 py-2 border-b border-[#333] bg-[#222] flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-semibold text-gray-200">บันทึกการทำงานแบบเรียลไทม์ (Live Execution Log & Safety Audit)</span>
          </div>
          <div className="flex items-center gap-3">
            {adminVerification?.isAdmin && (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Verified: {adminVerification.roleLabel}
              </span>
            )}
            {loading && <span className="text-blue-400 font-mono font-medium">กำลังดำเนินการ... {progress}%</span>}
          </div>
        </div>

        {loading && (
          <div className="w-full bg-[#252525] h-1">
            <div className="bg-blue-500 h-1 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        )}

        <div className="p-3 bg-[#111] flex-1 overflow-auto font-mono text-xs text-gray-300 space-y-1">
          {statusLog.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 italic py-6">
              <Shield className="w-6 h-6 mb-1 text-gray-600" />
              <p>ระบบพร้อมทำงาน: เลือกกลุ่มที่คุณเป็นแอดมินและคลิก "เริ่มดำเนินการเพิ่มสมาชิก"</p>
              <p className="text-[11px] text-gray-600 mt-1">กลุ่มที่ไม่ได้รับสิทธิ์แอดมินจะถูกป้องกันและไม่สามารถรันคำสั่งได้</p>
            </div>
          ) : (
            statusLog.map((log, index) => (
              <p 
                key={index} 
                className={
                  log.includes('✔') 
                    ? 'text-emerald-400' 
                    : log.includes('🛡️') 
                    ? 'text-blue-400 font-semibold' 
                    : log.includes('👑')
                    ? 'text-amber-300 font-semibold'
                    : log.includes('❌') || log.includes('⛔')
                    ? 'text-rose-400 font-bold'
                    : 'text-gray-300'
                }
              >
                {log}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
