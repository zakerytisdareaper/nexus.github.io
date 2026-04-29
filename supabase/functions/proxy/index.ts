// Server-side proxy that strips X-Frame-Options / CSP frame-ancestors so
// sites like YouTube, DuckDuckGo, Reddit, Twitch etc. can be embedded.
// Usage: GET /functions/v1/proxy?url=<encoded-url>

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const HOP = new Set([
  "content-security-policy",
  "content-security-policy-report-only",
  "x-frame-options",
  "frame-options",
  "strict-transport-security",
  "cross-origin-opener-policy",
  "cross-origin-embedder-policy",
  "cross-origin-resource-policy",
  "permissions-policy",
  "report-to",
  "set-cookie",
]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const u = new URL(req.url);
  const target = u.searchParams.get("url");
  if (!target) {
    return new Response("Missing url", { status: 400, headers: corsHeaders });
  }

  let parsed: URL;
  try { parsed = new URL(target); } catch {
    return new Response("Bad url", { status: 400, headers: corsHeaders });
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    return new Response("Unsupported protocol", { status: 400, headers: corsHeaders });
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept": req.headers.get("accept") ?? "*/*",
        "Accept-Language": req.headers.get("accept-language") ?? "en-US,en;q=0.9",
      },
    });

    const headers = new Headers();
    upstream.headers.forEach((v, k) => {
      if (!HOP.has(k.toLowerCase())) headers.set(k, v);
    });
    Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v));
    headers.delete("x-frame-options");
    headers.delete("content-security-policy");

    const ctype = (upstream.headers.get("content-type") ?? "").toLowerCase();

    // Rewrite HTML so relative links continue to work and sub-resources route through us
    if (ctype.includes("text/html")) {
      let html = await upstream.text();
      const base = parsed.origin;
      const proxyBase = `${u.origin}${u.pathname}?url=`;

      // Inject <base> so relative URLs resolve against the original origin
      if (!/<base\s/i.test(html)) {
        html = html.replace(/<head[^>]*>/i, (m) => `${m}<base href="${base}/">`);
      }

      // Rewrite absolute http(s) links in href/src/action to go through proxy
      html = html.replace(
        /(href|src|action)=("|')(https?:\/\/[^"']+)("|')/gi,
        (_m, attr, q, link) => `${attr}=${q}${proxyBase}${encodeURIComponent(link)}${q}`
      );

      headers.set("content-type", "text/html; charset=utf-8");
      return new Response(html, { status: upstream.status, headers });
    }

    return new Response(upstream.body, { status: upstream.status, headers });
  } catch (e) {
    console.error("proxy error", e);
    return new Response(`Proxy error: ${e instanceof Error ? e.message : "unknown"}`, {
      status: 502,
      headers: corsHeaders,
    });
  }
});
