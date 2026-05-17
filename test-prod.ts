import { spawn } from "child_process";

const server = spawn("node", ["dist/server.cjs"], { env: { ...process.env, NODE_ENV: "production", PORT: "3001" } });

server.stdout.on("data", (data) => console.log(`Server: ${data}`));
server.stderr.on("data", (data) => console.error(`Server Error: ${data}`));

setTimeout(async () => {
  try {
    const res = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "produser", password: "password123" })
    });
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
  } catch (e) {
    console.error("Fetch failed", e);
  }
  server.kill();
}, 2000);
