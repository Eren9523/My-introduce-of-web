export interface Env {
  DB: any;
}

export const onRequestGet = async (context: { request: Request; env: Env; params: any }) => {
  try {
    const { id } = context.params;
    if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

    const post = await context.env.DB.prepare(`
      SELECT p.*, u.username, u.role as authorRole 
      FROM posts p JOIN users u ON p.author_id = u.id WHERE p.id = ?
    `).bind(id).first();

    if (!post) return Response.json({ error: "Not found" }, { status: 404 });

    const { results: comments } = await context.env.DB.prepare(`
      SELECT c.*, u.username, u.role as authorRole 
      FROM log_comments c JOIN users u ON c.author_id = u.id 
      WHERE c.post_id = ? ORDER BY c.created_at ASC
    `).bind(id).all();

    return Response.json({ ...post, comments: comments || [] });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
};

export const onRequestDelete = async (context: { request: Request; env: Env; params: any }) => {
  try {
    const { id } = context.params;
    if (!id) {
      return Response.json({ error: "Missing id" }, { status: 400 });
    }

    const { success, error } = await context.env.DB.prepare(
      "DELETE FROM posts WHERE id = ?"
    ).bind(id).run();

    if (!success) {
      return Response.json({ error: "DB Delete Failed", details: error }, { status: 500 });
    }

    return Response.json({ success: true, message: "Deleted" });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
};
