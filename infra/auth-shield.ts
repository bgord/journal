import * as bg from "@bgord/bun";
import hono from "hono";
import { createMiddleware } from "hono/factory";

import { auth } from "./auth";

export class Shield {
  cors = {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    allowHeaders: ["Content-Type"],
    exposeHeaders: ["Set-Cookie"],
  };

  constructor(private readonly Auth: typeof auth) {}

  read = createMiddleware(async (c: hono.Context, next: hono.Next) => {
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
    const user = c.get("user");

    if (!user) {
      throw bg.AccessDeniedAuthShieldError;
    }

    return next();
  });

  reverse = createMiddleware(async (c: hono.Context, next: hono.Next) => {
    const user = c.get("user");

    if (user) {
      throw bg.AccessDeniedAuthShieldError;
    }

    return next();
  });
}

export const AuthShield = new Shield(auth);
