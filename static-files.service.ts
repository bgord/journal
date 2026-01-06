import { type Context, Hono } from "hono";
import { serveStatic } from "hono/bun";
import { etag } from "hono/etag";
import { secureHeaders } from "hono/secure-headers";

const staticAssetHeaders = secureHeaders({
  crossOriginResourcePolicy: "same-origin",
  crossOriginOpenerPolicy: "same-origin",
  crossOriginEmbedderPolicy: "require-corp",
  referrerPolicy: "no-referrer",
  xContentTypeOptions: "nosniff",
});

const staticDocumentHeaders = secureHeaders({
  crossOriginResourcePolicy: "same-origin",
  contentSecurityPolicy: {
    defaultSrc: ["'none'"],
    baseUri: ["'none'"],
    objectSrc: ["'none'"],
    frameAncestors: ["'none'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'"],
    fontSrc: ["'self'"],
    connectSrc: ["'self'"],
    formAction: ["'self'"],
  },
});

type StaticFilesStrategy = (path: string, context: Context) => Promise<void> | void;

export class StaticFiles {
  static handle(path: string, strategy: StaticFilesStrategy) {
    return {
      [path]: new Hono().use(
        path,
        async (c, next) => {
          await next();

          const contentType = c.res.headers.get("Content-Type") ?? "";

          if (contentType.startsWith("text/html")) {
            staticDocumentHeaders(c, () => Promise.resolve());
          } else {
            staticAssetHeaders(c, () => Promise.resolve());
          }
        },
        etag(),
        serveStatic({ root: "./", precompressed: true, onFound: strategy }),
      ).fetch,
    };
  }
}
