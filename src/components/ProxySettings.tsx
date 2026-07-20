import React from 'react';
import { MenuKey } from '../types';

export function ProxySettings() {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212] text-gray-300 p-6">
      <h2 className="text-xl font-semibold text-blue-400 mb-6">ตั้งค่า Proxy</h2>
      <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">ประเภท Proxy</label>
            <select className="w-full bg-[#252525] border border-[#444] rounded text-sm px-3 py-2.5 focus:outline-none focus:border-blue-500">
              <option>SOCKS5</option>
              <option>HTTP</option>
              <option>HTTPS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">IP Address / Host</label>
            <input type="text" placeholder="127.0.0.1" className="w-full bg-[#252525] border border-[#444] rounded text-sm px-3 py-2.5 focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Port</label>
            <input type="text" placeholder="1080" className="w-full bg-[#252525] border border-[#444] rounded text-sm px-3 py-2.5 focus:outline-none focus:border-blue-500" />
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
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm transition-colors">บันทึกการตั้งค่า</button>
            <button className="bg-[#333] hover:bg-[#444] text-white px-6 py-2 rounded text-sm transition-colors">ทดสอบการเชื่อมต่อ</button>
          </div>
        </div>
      </div>
    </div>
  );
}
