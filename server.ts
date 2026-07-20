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
    if (username && password) {
      res.json({ success: true, token: "mock-jwt-token", message: "เข้าสู่ระบบสำเร็จ" });
    } else {
      res.status(401).json({ success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }
  });

  // Check Target Group
  app.post("/api/check-group", (req, res) => {
    const { link } = req.body;
    if (!link) {
      return res.status(400).json({ success: false, message: "กรุณาระบุลิงก์กลุ่ม" });
    }
    
    // Mock response for group analysis
    res.json({
      success: true,
      data: {
        totalMembers: 12500,
        onlineMembers: 843,
        canExtract: 11000,
        pastAdmins: 12,
        adminsAndBots: 8,
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

  // Proxy Settings
  app.post("/api/proxy", (req, res) => {
    // Mock save proxy
    res.json({ success: true, message: "บันทึกการตั้งค่า Proxy สำเร็จ" });
  });

  // Send Messages
  app.post("/api/send-message", (req, res) => {
    res.json({ success: true, message: "เริ่มส่งข้อความแล้ว" });
  });
  
  // Get mock results
  app.get("/api/results", (req, res) => {
    const mockResults = [
      { id: "102938475", username: "@crypto_man", firstName: "Crypto", lastName: "Man", phone: "+66812345678", lastOnline: "5 นาทีที่แล้ว" },
      { id: "293847561", username: "@trader_z", firstName: "Trader", lastName: "Z", phone: "-", lastOnline: "10 นาทีที่แล้ว" },
      { id: "384756192", username: "@alice_wonder", firstName: "Alice", lastName: "Wonder", phone: "-", lastOnline: "กำลังออนไลน์" },
    ];
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
