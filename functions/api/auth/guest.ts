import { signJWT } from "../../utils/jwt";

export async function onRequestPost({ request, env }: any) {
  try {
    const userId = crypto.randomUUID();
    const username = `Guest_${Math.floor(Math.random() * 10000)}`;

    await env.DB.prepare(
      `INSERT INTO users (id, username, role) VALUES (?1, ?2, 'guest')`
    ).bind(userId, username).run();

    const secret = env.JWT_SECRET || "default_local_secret";
    const token = await signJWT({ userId, username, role: 'guest' }, secret);
    
    return new Response(JSON.stringify({ token, user: { userId, username, role: 'guest' } }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
