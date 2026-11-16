/* Shared helpers for the Brand Constellation API (Cloudflare Pages Functions). */

// Hubs on GitHub Pages and on Cloudflare can both call the API.
const ALLOWED = ["https://founding-kyra.github.io", "https://brand-constellation.pages.dev", "http://localhost:8765"];

export function cors(request) {
  const origin = request.headers.get("Origin") || "";
  const ok = ALLOWED.includes(origin) || origin.endsWith(".brand-constellation.pages.dev");
  return {
    "Access-Control-Allow-Origin": ok ? origin : ALLOWED[0],
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Hub-Key",
    "Vary": "Origin"
  };
}

export function json(request, body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors(request) } });
}

// Client folder names look like "resonant-living".
export const validClient = c => typeof c === "string" && /^[a-z0-9-]{2,60}$/.test(c);

// Each client has its own passcode (secret PASS_RESONANT_LIVING); PASS_ADMIN opens every hub.
export function keyOk(env, client, key) {
  if (!key) return false;
  const own = env["PASS_" + client.toUpperCase().replace(/-/g, "_")];
  return (own && key === own) || (env.PASS_ADMIN && key === env.PASS_ADMIN);
}
