import { authenticate } from "../../utils/auth";

export async function onRequestDelete({ request, params, env }: any) {
  try {
    const user = await authenticate(request, env);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { id } = params;
    const todo = await env.DB.prepare(`SELECT author_id FROM todos WHERE id = ?1`).bind(id).first();
    if (!todo) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }

    if (user.role !== 'admin' && user.userId !== todo.author_id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    await env.DB.prepare(`DELETE FROM todos WHERE id = ?1`).bind(id).run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
