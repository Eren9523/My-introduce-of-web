export interface Env {
  DB: any;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const { username, password } = (await context.request.json()) as any;

    if (!username || !password) {
      return Response.json({ error: "请输入用户名和密码" }, { status: 400 });
    }

    // Hash the password for checking
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "salt");
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    // Find the user
    const user = await context.env.DB.prepare(
      "SELECT * FROM users WHERE username = ? AND password_hash = ?"
    ).bind(username, passwordHash).first();

    if (!user) {
      return Response.json({ error: "用户名或密码错误" }, { status: 401 });
    }

    // In a real CF workers setup, we can sign a JWT here. 
    // For simplicity, we just return the user object (minus password).
    return Response.json({
      message: "登录成功",
      token: "cf-token-" + user.id, // Mock token for CF since jsonwebtoken isn't web native
      user: {
        userId: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
};
