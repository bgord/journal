import { createRequestHandler, defaultRenderHandler } from "@tanstack/react-router/ssr/server";
import { getSession } from "./auth.server";
import { createRouter } from "./router";

export async function handleSsr(request: Request): Promise<Response> {
  const { json } = await getSession(request);
  const user = json?.user ?? null;

  const handler = createRequestHandler({ request, createRouter: () => createRouter({ user }) });

  return handler(defaultRenderHandler);
}
