export interface Env {
  DB: any;
}

export const onRequestGet = async (context: { env: Env }) => {
  try {
    const { results } = await context.env.DB.prepare(`
      SELECT p.*, u.username, u.role as authorRole 
      FROM posts p 
      LEFT JOIN users u ON p.author_id = u.id 
      ORDER BY p.created_at DESC
    `).all();
    return Response.json(results || []);
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const reqBody = (await context.request.json()) as any;
    const { author_id, title, content } = reqBody;

    if (!content) {
      return Response.json({ error: "Content is required" }, { status: 400 });
    }

    const { success, error, meta } = await context.env.DB.prepare(
      "INSERT INTO posts (author_id, title, content) VALUES (?, ?, ?)"
    ).bind(author_id, title || null, content).run();

    if (!success) {
      return Response.json({ error: "DB Insert Failed", details: error }, { status: 500 });
    }

    const insertId = meta?.last_row_id;
    
    // Fetch the newly created post wrapper
    const newPost = await context.env.DB.prepare(`
      SELECT p.*, u.username, u.role as authorRole 
      FROM posts p 
      JOIN users u ON p.author_id = u.id 
      WHERE p.id = ?
    `).bind(insertId).first();

    return Response.json(newPost || { success: true, id: insertId });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
};
