const decoded = new Map();
function assetResponse(path, request) {
  const asset = ASSETS[path];
  if (!asset) return new Response("Not found", { status: 404 });
  let bytes = decoded.get(path);
  if (!bytes) { const raw = atob(asset.body); bytes = Uint8Array.from(raw, c => c.charCodeAt(0)); decoded.set(path, bytes); }
  return new Response(request.method === "HEAD" ? null : bytes, { headers: { "content-type": asset.type, "cache-control": path === "/" ? "no-cache" : "public, max-age=3600" } });
}
export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method not allowed", { status: 405 });
    let path; try { path = decodeURIComponent(new URL(request.url).pathname); } catch { return new Response("Bad request", { status: 400 }); }
    return assetResponse(path, request);
  }
};
