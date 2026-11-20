/* /m/<client>/<file>  streams a library video Kyra uploaded to R2 (bucket brand-constellation-media, under library/).
   Supports Range so videos can be scrubbed. Add ?dl=1 to download it with its file name. */
export async function onRequestGet({ request, params, env }) {
  const path = [].concat(params.path || []).join("/");
  if (!env.MEDIA || !/^[a-z0-9-]+\/[a-z0-9._-]+$/i.test(path)) return new Response("Not found", { status: 404 });
  const key = "library/" + path, range = request.headers.get("Range");
  const obj = await env.MEDIA.get(key, range ? { range: request.headers } : undefined);
  if (!obj) return new Response("Not found", { status: 404 });
  const h = new Headers({ "Accept-Ranges": "bytes", "Cache-Control": "public, max-age=604800", "Access-Control-Allow-Origin": "*" });
  obj.writeHttpMetadata(h);
  if (new URL(request.url).searchParams.get("dl")) h.set("Content-Disposition", `attachment; filename="${path.split("/").pop()}"`);
  if (range && obj.range) {
    const start = obj.range.offset ?? 0, len = obj.range.length ?? (obj.size - start);
    h.set("Content-Range", `bytes ${start}-${start + len - 1}/${obj.size}`); h.set("Content-Length", String(len));
    return new Response(obj.body, { status: 206, headers: h });
  }
  h.set("Content-Length", String(obj.size));
  return new Response(obj.body, { headers: h });
}
