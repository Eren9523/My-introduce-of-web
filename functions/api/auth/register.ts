export interface Env {
  DB: any;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const { username, password } = (await context.request.json()) as any;

    if (!username || !password) {
      return Response.json({ error: "请输入用户名和密码" }, { status: 400 });
    }

    // Hash the password using Web Crypto
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "salt"); // Simple salt
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    
    // Generate an ID (since randomUUID is available in workers)
    const id = crypto.randomUUID();

    // Check if user exists
    const existing = await context.env.DB.prepare(
      "SELECT id FROM users WHERE username = ?"
    ).bind(username).first();

    if (existing) {
      return Response.json({ error: "该用户已注册" }, { status: 400 });
    }

    // Insert user
    const { success, error } = await context.env.DB.prepare(
      "INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, 'user')"
    ).bind(id, username, passwordHash).run();

    if (!success) {
      return Response.json({ error: "数据库写入失败", details: error }, { status: 500 });
    }

    // Return success
    return Response.json({ message: "注册成功", userId: id });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
};
