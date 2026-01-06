import { IdProviderCryptoAdapter } from "@bgord/bun";
import { createRequestHandler, defaultRenderHandler } from "@tanstack/react-router/ssr/server";
import { secureHeaders } from "hono/secure-headers";
import { createRouter } from "./router";

export async function handler(request: Request, nonce: string): Promise<Response> {
  return createRequestHandler({ request, createRouter: () => createRouter({ request, nonce }) })(
    defaultRenderHandler,
  );
}

export function withDocumentSecurity(handler: (request: Request, nonce: string) => Promise<Response>) {
  return async (request: Request): Promise<Response> => {
    // mocked for now
    const nonce = new IdProviderCryptoAdapter().generate().slice(0, 16).replaceAll("-", "0");

    const response = await handler(request, nonce);

    secureHeaders({
      crossOriginResourcePolicy: "same-origin",
      contentSecurityPolicy: {
        defaultSrc: ["'none'"],
        baseUri: ["'none'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],

        scriptSrc: ["'self'", `'nonce-${nonce}'`],
        scriptSrcElem: ["'self'", `'nonce-${nonce}'`],

        styleSrc: ["'self'", `'nonce-${nonce}'`],
        styleSrcAttr: ["'unsafe-inline'"], // <div style={{ width: "200px" }} />

        imgSrc: ["'self'"],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
        formAction: ["'self'"],
      },
    })({ req: request, res: response } as any, () => Promise.resolve());

    return response;
  };
}
