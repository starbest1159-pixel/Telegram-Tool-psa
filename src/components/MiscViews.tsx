import React from 'react';
import { useAppContext } from '../context/AppContext';

export function ProfileSearch() {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212] text-gray-300 p-6">
      <h2 className="text-xl font-semibold text-blue-400 mb-6">โปรไฟล์และค้นหาชื่อ</h2>
      <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 max-w-2xl">
        <p className="text-sm text-gray-400">อยู่ระหว่างการพัฒนา (Work in Progress)</p>
      </div>
    </div>
  );
}

export function WorkHistory() {
  const { workHistory } = useAppContext();

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212] text-gray-300 p-6">
      <h2 className="text-xl font-semibold text-blue-400 mb-6">ประวัติการทำงาน (Work History)</h2>
      <div className="bg-[#1e1e1e] border border-[#333] rounded-lg flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto bg-[#121212]">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#252525] text-gray-400 sticky top-0 border-b border-[#333]">
              <tr>
                <th className="px-4 py-3 font-medium">วันที่/เวลา</th>
                <th className="px-4 py-3 font-medium">ประเภทงาน</th>
                <th className="px-4 py-3 font-medium">เป้าหมาย</th>
                <th className="px-4 py-3 font-medium">สถานะ</th>
                <th className="px-4 py-3 font-medium">รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {workHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-600 text-sm">
                    ไม่มีประวัติการทำงาน
                  </td>
                </tr>
              ) : (
                workHistory.map((log) => (
                  <tr key={log.id} className="border-b border-[#222] hover:bg-[#1a1a1a]">
                    <td className="px-4 py-3 whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-4 py-3 text-blue-400">{log.type}</td>
                    <td className="px-4 py-3">{log.target}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        log.status === 'สำเร็จ' ? 'bg-green-500/10 text-green-400' :
                        log.status === 'กำลังดำเนินการ' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{log.details}</td>
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

export function ProgramSettings() {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212] text-gray-300 p-6">
      <h2 className="text-xl font-semibold text-blue-400 mb-6">ตั้งค่าโปรแกรม</h2>
      <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 max-w-2xl space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-200 mb-3">API Keys</h3>
          <div className="space-y-3">
             <input type="text" placeholder="Telegram API ID" className="w-full bg-[#252525] border border-[#444] rounded text-sm px-3 py-2.5 focus:outline-none focus:border-blue-500" />
             <input type="text" placeholder="Telegram API Hash" className="w-full bg-[#252525] border border-[#444] rounded text-sm px-3 py-2.5 focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-200 mb-3">การแจ้งเตือน</h3>
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input type="checkbox" className="rounded bg-[#252525] border-[#444] text-blue-500 focus:ring-blue-500" />
            เปิดเสียงแจ้งเตือนเมื่อทำงานเสร็จ
          </label>
        </div>
        <div className="pt-4 border-t border-[#333]">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm transition-colors">บันทึกการตั้งค่า</button>
        </div>
      </div>
    </div>
  );
}

export function Manual() {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212] text-gray-300 p-6">
      <h2 className="text-xl font-semibold text-blue-400 mb-6">คู่มือการใช้งาน</h2>
      <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 max-w-4xl overflow-y-auto">
        <h3 className="text-lg font-medium text-white mb-4">การตั้งค่าและการใช้งานเบื้องต้น</h3>
        
        <div className="space-y-6 text-sm text-gray-400">
          <section className="space-y-2">
            <h4 className="text-base font-medium text-blue-300">1. การเข้าสู่ระบบและการตั้งค่า Proxy</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>ใช้ชื่อผู้ใช้และรหัสผ่านเพื่อเข้าสู่ระบบ รองรับการใช้งานหลายยูสเซอร์เนมด้วยการล็อกอินเดียว</li>
              <li>ไปที่เมนู <strong>"ตั้งค่า Proxy"</strong> หากต้องการใช้งานผ่าน IP อื่นเพื่อป้องกันการถูกแบน</li>
              <li>รองรับ SOCKS5, HTTP, และ HTTPS Proxy</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h4 className="text-base font-medium text-blue-300">2. การดึงข้อมูลกลุ่ม</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>ไปที่เมนู <strong>"ดึงข้อมูลกลุ่ม"</strong> เพื่อเริ่มต้น</li>
              <li>ใส่ลิงก์กลุ่ม หรือ ID กลุ่มที่ต้องการในช่อง <strong>"ลิงก์กลุ่มเป้าหมาย"</strong> แล้วกด <strong>"เช็คกลุ่มเป้าหมาย"</strong></li>
              <li>ระบบจะทำการวิเคราะห์จำนวนสมาชิก สมาชิกที่ออนไลน์ และสถิติต่างๆ</li>
              <li>คลิก <strong>"เริ่มดึงข้อมูล"</strong> รอจนกระทั่งระบบทำงานเสร็จสิ้น คุณสามารถบันทึกเป็นไฟล์ CSV ได้</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h4 className="text-base font-medium text-blue-300">3. การเพิ่มสมาชิก (Add Members)</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>ไปที่เมนู <strong>"เพิ่มสมาชิกเข้ากลุ่ม"</strong></li>
              <li>ระบุกลุ่มปลายทางที่ต้องการนำสมาชิกเข้า</li>
              <li>อัปโหลดไฟล์รายชื่อ .csv หรือ .txt ที่ได้จากการดึงข้อมูล</li>
              <li>ตั้งค่าหน่วงเวลา (Delay) ที่เหมาะสม (แนะนำ 10-30 วินาทีต่อคน) เพื่อป้องกันบัญชีถูกแบน</li>
              <li>คลิก <strong>"เริ่มเพิ่มสมาชิก"</strong></li>
            </ul>
          </section>

          <section className="space-y-2">
            <h4 className="text-base font-medium text-blue-300">4. การส่งข้อความ (Send Messages)</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>สามารถส่งข้อความหาผู้ใช้แบบส่วนตัวได้ รองรับ Spintax เพื่อสุ่มข้อความ เช่น {'{สวัสดี|ดีจ้า|ทักทาย}'}</li>
              <li>นำเข้ารายชื่อที่ต้องการส่ง และตั้งเวลาหน่วงระหว่างการส่งแต่ละข้อความ</li>
            </ul>
          </section>

          <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <h4 className="text-base font-medium text-blue-300 mb-2">ติดต่อสอบถาม / แจ้งปัญหาการใช้งาน</h4>
            <p>
              หากพบปัญหาในการใช้งานหรือต้องการสอบถามรายละเอียดเพิ่มเติม สามารถติดต่อทีมซัพพอร์ตได้ที่
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="bg-[#121212] px-3 py-1.5 rounded text-white font-medium">Telegram: @PSAistudio</span>
              <span className="bg-[#121212] px-3 py-1.5 rounded text-white font-medium">Line: @255yxtaf</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function About() {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#121212] text-gray-300 p-6">
      <h2 className="text-xl font-semibold text-blue-400 mb-6">เกี่ยวกับโปรแกรม</h2>
      <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 max-w-2xl flex flex-col items-center justify-center gap-4 py-12">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500 text-2xl font-bold">T</div>
        <h3 className="text-lg font-medium text-white">Telegram Tool Dashboard</h3>
        <p className="text-sm text-gray-500">เวอร์ชัน 1.0.0</p>
        <p className="text-sm text-gray-400 mt-4 text-center">
          เครื่องมือสำหรับการบริหารจัดการกลุ่ม Telegram<br />
          สงวนลิขสิทธิ์ &copy; 2026
        </p>
      </div>
    </div>
  );
}

