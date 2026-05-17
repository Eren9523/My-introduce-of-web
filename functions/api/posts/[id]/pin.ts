export interface Env {
  DB: any;
}

const jsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const onRequestPut = async (context: { request: Request; env: Env; params: any }) => {
  try {
    const { id } = context.params;
    if (!id) return jsonResponse({ error: "Missing id" }, 400);

    const reqBody = await context.request.json() as any;
    const is_pinned = reqBody.is_pinned === 1 ? 1 : 0;

    let success = false;
    let error: any = null;

    try {
      const result = await context.env.DB.prepare(
        "UPDATE posts SET is_pinned = ? WHERE id = ?"
      ).bind(is_pinned, id).run();
      success = result.success;
      error = result.error;
    } catch (e: any) {
      if (e.message && e.message.includes('no such column: is_pinned')) {
        await context.env.DB.prepare(`ALTER TABLE posts ADD COLUMN is_pinned INTEGER DEFAULT 0`).run();
        const result = await context.env.DB.prepare(
          "UPDATE posts SET is_pinned = ? WHERE id = ?"
        ).bind(is_pinned, id).run();
        success = result.success;
        error = result.error;
      } else {
        throw e;
      }
    }

    if (!success) {
      return jsonResponse({ error: "DB Update Failed", details: error }, 500);
    }

    // Return the updated post
    const post = await context.env.DB.prepare(`
      SELECT p.*, u.username, u.role as authorRole 
      FROM posts p LEFT JOIN users u ON p.author_id = u.id WHERE p.id = ?
    `).bind(id).first();

    return jsonResponse(post || { id, is_pinned });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
};
