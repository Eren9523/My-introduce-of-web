import { hashPassword } from "../../utils/crypto";
import { signJWT } from "../../utils/jwt";

export async function onRequestPost({ request, env }: any) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }
    
    if (/[^a-zA-Z0-9_\u4e00-\u9fa5]/.test(username)) {
      return new Response(JSON.stringify({ error: "Username contains invalid characters" }), { status: 400 });
    }

    const hashed = await hashPassword(password);
    const userId = crypto.randomUUID();

    try {
      await env.DB.prepare(
        `INSERT INTO users (id, username, password_hash, role) VALUES (?1, ?2, ?3, 'user')`
      ).bind(userId, username, hashed).run();
    } catch (err: any) {
      if (err.message && err.message.includes('UNIQUE constraint failed')) {
        return new Response(JSON.stringify({ error: "用户名已存在" }), { status: 409 });
      }
      throw err; // Standard catch later handles edge cases.
    }

    const secret = env.JWT_SECRET || "default_local_secret";
    const token = await signJWT({ userId, username, role: 'user' }, secret);
    
    return new Response(JSON.stringify({ token, user: { userId, username, role: 'user' } }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
