/* /api/media/file?id=...  streams one uploaded video (supports Range, so it can be scrubbed). Add &dl=1 to download it. */
import { cors } from "../_shared.js";

export async function onRequestGet({ request, env }) {
  const q = new URL(request.url).searchParams, id = q.get("id");
  if (!id || !env.MEDIA) return new Response("Not found", { status: 404 });
  const row = await env.DB.prepare("SELECT client, key, mime, size, name FROM media WHERE id = ?").bind(id).first();
  if (!row) return new Response("Not found", { status: 404 });
  const range = request.headers.get("Range");
  const obj = await env.MEDIA.get(row.key, range ? { range: request.headers } : undefined);
  if (!obj) return new Response("Not found", { status: 404 });
  const ext = row.key.split(".").pop(), base = (row.name || "").replace(/\.[^.]+$/, "").replace(/[^a-z0-9-]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
  const h = { "Content-Type": row.mime, "Accept-Ranges": "bytes", "Cache-Control": "public, max-age=31536000, immutable", ...cors(request) };
  if (q.get("dl")) h["Content-Disposition"] = `attachment; filename="${row.client}-${base || "video-" + id.slice(0, 8)}.${ext}"`;
  if (range && obj.range) {
    const start = obj.range.offset ?? 0, len = obj.range.length ?? (row.size - start);
    h["Content-Range"] = `bytes ${start}-${start + len - 1}/${row.size}`; h["Content-Length"] = String(len);
    return new Response(obj.body, { status: 206, headers: h });
  }
  h["Content-Length"] = String(row.size);
  return new Response(obj.body, { headers: h });
}
