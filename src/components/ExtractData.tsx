import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function ExtractData() {
  const [link, setLink] = useState('');
  const [checking, setChecking] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  
  const [extracting, setExtracting] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleCheckGroup = async () => {
    if (!link) return alert('กรุณาระบุลิงก์กลุ่ม');
    setChecking(true);
    try {
      const res = await fetch('/api/check-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link })
      });
      const data = await res.json();
      if (data.success) {
        setAnalysis(data.data);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Connection error');
    } finally {
      setChecking(false);
    }
  };

  const handleExtract = async () => {
    setExtracting(true);
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 500, filterOnline: 'all' })
      });
      const data = await res.json();
      if (data.success) {
        // Fetch results after starting
        setTimeout(fetchResults, 1000);
      } else {
        alert(data.message);
        setExtracting(false);
      }
    } catch (err) {
      alert('Connection error');
      setExtracting(false);
    }
  };
  
  const fetchResults = async () => {
    try {
      const res = await fetch('/api/results');
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExtracting(false);
    }
  };

  const handleDownloadCSV = () => {
    if (results.length === 0) {
      alert("ไม่มีข้อมูลสำหรับส่งออก (No data to export)");
      return;
    }
    
    const headers = ["User ID", "Username", "ชื่อจริง", "นามสกุล", "เบอร์โทร", "ออนไลน์ล่าสุด"];
    const csvContent = [
      headers.join(","),
      ...results.map(row => 
        [row.id, row.username, row.firstName, row.lastName, row.phone, row.lastOnline]
          .map(value => `"${value || ''}"`)
          .join(",")
      )
    ].join("\n");
    
    // Add BOM for UTF-8 Excel compatibility
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `telegram_extract_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212] text-gray-300">
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 h-full">
          
          {/* Left Column */}
          <div className="flex flex-col gap-4 h-full">
            <div className="bg-[#1e1e1e] border border-[#333] rounded-lg flex flex-col flex-1">
              <div className="p-3 border-b border-[#333]">
                <h2 className="text-sm font-semibold text-blue-400">1. วิเคราะห์และจัดการเป้าหมาย</h2>
              </div>
              <div className="p-4 flex flex-col gap-4 flex-1">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="ใส่ลิงก์กลุ่ม (t.me/..., joinchat/...) หรือ ID"
                    className="flex-1 bg-[#252525] border border-[#444] rounded text-sm px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                  <button 
                    onClick={handleCheckGroup}
                    disabled={checking}
                    className="bg-[#333] hover:bg-[#444] disabled:opacity-50 text-white px-4 py-2 rounded text-sm transition-colors whitespace-nowrap"
                  >
                    {checking ? 'กำลังตรวจสอบ...' : 'เช็คกลุ่มเป้าหมาย'}
                  </button>
                </div>

                <p className="text-xs text-amber-500">
                  ข้อควรระวัง: หากต้องการใช้บัญชีจำนวนข้อมูลมากเกินกว่ากลุ่มเป้าหมายที่ในขนาด รบกวนใช้การก่ารตรวจนับร่วมกันในการดึงข้อมูล (Scrape) เพื่อเก็บ Access Hash ที่สำคัญ
                </p>

                <div>
                  <h3 className="text-sm font-medium text-blue-400 mb-2">ข้อมูลสรุปของเป้าหมาย</h3>
                  <p className="text-xs text-gray-500 mb-3">เป้าหมายสำหรับดึงข้อมูล: <span className="text-white">{link || '-'}</span></p>
                  <p className="text-xs text-gray-500 mb-2">ผลการวิเคราะห์:</p>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-gray-400">สมาชิกทั้งหมด:</span>
                      <span className="text-white">{analysis ? analysis.totalMembers.toLocaleString() : 'รอตรวจสอบ'}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-400">ออนไลน์:</span>
                      <span className="text-white">{analysis ? analysis.onlineMembers.toLocaleString() : 'รอตรวจสอบ'}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-400">สมาชิกที่ดึงได้:</span>
                      <span className="text-white">{analysis ? analysis.canExtract.toLocaleString() : 'รอตรวจสอบ'}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-400">แอดมินที่ผ่านมา:</span>
                      <span className="text-white">{analysis ? analysis.pastAdmins : 'รอตรวจสอบ'}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-400">แอดมิน & บอท:</span>
                      <span className="text-white">{analysis ? analysis.adminsAndBots : 'รอตรวจสอบ'}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-400">บัญชีของฉันในกลุ่ม:</span>
                      <span className="text-white">{analysis ? analysis.myAccountsInGroup : 'รอตรวจสอบ'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <h3 className="text-sm font-medium text-blue-400 mb-2">ตั้งค่าตัวกรองเป้าหมายกลุ่ม</h3>
                  <input 
                    type="text" 
                    placeholder="ตั้งค่าการดึงข้อมูลของกลุ่มเป้าหมายตามต้องการได้..."
                    className="w-full bg-[#252525] border border-[#444] rounded text-sm px-3 py-2 focus:outline-none focus:border-blue-500 mb-4"
                  />
                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#333] hover:bg-[#444] text-white py-2 rounded text-sm transition-colors">
                      เข้าร่วมทั้งหมด
                    </button>
                    <button className="flex-1 bg-[#333] hover:bg-[#444] text-white py-2 rounded text-sm transition-colors">
                      ออกจากกลุ่มทั้งหมด
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Top & Bottom) */}
          <div className="flex flex-col gap-4 h-full">
            
            {/* Accounts Panel */}
            <div className="bg-[#1e1e1e] border border-[#333] rounded-lg flex flex-col flex-none">
              <div className="p-3 border-b border-[#333]">
                <h2 className="text-sm font-semibold text-blue-400">2. บัญชีและตัวเลือกการดึงข้อมูล</h2>
              </div>
              <div className="p-4 flex flex-col gap-4">
                <div className="bg-[#121212] border border-[#333] rounded overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#252525] text-gray-400 border-b border-[#333]">
                      <tr>
                        <th className="px-3 py-2 font-medium">บัญชี</th>
                        <th className="px-3 py-2 font-medium">สถานะในกลุ่ม</th>
                        <th className="px-3 py-2 font-medium">สถานะการดึง</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#222]">
                        <td className="px-3 py-2 flex items-center gap-2">
                          <span className="text-gray-500 text-xs">1</span>
                          <span>+669570961...</span>
                        </td>
                        <td className="px-3 py-2 text-green-400">{analysis ? 'เข้าร่วมแล้ว' : 'รอตรวจสอบ'}</td>
                        <td className="px-3 py-2 text-gray-400">{extracting ? 'กำลังดึงข้อมูล...' : (results.length > 0 ? 'เสร็จสิ้น' : 'รอเริ่ม')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-blue-400 mb-3">ตัวเลือก</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-gray-400">ดึงข้อมูลจาก:</span>
                      <div className="relative flex-1 max-w-[200px]">
                        <select className="w-full appearance-none bg-[#252525] border border-[#444] rounded text-sm px-3 py-1.5 focus:outline-none focus:border-blue-500 pr-8">
                          <option>จากรายชื่อสมาชิกทั้งหมด</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-gray-400">จำนวนสูงสุด (Limit):</span>
                      <div className="relative flex-1 max-w-[200px]">
                        <select className="w-full appearance-none bg-[#252525] border border-[#444] rounded text-sm px-3 py-1.5 focus:outline-none focus:border-blue-500 pr-8">
                          <option>500</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-gray-400">กรองตามสถานะออนไลน์:</span>
                      <div className="relative flex-1 max-w-[200px]">
                        <select className="w-full appearance-none bg-[#252525] border border-[#444] rounded text-sm px-3 py-1.5 focus:outline-none focus:border-blue-500 pr-8">
                          <option>ทุกเวลา</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={handleExtract}
                    disabled={!analysis || extracting}
                    className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:bg-[#333] disabled:text-gray-500 text-white font-medium py-2 rounded text-sm transition-colors"
                  >
                    {extracting ? 'กำลังดึงข้อมูล...' : 'เริ่มดึงข้อมูล'}
                  </button>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded text-sm transition-colors">
                    หยุด
                  </button>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="bg-[#1e1e1e] border border-[#333] rounded-lg flex flex-col flex-1 min-h-[200px]">
              <div className="p-3 border-b border-[#333]">
                <h2 className="text-sm font-semibold text-blue-400">3. ผลลัพธ์ (ผู้ใช้ที่ดึงได้ทั้งหมด: {results.length})</h2>
              </div>
              <div className="flex-1 overflow-auto bg-[#121212]">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#252525] text-gray-400 sticky top-0 border-b border-[#333]">
                    <tr>
                      <th className="px-4 py-2 font-medium flex items-center gap-1 cursor-pointer">
                        User ID <ChevronDown className="w-3 h-3" />
                      </th>
                      <th className="px-4 py-2 font-medium">Username</th>
                      <th className="px-4 py-2 font-medium">ชื่อจริง</th>
                      <th className="px-4 py-2 font-medium">นามสกุล</th>
                      <th className="px-4 py-2 font-medium">เบอร์โทร</th>
                      <th className="px-4 py-2 font-medium">ออนไลน์ล่าสุด</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-600 text-sm">
                          {extracting ? 'กำลังดึงข้อมูล...' : 'ยังไม่มีข้อมูล (คลิก "เริ่มดึงข้อมูล")'}
                        </td>
                      </tr>
                    ) : (
                      results.map(row => (
                        <tr key={row.id} className="border-b border-[#222]">
                          <td className="px-4 py-2">{row.id}</td>
                          <td className="px-4 py-2 text-blue-400">{row.username}</td>
                          <td className="px-4 py-2">{row.firstName}</td>
                          <td className="px-4 py-2">{row.lastName}</td>
                          <td className="px-4 py-2">{row.phone}</td>
                          <td className="px-4 py-2 text-gray-400">{row.lastOnline}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-3 border-t border-[#333] bg-[#1e1e1e] flex items-center justify-between flex-wrap gap-2">
                <span className="text-sm text-gray-400">1 บัญชีที่ใช้งานได้</span>
                <div className="flex items-center gap-2">
                  <button className="bg-[#333] hover:bg-[#444] text-white px-3 py-1.5 rounded text-xs transition-colors">
                    ตรวจสอบรายการซ้ำ
                  </button>
                  <button className="bg-[#333] hover:bg-[#444] text-white px-3 py-1.5 rounded text-xs transition-colors">
                    จากประวัติทั้งหมด
                  </button>
                  <button className="bg-[#333] hover:bg-[#444] text-white px-3 py-1.5 rounded text-xs transition-colors">
                    ตรวจสอบข้อมูลซ้ำ
                  </button>
                  <button onClick={handleDownloadCSV} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs transition-colors">
                    ส่งออกเป็น CSV
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
