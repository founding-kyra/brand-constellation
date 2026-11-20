/* /api/media   videos clients add to their Photo Library (files in R2, list in D1)
   GET    ?client=jourdi-bleu                         list a client's uploaded videos (newest first)
   POST   ?client=...&note=...&name=...  body = the video file, Content-Type video/*   (needs X-Hub-Key)
   DELETE ?client=...&id=...                          remove one (needs X-Hub-Key)          */
import { cors, json, validClient, keyOk } from "./_shared.js";

const MAX_BYTES = 95 * 1024 * 1024;   /* Cloudflare Pages takes request bodies up to 100 MB */
const TYPES = { "video/mp4": "mp4", "video/quicktime": "mov", "video/webm": "webm", "video/x-m4v": "m4v" };

export const onRequestOptions = ({ request }) => new Response(null, { status: 204, headers: cors(request) });

export async function onRequestGet({ request, env }) {
  const client = new URL(request.url).searchParams.get("client");
  if (!validClient(client)) return json(request, { error: "Unknown hub." }, 400);
  const { results } = await env.DB.prepare("SELECT id, note, name, mime, size, created FROM media WHERE client = ? AND board = 'videos' ORDER BY created DESC LIMIT 200").bind(client).all();
  return json(request, { items: results });
}

export async function onRequestPost({ request, env }) {
  const q = new URL(request.url).searchParams, client = q.get("client");
  if (!validClient(client)) return json(request, { error: "Unknown hub." }, 400);
  if (!keyOk(env, client, request.headers.get("X-Hub-Key"))) return json(request, { error: "That passcode isn't right." }, 401);
  if (!env.MEDIA) return json(request, { error: "Video uploads aren't switched on yet." }, 503);
  const mime = (request.headers.get("Content-Type") || "").split(";")[0].trim();
  if (!TYPES[mime]) return json(request, { error: "Only MP4, MOV and WebM videos can be added." }, 400);
  const size = Number(request.headers.get("Content-Length") || 0);
  if (!size) return json(request, { error: "That video couldn't be read." }, 400);
  if (size > MAX_BYTES) return json(request, { error: "That video is over 95 MB. Send it to Kyra instead." }, 413);
  const id = crypto.randomUUID(), key = `${client}/videos/${id}.${TYPES[mime]}`;
  await env.MEDIA.put(key, request.body, { httpMetadata: { contentType: mime } });
  await env.DB.prepare("INSERT INTO media (id, client, board, created, note, name, mime, size, key) VALUES (?, ?, 'videos', ?, ?, ?, ?, ?, ?)")
    .bind(id, client, Date.now(), String(q.get("note") || "").slice(0, 280), String(q.get("name") || "").slice(0, 160), mime, size, key).run();
  return json(request, { id }, 201);
}

export async function onRequestDelete({ request, env }) {
  const q = new URL(request.url).searchParams, client = q.get("client"), id = q.get("id");
  if (!validClient(client) || !id) return json(request, { error: "Unknown video." }, 400);
  if (!keyOk(env, client, request.headers.get("X-Hub-Key"))) return json(request, { error: "That passcode isn't right." }, 401);
  const row = await env.DB.prepare("SELECT key FROM media WHERE id = ? AND client = ?").bind(id, client).first();
  if (row && env.MEDIA) await env.MEDIA.delete(row.key);
  await env.DB.prepare("DELETE FROM media WHERE id = ? AND client = ?").bind(id, client).run();
  return json(request, { ok: true });
}
