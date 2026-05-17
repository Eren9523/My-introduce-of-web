export interface Env {
  DB: any;
}

const jsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const id = crypto.randomUUID();
    const guestUsername = "guest_" + id.substring(0, 8);
    
    // Create a temporary/guest user
    const { success, error } = await context.env.DB.prepare(
      "INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, 'guest')"
    ).bind(id, guestUsername, "guest_hash").run();

    if (!success) {
      return jsonResponse({ error: "Create guest failed", details: error }, 500);
    }

    return jsonResponse({
      message: "访客登录成功",
      token: "cf-token-" + id,
      user: {
        userId: id,
        username: guestUsername,
        role: "guest"
      }
    });

  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
};
