import { hashPassword } from "../../utils/crypto";
import { signJWT } from "../../utils/jwt";

export async function onRequestPost({ request, env }: any) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }
    
    const userResult = await env.DB.prepare(`SELECT * FROM users WHERE username = ?1`).bind(username).first();
    if (!userResult) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 400 });
    }

    const hashed = await hashPassword(password);
    if (hashed !== userResult.password_hash) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 400 });
    }

    const secret = env.JWT_SECRET || "default_local_secret";
    const token = await signJWT({ userId: userResult.id, username: userResult.username, role: userResult.role }, secret);
    
    return new Response(JSON.stringify({ token, user: { userId: userResult.id, username: userResult.username, role: userResult.role } }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
