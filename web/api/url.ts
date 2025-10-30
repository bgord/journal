export function absoluteUrl(path: string, request: Request | null): string | URL {
  if (!request) return path;

  const u = new URL(request.url);

  // Honor reverse-proxy headers (HTTPS at the edge, HTTP to Bun)
  const xfproto = request.headers.get("x-forwarded-proto");
  if (xfproto === "https" && u.protocol !== "https:") {
    u.protocol = "https:";
  }

  // Also honor the RFC 7239 Forwarded header if present
  const fwd = request.headers.get("forwarded");
  if (fwd && /proto=https/i.test(fwd)) {
    u.protocol = "https:";
  }

  // Build absolute URL for the target path
  // (avoid .origin because some proxies might rewrite ports)
  u.pathname = path;
  u.search = "";
  u.hash = "";
  return u;
}
