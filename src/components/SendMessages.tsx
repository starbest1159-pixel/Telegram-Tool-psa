import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export function SendMessages() {
  const { addWorkLog } = useAppContext();
  const [message, setMessage] = useState('');
  const [delayMin, setDelayMin] = useState('5');
  const [delayMax, setDelayMax] = useState('15');
  const [loading, setLoading] = useState(false);
  const [msgStatus, setMsgStatus] = useState('');
  
  // Dummy target list
  const [targets] = useState([
    { id: '@crypto_man', status: 'รอคิว' },
    { id: '102938475', status: 'รอคิว' }
  ]);

  const handleSend = () => {
    if (!message) return setMsgStatus('กรุณาพิมพ์ข้อความ');
    
    setLoading(true);
    setMsgStatus('');
    
    // Simulate API sending
    setTimeout(() => {
      setLoading(false);
      setMsgStatus('ส่งข้อความเสร็จสิ้น');
      addWorkLog({
        type: 'ส่งข้อความ (Send Message)',
        target: `${targets.length} รายการ`,
        status: 'สำเร็จ',
        details: `ส่งข้อความสำเร็จ ${targets.length} คน (หน่วงเวลา ${delayMin}-${delayMax}วิ)`
      });
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212] text-gray-300 p-6">
      <h2 className="text-xl font-semibold text-blue-400 mb-6">ส่งข้อความ (Send Messages)</h2>
      {msgStatus && <div className="mb-4 bg-blue-500/10 text-blue-400 p-3 border border-blue-500/20 rounded">{msgStatus}</div>}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0">
        <div className="flex flex-col gap-6">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-200 mb-4">รูปแบบข้อความ</h3>
            <textarea 
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="พิมพ์ข้อความที่ต้องการส่ง (รองรับ Spintax เช่น {สวัสดี|ดีจ้า|ทักทาย})"
              className="w-full bg-[#252525] border border-[#444] rounded text-sm px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"
            ></textarea>
            <div className="mt-4 flex gap-4">
               <button className="bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded text-xs transition-colors">แนบไฟล์รูปภาพ/วิดีโอ</button>
            </div>
          </div>
          
          <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 flex-1">
            <h3 className="text-sm font-medium text-gray-200 mb-4">การตั้งค่าการส่ง</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">หน่วงเวลาต่อข้อความ (วินาที)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={delayMin}
                    onChange={(e) => setDelayMin(e.target.value)}
                    placeholder="5" 
                    className="w-24 bg-[#252525] border border-[#444] rounded text-sm px-3 py-2 focus:outline-none focus:border-blue-500" 
                  />
                  <span className="text-gray-500">-</span>
                  <input 
                    type="number" 
                    value={delayMax}
                    onChange={(e) => setDelayMax(e.target.value)}
                    placeholder="15" 
                    className="w-24 bg-[#252525] border border-[#444] rounded text-sm px-3 py-2 focus:outline-none focus:border-blue-500" 
                  />
                </div>
              </div>
              <button 
                onClick={handleSend}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded text-sm transition-colors font-medium mt-4"
              >
                {loading ? 'กำลังส่ง...' : 'เริ่มส่งข้อความ'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#1e1e1e] border border-[#333] rounded-lg flex flex-col">
          <div className="p-4 border-b border-[#333]">
            <h3 className="text-sm font-medium text-gray-200">รายชื่อผู้รับเป้าหมาย</h3>
          </div>
          <div className="p-4 border-b border-[#333] bg-[#121212]">
            <p className="text-xs text-gray-500 mb-2">อัปโหลดไฟล์รายชื่อ (CSV/TXT) หรือเลือกจากผลการดึงข้อมูล</p>
             <button className="bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded text-xs transition-colors w-full">นำเข้ารายชื่อ</button>
          </div>
          <div className="flex-1 overflow-auto bg-[#121212]">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#252525] text-gray-400 sticky top-0 border-b border-[#333]">
                <tr>
                  <th className="px-4 py-3 font-medium">Username / ID</th>
                  <th className="px-4 py-3 font-medium">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {targets.map((t, i) => (
                  <tr key={i} className="border-b border-[#222]">
                    <td className="px-4 py-3 text-white">{t.id}</td>
                    <td className={`px-4 py-3 ${loading ? 'text-amber-400' : 'text-gray-400'}`}>
                      {loading ? 'กำลังส่ง...' : t.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
