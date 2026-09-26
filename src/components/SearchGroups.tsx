import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, Download, Check, Users, Shield, ArrowRight, Filter } from 'lucide-react';

export function SearchGroups() {
  const { addWorkLog } = useAppContext();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [msg, setMsg] = useState('');

  const handleSearch = () => {
    if (!keyword.trim()) return setMsg('กรุณากรอกคำค้นหา');
    setLoading(true);
    setMsg('');
    setSelectedIndices([]);

    setTimeout(() => {
      const mockResults = [
        { name: `${keyword} Thailand Community`, link: `@${keyword}_th`, members: '24,500', online: '3,810', type: 'Supergroup', desc: `ศูนย์รวมผู้สนใจ ${keyword} ในประเทศไทย` },
        { name: `${keyword} Official Hub`, link: `@${keyword}_official`, members: '89,200', online: '12,400', type: 'Channel', desc: `ช่องประกาศข่าวสารอย่างเป็นทางการ ${keyword}` },
        { name: `กลุ่มพูดคุย ${keyword} TH`, link: `@talk_${keyword}`, members: '5,400', online: '890', type: 'Supergroup', desc: `กลุ่มแลกเปลี่ยนประสบการณ์ ${keyword}` },
        { name: `${keyword} VIP Signals & Trade`, link: `@vip_${keyword}`, members: '18,900', online: '2,150', type: 'Channel', desc: `สัญญาณเทรดและข่าวสารวงใน ${keyword}` },
        { name: `ตลาดซื้อขาย ${keyword} TH`, link: `@market_${keyword}`, members: '11,200', online: '1,420', type: 'Supergroup', desc: `กลุ่มซื้อขายสินค้าและบริการเกี่ยวกับ ${keyword}` },
      ];
      setResults(mockResults);
      setLoading(false);
      addWorkLog({
        type: 'ค้นหากลุ่ม (Search)',
        target: keyword,
        status: 'สำเร็จ',
        details: `พบ ${mockResults.length} กลุ่มสำหรับคำค้นหา "${keyword}"`
      });
    }, 1000);
  };

  const toggleSelectAll = () => {
    if (selectedIndices.length === results.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(results.map((_, i) => i));
    }
  };

  const toggleSelectIndex = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  const handleExportCSV = () => {
    if (results.length === 0) return;
    const targetItems = selectedIndices.length > 0 ? selectedIndices.map(i => results[i]) : results;
    const headers = "Name,Username,Members,Online,Type,Description\n";
    const rows = targetItems.map(r => `"${r.name}","${r.link}","${r.members}","${r.online}","${r.type}","${r.desc}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `telegram_groups_${keyword}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMsg(`ส่งออกข้อมูล ${targetItems.length} รายการเป็นไฟล์ CSV สำเร็จ`);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212] text-gray-300 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
            <Search className="w-6 h-6 text-blue-400" />
            ค้นหากลุ่มและช่องสาธารณะ (Global Group Search)
          </h2>
          <p className="text-xs text-gray-500 mt-1">ค้นหากลุ่ม Telegram และช่องขนาดใหญ่ตามคำคีย์เวิร์ด เพื่อทำการสกัดข้อมูลสมาชิกต่อ</p>
        </div>
      </div>

      {msg && (
        <div className="mb-4 bg-blue-500/10 text-blue-400 p-3 border border-blue-500/20 rounded-lg text-sm flex items-center justify-between">
          <span>{msg}</span>
          <button onClick={() => setMsg('')} className="text-xs text-blue-300 hover:underline">ปิด</button>
        </div>
      )}

      {/* Search Input Box */}
      <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
            <input 
              type="text" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="ใส่คำค้นหา (Keyword) เช่น crypto, marketing, หางาน, ท่องเที่ยว..."
              className="w-full bg-[#252525] border border-[#444] rounded-lg text-sm pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="flex gap-3">
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[#252525] border border-[#444] rounded-lg text-xs px-3 py-2.5 text-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">ทุกหมวดหมู่ (All Categories)</option>
              <option value="crypto">คริปโต / การเงิน</option>
              <option value="business">ธุรกิจ / การตลาด</option>
              <option value="community">ชุมชน / พูดคุยทั่วไป</option>
            </select>

            <button 
              onClick={handleSearch}
              disabled={loading}
              title="กด Enter หรือคลิกเพื่อค้นหา"
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'กำลังค้นหา...' : 'ค้นหา'}</span>
              <kbd className="hidden sm:inline-block bg-blue-800 text-blue-200 text-[10px] px-1.5 py-0.5 rounded font-mono">↵ Enter</kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-[#1e1e1e] border border-[#333] rounded-lg flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#222]">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-gray-200">ผลการค้นหากลุ่มเป้าหมาย</h3>
            {results.length > 0 && (
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full font-mono">
                พบ {results.length} กลุ่ม
              </span>
            )}
          </div>

          {results.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">เลือก {selectedIndices.length} รายการ</span>
              <button 
                onClick={handleExportCSV}
                className="bg-[#252525] hover:bg-[#333] border border-[#444] text-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                ส่งออก CSV
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto bg-[#121212]">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#252525] text-gray-400 sticky top-0 border-b border-[#333]">
              <tr>
                <th className="px-4 py-3 w-10 text-center">
                  <input 
                    type="checkbox" 
                    checked={results.length > 0 && selectedIndices.length === results.length}
                    onChange={toggleSelectAll}
                    className="rounded bg-[#252525] border-[#444] text-blue-500 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">ชื่อกลุ่ม / แชนแนล</th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">Username / Link</th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">ประเภท</th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">จำนวนสมาชิก</th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">คำอธิบาย</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-20 text-center text-gray-600 text-sm">
                    {loading ? 'กำลังค้นหากลุ่มข้อมูลจากเครือข่าย Telegram...' : 'กรอกคำค้นหาเพื่อเริ่มค้นหากลุ่มและช่องสาธารณะ'}
                  </td>
                </tr>
              ) : (
                results.map((res, i) => (
                  <tr key={i} className={`border-b border-[#222] hover:bg-[#1a1a1a] transition-colors ${selectedIndices.includes(i) ? 'bg-blue-950/20' : ''}`}>
                    <td className="px-4 py-3 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedIndices.includes(i)}
                        onChange={() => toggleSelectIndex(i)}
                        className="rounded bg-[#252525] border-[#444] text-blue-500 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 font-bold text-white">{res.name}</td>
                    <td 
                      className="px-4 py-3 text-blue-400 font-mono text-xs hover:underline cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(res.link);
                        setMsg(`คัดลอก ${res.link} เรียบร้อยแล้ว`);
                      }}
                      title="คลิกเพื่อคัดลอกลิงก์กลุ่ม"
                    >
                      {res.link}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-[#252525] text-gray-300 border border-[#383838] px-2 py-0.5 rounded text-[11px]">
                        {res.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-200 font-medium">{res.members}</span>
                      <span className="text-green-400 text-xs ml-2">({res.online} ออนไลน์)</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 max-w-[250px] truncate text-xs">{res.desc}</td>
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

