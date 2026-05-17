import { authenticate } from "../../../utils/auth";

export async function onRequestPut({ request, params, env }: any) {
  try {
    const user = await authenticate(request, env);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { id } = params;
    const todo = await env.DB.prepare(`SELECT author_id, is_completed FROM todos WHERE id = ?1`).bind(id).first();
    if (!todo) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }

    if (user.role !== 'admin' && user.userId !== todo.author_id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const newState = todo.is_completed ? 0 : 1;
    await env.DB.prepare(`UPDATE todos SET is_completed = ?1 WHERE id = ?2`).bind(newState, id).run();
    
    return new Response(JSON.stringify({ success: true, is_completed: newState }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
