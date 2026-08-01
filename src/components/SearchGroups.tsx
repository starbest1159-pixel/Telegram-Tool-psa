import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export function SearchGroups() {
  const { addWorkLog } = useAppContext();
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = () => {
    if (!keyword) return;
    setLoading(true);
    
    // Simulate API search
    setTimeout(() => {
      const mockResults = [
        { name: `${keyword} Thailand`, link: `@${keyword}_th`, members: '12,500', desc: `กลุ่มพูดคุยเกี่ยวกับ ${keyword}` },
        { name: `${keyword} Official`, link: `@${keyword}_official`, members: '45,200', desc: `${keyword} Official Group` },
        { name: `สาย ${keyword}`, link: `@sai_${keyword}`, members: '3,400', desc: `Community for ${keyword}` },
      ];
      setResults(mockResults);
      setLoading(false);
      addWorkLog({
        type: 'ค้นหากลุ่ม (Search)',
        target: keyword,
        status: 'สำเร็จ',
        details: `พบ ${mockResults.length} กลุ่มสำหรับคำค้นหา "${keyword}"`
      });
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212] text-gray-300 p-6">
      <h2 className="text-xl font-semibold text-blue-400 mb-6">ค้นหากลุ่ม (Search Groups)</h2>
      
      <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 mb-6">
        <div className="flex gap-4">
          <input 
            type="text" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="ใส่คำค้นหา (Keyword) เช่น crypto, marketing, หางาน..."
            className="flex-1 bg-[#252525] border border-[#444] rounded text-sm px-4 py-2.5 focus:outline-none focus:border-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-2.5 rounded text-sm transition-colors font-medium"
          >
            {loading ? 'กำลังค้นหา...' : 'ค้นหา'}
          </button>
        </div>
      </div>

      <div className="bg-[#1e1e1e] border border-[#333] rounded-lg flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#333] flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-200">ผลการค้นหา</h3>
          <span className="text-xs text-gray-500">พบ {results.length} กลุ่ม</span>
        </div>
        <div className="flex-1 overflow-auto bg-[#121212]">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#252525] text-gray-400 sticky top-0 border-b border-[#333]">
              <tr>
                <th className="px-4 py-3 font-medium">ชื่อกลุ่ม</th>
                <th className="px-4 py-3 font-medium">ลิงก์ (Username)</th>
                <th className="px-4 py-3 font-medium">จำนวนสมาชิก</th>
                <th className="px-4 py-3 font-medium">คำอธิบาย</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-600 text-sm">
                    {loading ? 'กำลังค้นหาข้อมูล...' : 'กรอกคำค้นหาเพื่อเริ่มค้นหากลุ่มที่เปิดสาธารณะ'}
                  </td>
                </tr>
              ) : (
                results.map((res, i) => (
                  <tr key={i} className="border-b border-[#222]">
                    <td className="px-4 py-3 text-white">{res.name}</td>
                    <td className="px-4 py-3 text-blue-400">{res.link}</td>
                    <td className="px-4 py-3">{res.members}</td>
                    <td className="px-4 py-3 text-gray-400 max-w-[200px] truncate">{res.desc}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-[#333] bg-[#1e1e1e] flex gap-2">
           <button className="bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded text-xs transition-colors">ส่งออกรายการเป็น CSV</button>
        </div>
      </div>
    </div>
  );
}
