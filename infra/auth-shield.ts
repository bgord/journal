import hono from "hono";
import { createMiddleware } from "hono/factory";

import { auth } from "./auth";

export class AuthShield {
  static cors = {
    origin: "http://localhost:5173",
    credentials: true,
    allowHeaders: ["Content-Type"],
    exposeHeaders: ["Set-Cookie"],
  };

  constructor(private readonly Auth: typeof auth) {}

  apply = createMiddleware(async (c: hono.Context, next: hono.Next) => {
    const session = await this.Auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  });

  verify = createMiddleware(async (c: hono.Context, next: hono.Next) => {
    const session = await this.Auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  });
}
