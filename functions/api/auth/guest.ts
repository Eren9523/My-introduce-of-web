export interface Env {
  DB: any;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const id = crypto.randomUUID();
    const guestUsername = "guest_" + id.substring(0, 8);
    
    // Create a temporary/guest user
    const { success, error } = await context.env.DB.prepare(
      "INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, 'guest')"
    ).bind(id, guestUsername, "guest_hash").run();

    if (!success) {
      return Response.json({ error: "Create guest failed", details: error }, { status: 500 });
    }

    return Response.json({
      message: "访客登录成功",
      user: {
        userId: id,
        username: guestUsername,
        role: "guest"
      }
    });

  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
};
