import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Login
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (username && (password === "psaistudio" || password === "psa255yxtaf" || password === "admin")) {
      res.json({ success: true, token: "mock-jwt-token", message: "เข้าสู่ระบบสำเร็จ" });
    } else {
      res.status(401).json({ success: false, message: "รหัสผ่านไม่ถูกต้อง (รหัสผ่านคงที่คือ: psaistudio)" });
    }
  });

  // Check Target Group
  app.post("/api/check-group", (req, res) => {
    const { link } = req.body;
    if (!link) {
      return res.status(400).json({ success: false, message: "กรุณาระบุลิงก์กลุ่ม" });
    }
    
    const totalMembers = Math.floor(500 + Math.random() * 25000);
    
    // Mock response for group analysis
    res.json({
      success: true,
      data: {
        isSuperGroup: Math.random() > 0.2, // 80% chance it's a super group
        totalMembers: totalMembers,
        onlineMembers: Math.floor(totalMembers * (0.05 + Math.random() * 0.1)),
        canExtract: Math.floor(totalMembers * (0.6 + Math.random() * 0.3)),
        pastAdmins: Math.floor(Math.random() * 15),
        adminsAndBots: Math.floor(1 + Math.random() * 10),
        myAccountsInGroup: 1,
      }
    });
  });

  // Start Extraction
  app.post("/api/extract", (req, res) => {
    const { limit, filterOnline } = req.body;
    // Mock successful start
    res.json({ 
      success: true, 
      message: "เริ่มดึงข้อมูลแล้ว", 
      jobId: `job-${Date.now()}` 
    });
  });

  // Admin Groups & Admin Rights Check for Adding Members
  const initialAdminGroups: any[] = [];

  let adminGroups = [...initialAdminGroups];

  app.get("/api/my-admin-groups", (req, res) => {
    res.json({ success: true, data: adminGroups });
  });

  app.post("/api/check-admin-status", (req, res) => {
    const { link, sessionPhone } = req.body;
    if (!link) {
      return res.status(400).json({ success: false, message: "กรุณาระบุลิงก์กลุ่มเพื่อตรวจสอบสิทธิ์" });
    }

    const cleanLink = link.trim().replace(/^https?:\/\//, '').toLowerCase();
    
    // Check if group is in user's known admin list
    const found = adminGroups.find(g => 
      cleanLink.includes(g.link.replace(/^https?:\/\//, '').toLowerCase()) ||
      g.link.replace(/^https?:\/\//, '').toLowerCase().includes(cleanLink)
    );

    if (found) {
      return res.json({
        success: true,
        isAdmin: true,
        role: found.role,
        roleLabel: found.roleLabel,
        canInviteUsers: found.canInviteUsers,
        title: found.title,
        link: found.link,
        memberCount: found.memberCount,
        permissions: {
          can_invite_users: true,
          can_manage_chat: true,
          can_delete_messages: found.canDeleteMessages,
          can_change_info: found.canChangeInfo
        },
        message: "✅ ตรวจสอบสิทธิ์สำเร็จ: คุณเป็นแอดมินกลุ่มนี้ มีสิทธิ์ดึงสมาชิกเข้ากลุ่มได้อย่างปลอดภัย"
      });
    }

    // If it's another group, check if it specifies admin keyword or simulate realistic Telegram permission check
    const isLikelyAdmin = cleanLink.includes('admin') || cleanLink.includes('vip') || cleanLink.includes('mygroup') || cleanLink.includes('test');
    
    if (isLikelyAdmin) {
      const newAdminGroup = {
        id: `grp-${Date.now()}`,
        title: `กลุ่มที่ดูแล (${cleanLink})`,
        link: cleanLink.startsWith('t.me/') ? cleanLink : `t.me/${cleanLink.replace(/^@/, '')}`,
        role: "administrator",
        roleLabel: "🛡️ ผู้ดูแลระบบ (Administrator)",
        canInviteUsers: true,
        canChangeInfo: false,
        canDeleteMessages: true,
        memberCount: Math.floor(100 + Math.random() * 2000),
        adminSince: new Date().toISOString().split('T')[0],
        phoneOwner: sessionPhone || "+66957096123"
      };
      adminGroups.push(newAdminGroup);

      return res.json({
        success: true,
        isAdmin: true,
        role: newAdminGroup.role,
        roleLabel: newAdminGroup.roleLabel,
        canInviteUsers: true,
        title: newAdminGroup.title,
        link: newAdminGroup.link,
        memberCount: newAdminGroup.memberCount,
        permissions: {
          can_invite_users: true,
          can_manage_chat: true,
          can_delete_messages: true,
          can_change_info: false
        },
        message: "✅ ยืนยันสิทธิ์แอดมินสำเร็จ! เพิ่มกลุ่มนี้เข้าสู่คลังกลุ่มที่คุณดูแลแล้ว"
      });
    }

    // Default: Not an admin
    return res.json({
      success: true,
      isAdmin: false,
      role: "member",
      roleLabel: "👤 สมาชิกทั่วไป (Regular Member)",
      canInviteUsers: false,
      title: `กลุ่มทั่วไป (${cleanLink})`,
      link: cleanLink,
      memberCount: Math.floor(1000 + Math.random() * 15000),
      permissions: {
        can_invite_users: false,
        can_manage_chat: false,
        can_delete_messages: false,
        can_change_info: false
      },
      message: "❌ CHAT_ADMIN_REQUIRED: คุณไม่ได้เป็นแอดมินของกลุ่มนี้ ตามกฎของ Telegram คุณไม่สามารถเพิ่มสมาชิกเข้ากลุ่มของผู้อื่นได้"
    });
  });

  // Proxy Settings
  app.post("/api/proxy", (req, res) => {
    // Mock save proxy
    res.json({ success: true, message: "บันทึกการตั้งค่า Proxy สำเร็จ" });
  });

  // Send Messages
  app.post("/api/send-message", (req, res) => {
    res.json({ success: true, message: "เริ่มส่งข้อความแล้ว" });
  });
  
  const firstNames = ["Somsak", "John", "Alice", "Crypto", "Trader", "Somchai", "Manee", "Piti", "Chujai", "Elon", "Mana", "Vichai"];
  const lastNames = ["Jaidee", "Doe", "Smith", "Man", "Z", "Sukjai", "Rakdee", "Wong", "Mars", "Na Ayudhya"];
  const statuses = ["กำลังออนไลน์", "5 นาทีที่แล้ว", "10 นาทีที่แล้ว", "เมื่อวาน", "สัปดาห์ที่แล้ว", "เดือนที่แล้ว"];

  // Get mock results
  app.get("/api/results", (req, res) => {
    const filter = req.query.filter as string;
    
    let possibleStatuses = statuses;
    if (filter === 'active') {
      possibleStatuses = ["กำลังออนไลน์", "5 นาทีที่แล้ว", "10 นาทีที่แล้ว"];
    } else if (filter === 'online') {
      possibleStatuses = ["กำลังออนไลน์"];
    }
    
    const randomCount = Math.floor(15 + Math.random() * 30);
    const mockResults = Array.from({ length: randomCount }).map((_, i) => {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      return {
        id: Math.floor(100000000 + Math.random() * 900000000).toString(),
        username: `@${fName.toLowerCase()}_${Math.floor(Math.random() * 10000)}`,
        firstName: fName,
        lastName: lName,
        phone: Math.random() > 0.6 ? `+668${Math.floor(10000000 + Math.random() * 90000000)}` : "-",
        lastOnline: possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)]
      };
    });
    
    res.json({ success: true, data: mockResults });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
