/* /api/inspo/img?id=...  returns one saved image. Add &dl=1 to download it as a file. */
import { cors } from "../_shared.js";

export async function onRequestGet({ request, env }) {
  const q = new URL(request.url).searchParams, id = q.get("id");
  if (!id) return new Response("Not found", { status: 404 });
  const row = await env.DB.prepare("SELECT client, board, mime, data FROM inspo WHERE id = ?").bind(id).first();
  if (!row) return new Response("Not found", { status: 404 });
  const name = `${row.client}-${row.board === "photos" ? "photo" : "inspo"}-${id.slice(0, 8)}.jpg`;
  return new Response(new Uint8Array(row.data), {
    headers: { "Content-Type": row.mime, "Cache-Control": "public, max-age=31536000, immutable", ...(q.get("dl") ? { "Content-Disposition": `attachment; filename="${name}"` } : {}), ...cors(request) }
  });
}
