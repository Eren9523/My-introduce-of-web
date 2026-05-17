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
      SELECT t.*, u.username, u.role as authorRole 
      FROM todos t 
      LEFT JOIN users u ON t.author_id = u.id 
      ORDER BY t.created_at DESC
    `).all();
    return jsonResponse(results || []);
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const reqBody = (await context.request.json()) as any;
    const { content } = reqBody;

    let author_id = reqBody.author_id;
    const authHeader = context.request.headers.get('Authorization');
    if (!author_id && authHeader && authHeader.startsWith('Bearer cf-token-')) {
       author_id = authHeader.replace('Bearer cf-token-', '');
    }

    if (!author_id) {
      return jsonResponse({ error: "未授权：缺少 author_id" }, 401);
    }

    if (!content) {
      return jsonResponse({ error: "内容不能为空" }, 400);
    }

    const id = crypto.randomUUID();

    const { success, error } = await context.env.DB.prepare(
      "INSERT INTO todos (id, author_id, content) VALUES (?, ?, ?)"
    ).bind(id, author_id, content).run();

    if (!success) {
      return jsonResponse({ error: "数据库写入失败", details: error }, 500);
    }

    const newTodo = await context.env.DB.prepare(`
      SELECT t.*, u.username, u.role as authorRole 
      FROM todos t 
      LEFT JOIN users u ON t.author_id = u.id 
      WHERE t.id = ?
    `).bind(id).first();

    return jsonResponse(newTodo || { success: true, id });
  } catch (err: any) {
    if (err.message && err.message.includes('FOREIGN KEY constraint failed')) {
      return jsonResponse({ error: "用户不存在或失效，请重新登录" }, 401);
    }
    return jsonResponse({ error: String(err) }, 500);
  }
};
