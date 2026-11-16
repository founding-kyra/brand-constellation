/* /api/inspo
   GET    ?client=resonant-living          list a client's saved images (newest first)
   POST   { client, note, mime, w, h, data(base64) }   add one (needs X-Hub-Key)
   DELETE ?client=...&id=...               remove one (needs X-Hub-Key)          */
import { cors, json, validClient, keyOk } from "./_shared.js";

const MAX_BYTES = 1_500_000;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

export const onRequestOptions = ({ request }) => new Response(null, { status: 204, headers: cors(request) });

export async function onRequestGet({ request, env }) {
  const client = new URL(request.url).searchParams.get("client");
  if (!validClient(client)) return json(request, { error: "Unknown hub." }, 400);
  const { results } = await env.DB.prepare("SELECT id, note, created, w, h FROM inspo WHERE client = ? ORDER BY created DESC LIMIT 500").bind(client).all();
  return json(request, { items: results });
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch (e) { return json(request, { error: "That upload couldn't be read. Try again." }, 400); }
  const { client, note = "", mime, w, h, data } = body || {};
  if (!validClient(client)) return json(request, { error: "Unknown hub." }, 400);
  if (!keyOk(env, client, request.headers.get("X-Hub-Key"))) return json(request, { error: "That passcode isn't right." }, 401);
  if (!TYPES.includes(mime) || typeof data !== "string") return json(request, { error: "Only photos and screenshots can be added." }, 400);
  let bytes;
  try { bytes = Uint8Array.from(atob(data), c => c.charCodeAt(0)); } catch (e) { return json(request, { error: "That image couldn't be read." }, 400); }
  if (bytes.length > MAX_BYTES) return json(request, { error: "That image is too large." }, 413);
  const id = crypto.randomUUID();
  await env.DB.prepare("INSERT INTO inspo (id, client, created, note, mime, w, h, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(id, client, Date.now(), String(note).slice(0, 280), mime, Number(w) || null, Number(h) || null, bytes).run();
  return json(request, { id }, 201);
}

export async function onRequestDelete({ request, env }) {
  const q = new URL(request.url).searchParams, client = q.get("client"), id = q.get("id");
  if (!validClient(client) || !id) return json(request, { error: "Unknown image." }, 400);
  if (!keyOk(env, client, request.headers.get("X-Hub-Key"))) return json(request, { error: "That passcode isn't right." }, 401);
  await env.DB.prepare("DELETE FROM inspo WHERE id = ? AND client = ?").bind(id, client).run();
  return json(request, { ok: true });
}
