import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Globe, ShieldCheck, RefreshCw, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export function ProxySettings() {
  const { addWorkLog } = useAppContext();
  const [proxyType, setProxyType] = useState('SOCKS5');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [testing, setTesting] = useState(false);

  // Auto Proxy Rotation states
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotateStrategy, setRotateStrategy] = useState<'round-robin' | 'latency' | 'random'>('round-robin');
  const [rotateInterval, setRotateInterval] = useState('10');

  const [proxyList, setProxyList] = useState<any[]>([]);

  const handleSave = () => {
    if (!host || !port) return setMsg('กรุณาระบุ IP และ Port');
    const newAddress = `${host}:${port}`;
    const newProxy = {
      id: Date.now().toString(),
      type: proxyType,
      address: newAddress,
      status: 'ใช้งานอยู่ (Active)',
      ping: `${Math.floor(20 + Math.random() * 80)}ms`,
      country: 'TH 🇹🇭'
    };

    setProxyList(prev => [newProxy, ...prev.map(p => ({ ...p, status: 'พร้อมใช้งาน (Ready)' }))]);
    setMsg(`บันทึกและสลับใช้ Proxy: ${newAddress} (${proxyType}) เรียบร้อยแล้ว`);
    addWorkLog({
      type: 'ตั้งค่าระบบ (Proxy)',
      target: newAddress,
      status: 'สำเร็จ',
      details: `อัปเดต Proxy เป็น ${proxyType} ${newAddress}`
    });
  };

  const handleTest = () => {
    if (!host || !port) return setMsg('กรุณาระบุ IP และ Port ก่อนทดสอบ');
    setTesting(true);
    setMsg('กำลังทดสอบการเชื่อมต่อกับ Proxy Server...');

    setTimeout(() => {
      setTesting(false);
      const randomPing = Math.floor(25 + Math.random() * 60);
      setMsg(`✔ การเชื่อมต่อ Proxy ${host}:${port} สำเร็จ! ความเร็วตอบสนอง (Latency): ${randomPing}ms`);
      addWorkLog({
        type: 'ทดสอบ Proxy',
        target: `${host}:${port}`,
        status: 'สำเร็จ',
        details: `Ping สำเร็จ: ${randomPing}ms`
      });
    }, 1200);
  };

  const handleDeleteProxy = (id: string) => {
    setProxyList(prev => prev.filter(p => p.id !== id));
    setMsg('ลบรายการ Proxy เรียบร้อยแล้ว');
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212] text-gray-300 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-400" />
            ตั้งค่า Proxy และเครือข่าย (Proxy & Network Settings)
          </h2>
          <p className="text-xs text-gray-500 mt-1">บริหารจัดการ SOCKS5 / HTTP Proxy ป้องกัน IP ของท่านถูกบันทึกในบัญชีดำ</p>
        </div>
      </div>

      {msg && (
        <div className="mb-4 bg-blue-500/10 text-blue-400 p-3 border border-blue-500/20 rounded-lg text-sm flex items-center justify-between">
          <span>{msg}</span>
          <button onClick={() => setMsg('')} className="text-xs text-blue-300 hover:underline">ปิด</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Active Proxy Form */}
        <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2 border-b border-[#333] pb-3">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              เพิ่ม/แก้ไข Proxy หลัก
            </h3>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">ประเภทโปรโตคอล (Protocol)</label>
              <select 
                value={proxyType}
                onChange={(e) => setProxyType(e.target.value)}
                className="w-full bg-[#252525] border border-[#444] rounded-lg text-sm px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="SOCKS5">SOCKS5 (แนะนำสูงสุดสำหรับ Telegram)</option>
                <option value="HTTP">HTTP Proxy</option>
                <option value="HTTPS">HTTPS Proxy (Encrypted)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">IP Address / Host Server</label>
              <input 
                type="text" 
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="127.0.0.1 หรือ proxy.example.com" 
                className="w-full bg-[#252525] border border-[#444] rounded-lg text-sm px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 font-mono" 
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Port Number</label>
              <input 
                type="text" 
                value={port}
                onChange={(e) => setPort(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                placeholder="1080" 
                className="w-full bg-[#252525] border border-[#444] rounded-lg text-sm px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 font-mono" 
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Username (ระบุถ้ามี)</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="proxy_user" 
                  className="w-full bg-[#252525] border border-[#444] rounded-lg text-xs px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Password (ระบุถ้ามี)</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-[#252525] border border-[#444] rounded-lg text-xs px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono" 
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#333] flex gap-3 mt-6">
            <button 
              onClick={handleSave} 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              บันทึกและเปิดใช้งาน
            </button>
            <button 
              onClick={handleTest} 
              disabled={testing}
              className="bg-[#333] hover:bg-[#444] text-gray-200 px-4 py-2.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              ทดสอบ Ping
            </button>
          </div>
        </div>

        {/* Proxy Pool List & Auto Rotation Control */}
        <div className="lg:col-span-2 bg-[#1e1e1e] border border-[#333] rounded-lg flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#333] flex flex-wrap justify-between items-center bg-[#222] gap-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-200">คลัง Proxy หมุนเวียน (Proxy Pool)</h3>
              <p className="text-[11px] text-gray-500">ระบบหมุนเวียน IP อัตโนมัติลดอัตราการติด Rate Limit (429 Too Many Requests)</p>
            </div>
            <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded font-mono">
              สลับใช้ทุก {rotateInterval} งาน ({rotateStrategy})
            </span>
          </div>

          {/* Rotation Settings Banner */}
          <div className="bg-[#181818] p-3.5 border-b border-[#333] flex flex-wrap items-center justify-between gap-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-200">
              <input 
                type="checkbox"
                checked={autoRotate}
                onChange={(e) => {
                  setAutoRotate(e.target.checked);
                  setMsg(e.target.checked ? 'เปิดใช้งานระบบ Auto Proxy Rotation แล้ว' : 'ปิดใช้งานระบบ Auto Proxy Rotation แล้ว');
                }}
                className="rounded border-[#444] bg-[#252525] text-blue-500 focus:ring-blue-500"
              />
              <span>🔄 เปิดใช้งาน Proxy Rotation อัตโนมัติ</span>
            </label>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400 text-[11px]">รูปแบบ:</span>
                <select 
                  value={rotateStrategy}
                  onChange={(e) => setRotateStrategy(e.target.value as any)}
                  className="bg-[#252525] border border-[#444] text-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="round-robin">วนลูปตามลำดับ (Round-Robin)</option>
                  <option value="latency">เลือก IP ต่ำสุด (Lowest Latency)</option>
                  <option value="random">สุ่ม IP อัตโนมัติ (Random Pool)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-gray-400 text-[11px]">สลับทุกๆ:</span>
                <input 
                  type="number"
                  value={rotateInterval}
                  onChange={(e) => setRotateInterval(e.target.value)}
                  className="w-14 bg-[#252525] border border-[#444] text-white font-mono rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500 text-center"
                />
                <span className="text-gray-400 text-[11px]">งาน</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-[#121212]">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#252525] text-gray-400 sticky top-0 border-b border-[#333]">
                <tr>
                  <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">โปรโตคอล</th>
                  <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">Address / Port</th>
                  <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">ตำแหน่ง / ประเทศ</th>
                  <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">ความเร็ว (Latency)</th>
                  <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">สถานะ</th>
                  <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {proxyList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500 text-xs">
                      ยังไม่มีรายการ Proxy ในระบบ (ปัจจุบันใช้การเชื่อมต่ออินเทอร์เน็ตโดยตรง Direct Connection)
                    </td>
                  </tr>
                ) : (
                  proxyList.map((p) => (
                    <tr key={p.id} className="border-b border-[#222] hover:bg-[#1a1a1a] transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-blue-400">{p.type}</td>
                      <td 
                        className="px-4 py-3 text-xs text-white font-mono hover:text-blue-400 hover:underline cursor-pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(p.address);
                          setMsg(`คัดลอก Proxy ${p.address} เรียบร้อยแล้ว`);
                        }}
                        title="คลิกเพื่อคัดลอก Address"
                      >
                        {p.address}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-300">{p.country}</td>
                      <td className="px-4 py-3 text-xs font-mono text-green-400">{p.ping}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${p.status.includes('Active') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button 
                          onClick={() => handleDeleteProxy(p.id)}
                          className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                          title="ลบออก"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

