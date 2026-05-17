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
    // 联合查询 posts 表与 users 表，关联作者信息，并按建立时间降序排列
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

    // 获取作者ID：优先从请求体获取，如果为空则解析 Auth Bearer 头部的 cf-token (仅作为简易防伪示例)
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

    // 尝试插入数据，如果由于外键约束（作者不存在）等原因会导致失败
    const { success, error, meta } = await context.env.DB.prepare(
      "INSERT INTO posts (author_id, title, content) VALUES (?, ?, ?)"
    ).bind(author_id, title || '', content).run();

    if (!success) {
      return jsonResponse({ error: "数据库写入失败，请检查用户状态", details: error }, 500);
    }

    const insertId = meta?.last_row_id;
    
    // 插入成功后立即查询该条数据返回，包含作者名称和角色
    const newPost = await context.env.DB.prepare(`
      SELECT p.*, u.username, u.role as authorRole 
      FROM posts p 
      JOIN users u ON p.author_id = u.id 
      WHERE p.id = ?
    `).bind(insertId).first();

    return jsonResponse(newPost || { success: true, id: insertId });
  } catch (err: any) {
    // 捕获 Cloudflare D1 抛出的 FOREIGN KEY 外键约束错误
    if (err.message && err.message.includes('FOREIGN KEY constraint failed')) {
      return jsonResponse({ error: "用户不存在或失效，请重新登录" }, 401);
    }
    return jsonResponse({ error: String(err) }, 500);
  }
};
