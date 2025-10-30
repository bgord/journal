export function absoluteUrl(path: string, request: Request | null): string | URL {
  if (!request) return path;

  const url = new URL(request.url);

  const proto = request.headers.get("x-forwarded-proto");

  if (proto === "https" && url.protocol !== "https:") {
    url.protocol = "https:";
  }

  const forwarded = request.headers.get("forwarded");

  if (forwarded && /proto=https/i.test(forwarded)) {
    url.protocol = "https:";
  }

  url.pathname = path;
  url.search = "";
  url.hash = "";

  return url;
}
