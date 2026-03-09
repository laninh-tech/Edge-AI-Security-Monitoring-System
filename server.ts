import express from "express";
import { createServer as createViteServer } from "vite";
import Database from 'better-sqlite3';

const db = new Database('security.db');

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS detections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    time TEXT,
    type TEXT,
    confidence REAL,
    location TEXT,
    alert BOOLEAN
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/logs", (req, res) => {
    try {
      const logs = db.prepare('SELECT * FROM detections ORDER BY id DESC LIMIT 50').all();
      res.json(logs.map(l => ({ ...l, alert: !!l.alert })));
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch logs' });
    }
  });

  app.post("/api/trigger", (req, res) => {
    try {
      const { type, location, alert } = req.body;
      const time = new Date().toLocaleTimeString('en-US', { hour12: false });
      const confidence = (0.9 + Math.random() * 0.09).toFixed(2);
      
      const stmt = db.prepare('INSERT INTO detections (time, type, confidence, location, alert) VALUES (?, ?, ?, ?, ?)');
      const info = stmt.run(time, type || 'Person', confidence, location || 'Manual Trigger', alert ? 1 : 0);
      
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (e) {
      res.status(500).json({ error: 'Failed to trigger detection' });
    }
  });

  app.delete("/api/logs", (req, res) => {
    try {
      db.prepare('DELETE FROM detections').run();
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to clear logs' });
    }
  });

  // SSE endpoint for real-time data
  app.get("/api/stream", (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fps = 32;
    const intervalId = setInterval(() => {
      fps = Math.max(28, Math.min(35, fps + (Math.random() - 0.5) * 4));
      
      // Randomly generate a detection
      let newDetection = null;
      if (Math.random() > 0.6) {
        const types = ['Person', 'Vehicle'];
        const locations = ['Cam 01 - Main Gate', 'Cam 02 - Parking A', 'Cam 03 - Loading Dock'];
        const type = types[Math.floor(Math.random() * types.length)];
        const confidence = (0.85 + Math.random() * 0.14).toFixed(2);
        const location = locations[Math.floor(Math.random() * locations.length)];
        const alert = Math.random() > 0.85;
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });

        const stmt = db.prepare('INSERT INTO detections (time, type, confidence, location, alert) VALUES (?, ?, ?, ?, ?)');
        const info = stmt.run(time, type, confidence, location, alert ? 1 : 0);
        
        newDetection = {
          id: info.lastInsertRowid,
          time,
          type,
          confidence: parseFloat(confidence),
          location,
          alert: !!alert
        };
      }

      const data = {
        fps: fps.toFixed(1),
        gpuLoad: Math.floor(70 + Math.random() * 20),
        memoryUsage: (4.0 + Math.random() * 1.5).toFixed(1),
        newDetection
      };

      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }, 1000);

    req.on('close', () => {
      clearInterval(intervalId);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
