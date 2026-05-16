export interface Env {
  DB: any;
}

export const onRequestGet = async (context: { env: Env }) => {
  try {
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
    const reqBody = (await context.request.json()) as any;
    const { author, content } = reqBody;
    
    await context.env.DB.prepare(
      "INSERT INTO comments (content, author) VALUES (?, ?)"
    ).bind(content, author).run();
    
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
};

export const onRequestDelete = async (context: { request: Request; env: Env }) => {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    if (id) {
      await context.env.DB.prepare("DELETE FROM comments WHERE id = ?").bind(id).run();
      return Response.json({ success: true });
    }
    return new Response("Not found", { status: 404 });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
};
