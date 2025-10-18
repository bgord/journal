import { createRequestHandler, defaultRenderHandler } from "@tanstack/react-router/ssr/server";
import { createRouter } from "./router";

export async function handleSsr(request: Request): Promise<Response> {
  const handler = createRequestHandler({ request, createRouter: () => createRouter({ request }) });

  return handler(defaultRenderHandler);
}
