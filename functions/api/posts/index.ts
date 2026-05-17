import { authenticate } from "../../utils/auth";

export async function onRequestGet({ env }: any) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT p.*, u.username, u.role as authorRole 
      FROM posts p 
      JOIN users u ON p.author_id = u.id 
      ORDER BY p.created_at DESC
    `).all();
    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

export async function onRequestPost({ request, env }: any) {
  try {
    const user = await authenticate(request, env);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { title, content } = await request.json();
    if (!content) {
      return new Response(JSON.stringify({ error: "Content is required" }), { status: 400 });
    }

    const id = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO posts (id, author_id, title, content) VALUES (?1, ?2, ?3, ?4)`
    ).bind(id, user.userId, title || null, content).run();
    
    const newPost = await env.DB.prepare(`
      SELECT p.*, u.username, u.role as authorRole 
      FROM posts p JOIN users u ON p.author_id = u.id WHERE p.id = ?1
    `).bind(id).first();
    
    return new Response(JSON.stringify(newPost), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
