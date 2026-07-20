import React from 'react';

export function AddMembers() {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212] text-gray-300 p-6">
      <h2 className="text-xl font-semibold text-blue-400 mb-6">เพิ่มสมาชิกเข้ากลุ่ม (Add Members)</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-200 mb-4">1. ตั้งค่ากลุ่มเป้าหมายและแหล่งข้อมูล</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">ลิงก์กลุ่มปลายทาง (Target Group)</label>
              <input type="text" placeholder="t.me/target_group" className="w-full bg-[#252525] border border-[#444] rounded text-sm px-3 py-2.5 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">อัปโหลดรายชื่อ (CSV/TXT)</label>
              <div className="border-2 border-dashed border-[#444] bg-[#252525] rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
                <p className="text-sm text-gray-500">คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-200 mb-4">2. ตั้งค่าความเร็ว (Delay / Speed)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">หน่วงเวลาต่อคน (วินาที)</label>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="10" className="w-24 bg-[#252525] border border-[#444] rounded text-sm px-3 py-2 focus:outline-none focus:border-blue-500" />
                <span className="text-gray-500">ถึง</span>
                <input type="number" placeholder="30" className="w-24 bg-[#252525] border border-[#444] rounded text-sm px-3 py-2 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">จำกัดจำนวนสูงสุดต่อบัญชี (คน)</label>
              <input type="number" placeholder="40" className="w-full max-w-[200px] bg-[#252525] border border-[#444] rounded text-sm px-3 py-2 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="pt-4">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-sm transition-colors font-medium">เริ่มเพิ่มสมาชิก</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
