export interface Env {
  DB: any;
}

const jsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
};

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
    return jsonResponse(results || []);
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const reqBody = (await context.request.json()) as any;
    const { post_id, content, parent_id } = reqBody;

    let author_id = reqBody.author_id;
    const authHeader = context.request.headers.get('Authorization');
    if (!author_id && authHeader && authHeader.startsWith('Bearer cf-token-')) {
       author_id = authHeader.replace('Bearer cf-token-', '');
    }

    if (!author_id) {
      return jsonResponse({ error: "Unauthorized: Missing author_id" }, 401);
    }

    if (!post_id || !content) {
      return jsonResponse({ error: "Missing fields" }, 400);
    }

    const { success, error, meta } = await context.env.DB.prepare(
      "INSERT INTO log_comments (post_id, author_id, content, parent_id) VALUES (?, ?, ?, ?)"
    ).bind(post_id, author_id, content, parent_id || null).run();

    if (!success) {
      return jsonResponse({ error: "DB Insert Failed", details: error }, 500);
    }

    const insertId = meta?.last_row_id;
    
    // Fetch newly created
    const newComment = await context.env.DB.prepare(`
      SELECT c.*, u.username, u.role as authorRole 
      FROM log_comments c 
      JOIN users u ON c.author_id = u.id 
      WHERE c.id = ?
    `).bind(insertId).first();

    return jsonResponse(newComment || { success: true, id: insertId });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
};
