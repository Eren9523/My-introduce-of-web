import { authenticate } from "../../utils/auth";

export async function onRequestGet({ request, params, env }: any) {
  try {
    const { id } = params;
    const post = await env.DB.prepare(`
      SELECT p.*, u.username, u.role as authorRole 
      FROM posts p JOIN users u ON p.author_id = u.id WHERE p.id = ?1
    `).bind(id).first();
    
    if (!post) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }
    
    const { results: comments } = await env.DB.prepare(`
      SELECT c.*, u.username, u.role as authorRole 
      FROM log_comments c JOIN users u ON c.author_id = u.id 
      WHERE c.post_id = ?1 ORDER BY c.created_at ASC
    `).bind(id).all();

    return new Response(JSON.stringify({ ...post, comments }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

export async function onRequestDelete({ request, params, env }: any) {
  try {
    const user = await authenticate(request, env);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { id } = params;
    const post = await env.DB.prepare(`SELECT author_id FROM posts WHERE id = ?1`).bind(id).first();
    if (!post) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }

    if (user.role !== 'admin' && user.userId !== post.author_id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    await env.DB.prepare(`DELETE FROM posts WHERE id = ?1`).bind(id).run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
