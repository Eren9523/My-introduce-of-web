import { authenticate } from "../../utils/auth";

export async function onRequestGet({ env }: any) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT t.*, u.username, u.role as authorRole 
      FROM todos t JOIN users u ON t.author_id = u.id 
      ORDER BY t.created_at DESC
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

    const { content } = await request.json();
    if (!content) {
      return new Response(JSON.stringify({ error: "Content is required" }), { status: 400 });
    }

    const id = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO todos (id, author_id, content) VALUES (?1, ?2, ?3)`
    ).bind(id, user.userId, content).run();
    
    const newTodo = await env.DB.prepare(`
      SELECT t.*, u.username, u.role as authorRole 
      FROM todos t JOIN users u ON t.author_id = u.id WHERE t.id = ?1
    `).bind(id).first();
    
    return new Response(JSON.stringify(newTodo), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
