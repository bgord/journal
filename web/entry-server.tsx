import type * as bg from "@bgord/bun";
import { createRequestHandler, defaultRenderHandler } from "@tanstack/react-router/ssr/server";
import { secureHeaders } from "hono/secure-headers";
import { createRouter } from "./router";

type Dependencies = { NonceProvider: bg.NonceProviderPort };

export function withDocumentSecurity(
  handler: (request: Request, nonce: bg.NonceValueType) => Promise<Response>,
  deps: Dependencies,
) {
  return async (request: Request): Promise<Response> => {
    const nonce = deps.NonceProvider.generate();

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

export async function handler(request: Request, nonce: bg.NonceValueType): Promise<Response> {
  return createRequestHandler({ request, createRouter: () => createRouter({ request, nonce }) })(
    defaultRenderHandler,
  );
}
