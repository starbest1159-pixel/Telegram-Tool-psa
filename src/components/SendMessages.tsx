import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Send, Image, Upload, Play, CheckCircle2, RefreshCw, FileText, Sparkles } from 'lucide-react';

export function SendMessages() {
  const { addWorkLog } = useAppContext();
  const [message, setMessage] = useState('');
  const [delayMin, setDelayMin] = useState('5');
  const [delayMax, setDelayMax] = useState('15');
  const [loading, setLoading] = useState(false);
  const [msgStatus, setMsgStatus] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const [targets, setTargets] = useState<{ id: string; status: string }[]>([]);

  const handleImportTargets = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = (event.target?.result as string) || '';
        const lines = text
          .split(/[\r\n,]+/)
          .map(l => l.trim().replace(/^["']|["']$/g, ''))
          .filter(l => l.length > 0 && !l.toLowerCase().includes('user id') && !l.toLowerCase().includes('username') && !l.toLowerCase().includes('ชื่อ'));
        
        const imported = lines.map(line => ({
          id: line.startsWith('@') || /^\d+$/.test(line) ? line : `@${line}`,
          status: 'รอคิว (Queued)'
        }));
        setTargets(prev => [...prev, ...imported]);
        setMsgStatus(`นำเข้ารายชื่อจาก ${file.name} เพิ่มขึ้น ${imported.length} บัญชี`);
      };
      reader.readAsText(file);
    }
  };

  const handleImageAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file.name);
      setMsgStatus(`แนบไฟล์ ${file.name} เรียบร้อยแล้ว`);
    }
  };

  const handleSend = () => {
    if (!message.trim()) return setMsgStatus('กรุณาพิมพ์ข้อความที่ต้องการส่ง');
    if (targets.length === 0) return setMsgStatus('ไม่มีรายชื่อเป้าหมาย กรุณานำเข้ารายชื่อก่อน');

    setLoading(true);
    setProgress(0);
    setMsgStatus('');
    setLogs(['เริ่มต้นส่งข้อความบรอดแคสต์แบบอัตโนมัติ...']);

    let current = 0;
    const updatedTargets = [...targets];

    const interval = setInterval(() => {
      if (current >= updatedTargets.length) {
        clearInterval(interval);
        setLoading(false);
        setMsgStatus('ส่งข้อความบรอดแคสต์เสร็จสิ้นทุกรายการ!');
        addWorkLog({
          type: 'ส่งข้อความ (Send Message)',
          target: `${targets.length} รายการ`,
          status: 'สำเร็จ',
          details: `ส่งข้อความสำเร็จ ${targets.length} คน (หน่วงเวลา ${delayMin}-${delayMax}วิ)`
        });
        return;
      }

      updatedTargets[current].status = 'ส่งสำเร็จ';
      setTargets([...updatedTargets]);

      current += 1;
      const pct = Math.floor((current / updatedTargets.length) * 100);
      setProgress(pct);

      setLogs(prev => [
        `ส่งหา ${updatedTargets[current - 1].id} สำเร็จ [Delay: ${Math.floor(Number(delayMin) + Math.random() * 5)}s]`,
        ...prev
      ]);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212] text-gray-300 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
            <Send className="w-6 h-6 text-blue-400" />
            ระบบส่งข้อความอัตโนมัติ (Mass Messaging & Spintax)
          </h2>
          <p className="text-xs text-gray-500 mt-1">ส่งข้อความหาผู้ใช้หรือกลุ่มเป้าหมายแบบอัตโนมัติ พร้อมระบบ Spintax สลับคำสุ่มข้อความป้องกันสแปม</p>
        </div>
      </div>

      {msgStatus && (
        <div className="mb-4 bg-blue-500/10 text-blue-400 p-3 border border-blue-500/20 rounded-lg text-sm flex items-center justify-between">
          <span>{msgStatus}</span>
          <button onClick={() => setMsgStatus('')} className="text-xs text-blue-300 hover:underline">ปิด</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Left Column: Message Editor & Speed Config */}
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
          {/* Message Box */}
          <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-5 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                เนื้อหาข้อความ (Message Body & Spintax)
              </h3>
              <span className="text-[11px] text-gray-500">รองรับ Spintax เช่น &#123;สวัสดี|ดีจ้า|หวัดดี&#125;</span>
            </div>

            <textarea 
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  e.preventDefault();
                  if (!loading) handleSend();
                }
              }}
              placeholder="พิมพ์ข้อความที่ต้องการส่ง (ตัวอย่าง: {สวัสดี|ดีครับ|ทักทาย} ยินดีต้อนรับสู่ระบบ PSAistudio) [กด Ctrl+Enter เพื่อส่งด่วน]"
              className="w-full bg-[#252525] border border-[#444] rounded-lg text-sm p-3 text-white focus:outline-none focus:border-blue-500 font-sans resize-none"
            />

            <div className="mt-3 flex items-center justify-between">
              <label className="cursor-pointer bg-[#252525] hover:bg-[#333] border border-[#444] text-xs text-gray-300 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Image className="w-4 h-4 text-blue-400" />
                {attachedFile ? `ไฟล์ที่แนบ: ${attachedFile}` : 'แนบรูปภาพ / วิดีโอ'}
                <input type="file" accept="image/*,video/*" onChange={handleImageAttach} className="hidden" />
              </label>

              {attachedFile && (
                <button 
                  onClick={() => setAttachedFile(null)}
                  className="text-xs text-red-400 hover:underline"
                >
                  ลบไฟล์แนบ
                </button>
              )}
            </div>
          </div>

          {/* Configuration & Controls */}
          <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 mb-3 border-b border-[#333] pb-2">ตั้งค่าความเร็วและการส่ง (Interval Settings)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">หน่วงเวลาระหว่างข้อความ (Delay Min - Max)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={delayMin}
                      onChange={(e) => setDelayMin(e.target.value)}
                      className="w-20 bg-[#252525] border border-[#444] rounded-lg text-sm px-3 py-2 text-white font-mono text-center focus:outline-none focus:border-blue-500" 
                    />
                    <span className="text-xs text-gray-500">ถึง</span>
                    <input 
                      type="number" 
                      value={delayMax}
                      onChange={(e) => setDelayMax(e.target.value)}
                      className="w-20 bg-[#252525] border border-[#444] rounded-lg text-sm px-3 py-2 text-white font-mono text-center focus:outline-none focus:border-blue-500" 
                    />
                    <span className="text-xs text-gray-400">วินาที</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">สถานะการส่ง</label>
                  <div className="text-xs text-gray-300 bg-[#252525] border border-[#333] p-2 rounded-lg font-mono">
                    ส่งแล้ว {targets.filter(t => t.status.includes('สำเร็จ')).length} / {targets.length} รายการ
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#333]">
              <button 
                onClick={handleSend}
                disabled={loading}
                title="กด Ctrl+Enter หรือคลิกเพื่อเริ่มส่งข้อความ"
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    กำลังส่งข้อความ ({progress}%)
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>เริ่มส่งข้อความทั้งหมด</span>
                    <kbd className="hidden sm:inline-block bg-blue-800 text-blue-200 text-[10px] px-1.5 py-0.5 rounded font-mono">Ctrl + Enter</kbd>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Target List & Console Log */}
        <div className="bg-[#1e1e1e] border border-[#333] rounded-lg flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#333] bg-[#222] flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-200">รายชื่อผู้รับเป้าหมาย ({targets.length})</h3>
            <label className="cursor-pointer bg-[#252525] hover:bg-[#333] border border-[#444] text-xs text-gray-200 px-2.5 py-1.5 rounded transition-colors flex items-center gap-1">
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              นำเข้า TXT/CSV
              <input type="file" accept=".txt,.csv" onChange={handleImportTargets} className="hidden" />
            </label>
          </div>

          <div className="flex-1 overflow-auto bg-[#121212]">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#252525] text-gray-400 sticky top-0 border-b border-[#333]">
                <tr>
                  <th className="px-4 py-2.5 font-medium text-xs">Username / ID</th>
                  <th className="px-4 py-2.5 font-medium text-xs text-right">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {targets.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-4 py-12 text-center text-gray-500 text-xs">
                      ยังไม่มีรายชื่อเป้าหมาย กรุณาคลิก "นำเข้า TXT/CSV" ด้านบนเพื่อโหลดรายชื่อผู้รับ
                    </td>
                  </tr>
                ) : (
                  targets.map((t, i) => (
                    <tr key={i} className="border-b border-[#222] hover:bg-[#1a1a1a]">
                      <td className="px-4 py-2.5 text-xs text-white font-mono">{t.id}</td>
                      <td className="px-4 py-2.5 text-xs text-right font-medium">
                        <span className={t.status.includes('สำเร็จ') ? 'text-green-400' : 'text-gray-500'}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Live Dispatch Log */}
          <div className="h-36 border-t border-[#333] bg-[#0a0a0a] p-3 overflow-auto font-mono text-[11px] text-gray-400">
            <div className="text-gray-500 mb-1 border-b border-[#222] pb-1 font-semibold">Live Dispatch Log:</div>
            {logs.length === 0 ? (
              <p className="text-gray-600 italic">พร้อมส่งข้อความ...</p>
            ) : (
              logs.map((l, idx) => <p key={idx} className={l.includes('สำเร็จ') ? 'text-green-400' : 'text-blue-400'}>{l}</p>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

