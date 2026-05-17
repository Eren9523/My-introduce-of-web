export interface Env {
  DB: any;
}

export const onRequestDelete = async (context: { request: Request; env: Env; params: any }) => {
  try {
    const { id } = context.params;
    if (!id) {
      return Response.json({ error: "Missing id" }, { status: 400 });
    }

    const { success, error } = await context.env.DB.prepare(
      "DELETE FROM posts WHERE id = ?"
    ).bind(id).run();

    if (!success) {
      return Response.json({ error: "DB Delete Failed", details: error }, { status: 500 });
    }

    return Response.json({ success: true, message: "Deleted" });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
};
