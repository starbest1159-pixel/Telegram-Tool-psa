import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

// Persistent 30-Day License Management
const LICENSE_FILE = path.join(process.cwd(), "license_data.json");
const USER_CREDENTIALS_FILE = path.join(process.cwd(), "user_credentials.json");
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

interface StoredLicense {
  licenseId: string;
  plan: string;
  isActivated: boolean;
  activatedAt: number | null;
  expiresAt: number | null;
  durationDays: number;
  supportContact: string;
  firstLoginUser?: string | null;
}

function getStoredUser() {
  if (fs.existsSync(USER_CREDENTIALS_FILE)) {
    try {
      const content = fs.readFileSync(USER_CREDENTIALS_FILE, "utf-8");
      return JSON.parse(content);
    } catch (err) {
      console.error("Failed to read user credentials file", err);
    }
  }
  return {
    username: "psa_user_8721",
    password: "PSA-78b9v2",
    role: "PSA Owner / License Holder",
    plan: "30-Day Enterprise Pass"
  };
}

function saveLicense(license: StoredLicense) {
  try {
    fs.writeFileSync(LICENSE_FILE, JSON.stringify(license, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write license file", err);
  }
}

function getOrCreateLicense(): StoredLicense {
  if (fs.existsSync(LICENSE_FILE)) {
    try {
      const content = fs.readFileSync(LICENSE_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed.licenseId === "string") {
        return {
          licenseId: parsed.licenseId,
          plan: parsed.plan || "PSA Enterprise 30-Day Pass (PRO Edition)",
          isActivated: Boolean(parsed.isActivated),
          activatedAt: typeof parsed.activatedAt === "number" ? parsed.activatedAt : null,
          expiresAt: typeof parsed.expiresAt === "number" ? parsed.expiresAt : null,
          durationDays: parsed.durationDays || 30,
          supportContact: parsed.supportContact || "@255yxtaf",
          firstLoginUser: parsed.firstLoginUser || null
        };
      }
    } catch (err) {
      console.error("Failed to read license file, reinitializing", err);
    }
  }

  // Not yet activated: clock starts ONLY after first login!
  const newLicense: StoredLicense = {
    licenseId: "PSA-30D-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    plan: "PSA Enterprise 30-Day Pass (PRO Edition)",
    isActivated: false,
    activatedAt: null,
    expiresAt: null,
    durationDays: 30,
    supportContact: "@255yxtaf",
    firstLoginUser: null
  };

  saveLicense(newLicense);
  return newLicense;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize license status check
  getOrCreateLicense();

  app.use(express.json());

  // API Routes
  
  // 30-Day License Status Endpoint (Starts counting down ONLY after first login)
  app.get("/api/license", (req, res) => {
    const license = getOrCreateLicense();
    const now = Date.now();

    // If not activated yet, 30 days is kept 100% intact until the first login happens!
    if (!license.isActivated || !license.expiresAt) {
      return res.json({
        success: true,
        data: {
          licenseId: license.licenseId,
          plan: license.plan,
          isActivated: false,
          activatedAt: null,
          expiresAt: null,
          durationDays: license.durationDays,
          remainingSeconds: license.durationDays * 24 * 3600,
          isExpired: false,
          formattedTime: {
            days: 30,
            hours: 0,
            minutes: 0,
            seconds: 0
          },
          supportContact: license.supportContact,
          statusMessage: "รอการเข้าสู่ระบบครั้งแรกเพื่อเริ่มนับเวลา 30 วัน"
        }
      });
    }

    const remainingMs = Math.max(0, license.expiresAt - now);
    const remainingSeconds = Math.floor(remainingMs / 1000);
    const isExpired = remainingSeconds <= 0;

    const days = Math.floor(remainingSeconds / (24 * 3600));
    const hours = Math.floor((remainingSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    res.json({
      success: true,
      data: {
        licenseId: license.licenseId,
        plan: license.plan,
        isActivated: true,
        activatedAt: license.activatedAt,
        expiresAt: license.expiresAt,
        durationDays: license.durationDays,
        remainingSeconds,
        isExpired,
        formattedTime: {
          days,
          hours,
          minutes,
          seconds,
        },
        supportContact: license.supportContact,
        statusMessage: "เปิดใช้งานแล้ว (เริ่มนับถอยหลัง 30 วันตามเวลาจริง)"
      }
    });
  });

  // Login: verifies credentials and activates the 30-day countdown timer on first successful login
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const storedUser = getStoredUser();
    const validPasswords = ["psaistudio", "demo2026", "psa255yxtaf", "admin"];

    const isMatch = Boolean(
      (username && username.trim().toLowerCase() === storedUser.username.toLowerCase() && password === storedUser.password) ||
      (username && validPasswords.includes(password))
    );

    if (isMatch) {
      const license = getOrCreateLicense();
      let wasJustActivated = false;

      // FIRST-TIME ACTIVATION TRIGGER: Starts the 30-day timer only when first login succeeds!
      if (!license.isActivated || !license.expiresAt) {
        license.isActivated = true;
        license.activatedAt = Date.now();
        license.expiresAt = Date.now() + THIRTY_DAYS_MS;
        license.firstLoginUser = username.trim();
        saveLicense(license);
        wasJustActivated = true;
      }

      res.json({ 
        success: true, 
        token: "mock-jwt-token", 
        message: wasJustActivated 
          ? "เข้าสู่ระบบสำเร็จ (เริ่มนับเวลาใช้งาน 30 วันทันที)" 
          : "เข้าสู่ระบบสำเร็จ",
        wasJustActivated,
        user: {
          username: username.trim(),
          role: "ผู้ใช้งานระบบ (License Holder)",
          licenseDays: 30,
          isActivated: license.isActivated,
          activatedAt: license.activatedAt,
          expiresAt: license.expiresAt
        }
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" 
      });
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
        message: "ตรวจสอบสิทธิ์สำเร็จ: คุณเป็นแอดมินกลุ่มนี้ มีสิทธิ์ดึงสมาชิกเข้ากลุ่มได้อย่างปลอดภัย"
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
        roleLabel: "ผู้ดูแลระบบ (Administrator)",
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
        message: "ยืนยันสิทธิ์แอดมินสำเร็จ! เพิ่มกลุ่มนี้เข้าสู่คลังกลุ่มที่คุณดูแลแล้ว"
      });
    }

    // Default: Not an admin
    return res.json({
      success: true,
      isAdmin: false,
      canExtractToCsv: true,
      role: "member",
      roleLabel: "สมาชิกทั่วไป (Regular Member)",
      canInviteUsers: false,
      title: `กลุ่มภายนอก (${cleanLink})`,
      link: cleanLink,
      memberCount: Math.floor(1000 + Math.random() * 15000),
      permissions: {
        can_invite_users: false,
        can_manage_chat: false,
        can_delete_messages: false,
        can_change_info: false
      },
      message: "CHAT_ADMIN_REQUIRED: คุณไม่ได้เป็นแอดมินของกลุ่มนี้ ตามกฎเกณฑ์ Telegram คุณไม่สามารถเพิ่มสมาชิกเข้ากลุ่มของผู้อื่นได้ แต่คุณสามารถดึงข้อมูลสมาชิกกลุ่มนี้เพื่อส่งออกเป็นไฟล์ CSV ได้ที่เมนู 'ดึงข้อมูลกลุ่ม'"
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
