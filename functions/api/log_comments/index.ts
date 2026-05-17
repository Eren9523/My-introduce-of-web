export interface Env {
  DB: any;
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  try {
    const url = new URL(context.request.url);
    const postId = url.searchParams.get("post_id");

    let query = `
      SELECT c.*, u.username, u.role as authorRole 
      FROM log_comments c 
      JOIN users u ON c.author_id = u.id
    `;
    let params: any[] = [];

    if (postId) {
      query += ` WHERE c.post_id = ?`;
      params.push(postId);
    }
    
    query += ` ORDER BY c.created_at ASC`;

    const { results } = await context.env.DB.prepare(query).bind(...params).all();
    return Response.json(results || []);
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const reqBody = (await context.request.json()) as any;
    const { post_id, author_id, content, parent_id } = reqBody;

    if (!post_id || !content) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const { success, error, meta } = await context.env.DB.prepare(
      "INSERT INTO log_comments (post_id, author_id, content, parent_id) VALUES (?, ?, ?, ?)"
    ).bind(post_id, author_id, content, parent_id || null).run();

    if (!success) {
      return Response.json({ error: "DB Insert Failed", details: error }, { status: 500 });
    }

    const insertId = meta?.last_row_id;
    
    // Fetch newly created
    const newComment = await context.env.DB.prepare(`
      SELECT c.*, u.username, u.role as authorRole 
      FROM log_comments c 
      JOIN users u ON c.author_id = u.id 
      WHERE c.id = ?
    `).bind(insertId).first();

    return Response.json(newComment || { success: true, id: insertId });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
};
