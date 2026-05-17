export interface Env {
  DB: any;
}

const jsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const onRequestGet = async (context: { env: Env }) => {
  try {
    const { results } = await context.env.DB.prepare(`
      SELECT p.*, u.username, u.role as authorRole 
      FROM posts p 
      LEFT JOIN users u ON p.author_id = u.id 
      ORDER BY p.created_at DESC
    `).all();
    return jsonResponse(results || []);
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const reqBody = (await context.request.json()) as any;
    const { title, content } = reqBody;

    let author_id = reqBody.author_id;
    const authHeader = context.request.headers.get('Authorization');
    if (!author_id && authHeader && authHeader.startsWith('Bearer cf-token-')) {
       author_id = authHeader.replace('Bearer cf-token-', '');
    }

    if (!author_id) {
      return jsonResponse({ error: "Unauthorized: Missing author_id" }, 401);
    }

    if (!content) {
      return jsonResponse({ error: "Content is required" }, 400);
    }

    const { success, error, meta } = await context.env.DB.prepare(
      "INSERT INTO posts (author_id, title, content) VALUES (?, ?, ?)"
    ).bind(author_id, title || null, content).run();

    if (!success) {
      return jsonResponse({ error: "DB Insert Failed", details: error }, 500);
    }

    const insertId = meta?.last_row_id;
    
    // Fetch the newly created post wrapper
    const newPost = await context.env.DB.prepare(`
      SELECT p.*, u.username, u.role as authorRole 
      FROM posts p 
      JOIN users u ON p.author_id = u.id 
      WHERE p.id = ?
    `).bind(insertId).first();

    return jsonResponse(newPost || { success: true, id: insertId });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
};
