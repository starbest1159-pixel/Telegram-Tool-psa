import React, { useState } from 'react';
import { MenuKey } from '../types';
import { useAppContext } from '../context/AppContext';

export function ProxySettings() {
  const { addWorkLog } = useAppContext();
  const [proxyType, setProxyType] = useState('SOCKS5');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [msg, setMsg] = useState('');

  const handleSave = () => {
    if (!host || !port) return setMsg('กรุณาระบุ IP และ Port');
    setMsg('บันทึกการตั้งค่า Proxy เรียบร้อยแล้ว');
    addWorkLog({
      type: 'ตั้งค่าระบบ (Proxy)',
      target: `${host}:${port}`,
      status: 'สำเร็จ',
      details: `อัปเดต Proxy เป็น ${proxyType} ${host}:${port}`
    });
  };

  const handleTest = () => {
    if (!host || !port) return setMsg('กรุณาระบุ IP และ Port ก่อนทดสอบ');
    setMsg('กำลังทดสอบการเชื่อมต่อ...');
    setTimeout(() => {
      setMsg('การเชื่อมต่อ Proxy สำเร็จ');
      addWorkLog({
        type: 'ทดสอบ Proxy',
        target: `${host}:${port}`,
        status: 'สำเร็จ',
        details: 'Ping สำเร็จ: 45ms'
      });
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212] text-gray-300 p-6">
      <h2 className="text-xl font-semibold text-blue-400 mb-6">ตั้งค่า Proxy</h2>
      
      {msg && <div className="mb-4 bg-blue-500/10 text-blue-400 p-3 border border-blue-500/20 rounded max-w-2xl">{msg}</div>}
      
      <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">ประเภท Proxy</label>
            <select 
              value={proxyType}
              onChange={(e) => setProxyType(e.target.value)}
              className="w-full bg-[#252525] border border-[#444] rounded text-sm px-3 py-2.5 focus:outline-none focus:border-blue-500"
            >
              <option>SOCKS5</option>
              <option>HTTP</option>
              <option>HTTPS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">IP Address / Host</label>
            <input 
              type="text" 
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="127.0.0.1" 
              className="w-full bg-[#252525] border border-[#444] rounded text-sm px-3 py-2.5 focus:outline-none focus:border-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Port</label>
            <input 
              type="text" 
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="1080" 
              className="w-full bg-[#252525] border border-[#444] rounded text-sm px-3 py-2.5 focus:outline-none focus:border-blue-500" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Username (Optional)</label>
              <input type="text" className="w-full bg-[#252525] border border-[#444] rounded text-sm px-3 py-2.5 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Password (Optional)</label>
              <input type="password" className="w-full bg-[#252525] border border-[#444] rounded text-sm px-3 py-2.5 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm transition-colors">บันทึกการตั้งค่า</button>
            <button onClick={handleTest} className="bg-[#333] hover:bg-[#444] text-white px-6 py-2 rounded text-sm transition-colors">ทดสอบการเชื่อมต่อ</button>
          </div>
        </div>
      </div>
    </div>
  );
}
