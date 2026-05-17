import { authenticate } from "../../utils/auth";

export async function onRequestPost({ request, env }: any) {
  try {
    const user = await authenticate(request, env);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { post_id, content } = await request.json();
    if (!post_id || !content) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const id = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO log_comments (id, post_id, author_id, content) VALUES (?1, ?2, ?3, ?4)`
    ).bind(id, post_id, user.userId, content).run();

    const newComment = await env.DB.prepare(`
      SELECT c.*, u.username, u.role as authorRole 
      FROM log_comments c JOIN users u ON c.author_id = u.id WHERE c.id = ?1
    `).bind(id).first();
    
    return new Response(JSON.stringify(newComment), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
