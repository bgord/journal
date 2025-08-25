import type hono from "hono";
import type * as infra from "+infra";
import { logger } from "+infra/logger.adapter";

export async function UpdateProfileAvatar(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");

  logger.info({
    message: "Profile avatar payload",
    component: "http",
    operation: "read",
    metadata: { user },
  });

  return new Response();
}
