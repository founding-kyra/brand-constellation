/* /api/inspo/img?id=...  returns one saved image. */
import { cors } from "../_shared.js";

export async function onRequestGet({ request, env }) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return new Response("Not found", { status: 404 });
  const row = await env.DB.prepare("SELECT mime, data FROM inspo WHERE id = ?").bind(id).first();
  if (!row) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(row.data), {
    headers: { "Content-Type": row.mime, "Cache-Control": "public, max-age=31536000, immutable", ...cors(request) }
  });
}
