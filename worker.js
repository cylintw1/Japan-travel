const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
    const url = new URL(req.url);
    if (url.pathname !== "/api/state") return new Response("tokyo-trip", { headers: CORS });
    const code = url.searchParams.get("code") || "";
    if (!/^[A-Za-z0-9]{1,20}$/.test(code)) return new Response("bad code", { status: 400, headers: CORS });
    const key = "state:" + code;
    if (req.method === "PUT") {
      const body = await req.text();
      if (body.length > 20000) return new Response("too large", { status: 413, headers: CORS });
      await env.TRIP.put(key, body);
      return new Response("ok", { headers: CORS });
    }
    const v = (await env.TRIP.get(key)) || "{}";
    return new Response(v, { headers: { ...CORS, "Content-Type": "application/json" } });
  },
};
