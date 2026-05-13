import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for command execution (mimicking Open Claw)
  app.post("/api/execute", async (req, res) => {
    const { command } = req.body;
    
    if (!command) {
      return res.status(400).json({ error: "No command provided" });
    }

    console.log(`[Open Claw] Executing command: ${command}`);

    try {
      // Basic protection: limit some dangerous commands or let it be for dev demo
      const { stdout, stderr } = await execPromise(command, { timeout: 10000 });
      res.json({ stdout, stderr });
    } catch (error: any) {
      res.json({ 
        error: error.message, 
        stdout: error.stdout || "", 
        stderr: error.stderr || "" 
      });
    }
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
    console.log(`Open Claw Backend Active`);
  });
}

startServer();
