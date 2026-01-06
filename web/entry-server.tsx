import type * as bg from "@bgord/bun";
import { createRequestHandler, defaultRenderHandler } from "@tanstack/react-router/ssr/server";
import { createRouter } from "./router";

export async function handler(request: Request, nonce: bg.NonceValueType): Promise<Response> {
  return createRequestHandler({ request, createRouter: () => createRouter({ request, nonce }) })(
    defaultRenderHandler,
  );
}
