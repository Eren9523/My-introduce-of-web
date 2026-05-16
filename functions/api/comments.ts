export interface Env {
  DB: any;
}

export const onRequestGet = async (context: { env: Env }) => {
  try {
    try {
      await context.env.DB.prepare("ALTER TABLE comments ADD COLUMN parent_id TEXT").run();
    } catch (e) {}
    const { results } = await context.env.DB.prepare(
      "SELECT * FROM comments ORDER BY created_at DESC"
    ).all();
    return Response.json(results || []);
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    try {
      await context.env.DB.prepare("ALTER TABLE comments ADD COLUMN parent_id TEXT").run();
    } catch (e) {}
    const reqBody = (await context.request.json()) as any;
    const { author, content, parent_id } = reqBody;
    
    // Use the current timestamp string or integer depending on how we want it
    const { meta, success, error } = await context.env.DB.prepare(
      "INSERT INTO comments (content, author, created_at, parent_id) VALUES (?, ?, ?, ?)"
    ).bind(content, author, Date.now(), parent_id || null).run();
    
    if (!success) {
       return Response.json({ error: "DB Insert Failed", details: error }, { status: 500 });
    }
    
    return Response.json({ success: true, id: meta?.last_row_id });
  } catch (err) {
    return Response.json({ error: String(err), stack: err instanceof Error ? err.stack : undefined }, { status: 500 });
  }
};

export const onRequestDelete = async (context: { request: Request; env: Env }) => {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    if (id) {
      await context.env.DB.prepare("DELETE FROM comments WHERE id = ?").bind(id).run();
      try {
        await context.env.DB.prepare("DELETE FROM comments WHERE parent_id = ?").bind(id).run();
      } catch (e) {}
      return Response.json({ success: true });
    }
    return new Response("Not found", { status: 404 });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
};
