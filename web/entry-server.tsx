import { createRequestHandler, defaultRenderHandler } from "@tanstack/react-router/ssr/server";
import { createRouter } from "./router";

export async function handler(request: Request): Promise<Response> {
  return createRequestHandler({ request, createRouter: () => createRouter({ request }) })(
    defaultRenderHandler,
  );
}
