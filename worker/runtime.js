const decoded = new Map();
const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

function assetResponse(path, request) {
  const asset = ASSETS[path];
  if (!asset) return new Response("Not found", { status: 404 });
  let bytes = decoded.get(path);
  if (!bytes) {
    const raw = atob(asset.body);
    bytes = Uint8Array.from(raw, c => c.charCodeAt(0));
    decoded.set(path, bytes);
  }
  const headers = { "content-type": asset.type, "cache-control": path === "/" ? "no-cache" : "public, max-age=3600" };
  return new Response(request.method === "HEAD" ? null : bytes, { headers });
}

async function listClassroom(env) {
  const result = await env.DB.prepare("SELECT id, name, seat, flowers_json, arrangement_json, created_at FROM bouquets ORDER BY created_at DESC, id DESC LIMIT 48").all();
  return json({ records: (result.results || []).map(row => ({ id: row.id, name: row.name, seat: row.seat, flowers: safeParse(row.flowers_json, []), arrangement: safeParse(row.arrangement_json, []), created_at: row.created_at })) });
}

async function addBouquet(request, env) {
  if (Number(request.headers.get("content-length") || 0) > 50000) return json({ error: "payload_too_large" }, 413);
  let body;
  try { body = await request.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const name = String(body.name || "").trim().slice(0, 30);
  const seat = Number(body.seat);
  const flowers = Array.isArray(body.flowers) ? body.flowers.slice(0, 12).filter(x => typeof x === "string" && x.length < 20) : [];
  const arrangement = Array.isArray(body.arrangement) ? body.arrangement.slice(0, 12).map(x => ({ type: String(x.type || "").slice(0, 20), x: clampNumber(x.x), y: clampNumber(x.y), r: Math.max(-180, Math.min(180, Number(x.r) || 0)) })) : [];
  if (!name || !Number.isInteger(seat) || seat < 1 || seat > 48 || flowers.length < 3 || arrangement.length < 3) return json({ error: "invalid_input" }, 400);
  const result = await env.DB.prepare("INSERT INTO bouquets (name, seat, flowers_json, arrangement_json) VALUES (?, ?, ?, ?) ON CONFLICT(seat) DO NOTHING").bind(name, seat, JSON.stringify(flowers), JSON.stringify(arrangement)).run();
  if (!result.success) return json({ error: "write_failed" }, 500);
  if (!result.meta?.changes) return json({ error: "seat_taken" }, 409);
  return json({ ok: true, id: result.meta.last_row_id }, 201);
}

function clampNumber(value) { const n = Number(value); return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 50; }
function safeParse(value, fallback) { try { return JSON.parse(value); } catch { return fallback; } }

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/classroom") {
      if (!env.DB) return json({ error: "database_unavailable" }, 503);
      if (request.method === "GET") return listClassroom(env);
      if (request.method === "POST") return addBouquet(request, env);
      return new Response("Method not allowed", { status: 405, headers: { allow: "GET, POST" } });
    }
    if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method not allowed", { status: 405 });
    let path;
    try { path = decodeURIComponent(url.pathname); } catch { return new Response("Bad request", { status: 400 }); }
    return assetResponse(path, request);
  }
};
