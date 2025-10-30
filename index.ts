import * as bg from "@bgord/bun";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import * as infra from "+infra";
import { Logger } from "+infra/adapters/logger.adapter";
import { db } from "+infra/db";
import { Env } from "+infra/env";
import { prerequisites } from "+infra/prerequisites";
import { server, startup } from "./server";
import { handler } from "./web/entry-server";

(async function main() {
  await new bg.Prerequisites(Logger).check(prerequisites);
  migrate(db, { migrationsFolder: "infra/drizzle" });

  const app = Bun.serve({
    maxRequestBodySize: infra.BODY_LIMIT_MAX_SIZE,
    idleTimeout: infra.IDLE_TIMEOUT,
    routes: {
      "/favicon.ico": Bun.file("public/favicon.ico"),
      "/public/*": new Hono().use("/public/*", serveStatic({ root: "./" })).fetch,
      // "/auth/login": Bun.file("public/login.html"),
      // "/auth/register": Bun.file("public/register.html"),
      // "/auth/forgot-password": Bun.file("public/forgot-password.html"),
      // "/auth/reset-password": Bun.file("public/reset-password.html"),
      "/api/*": server.fetch,
      "/*": handler,
    },
  });

  Logger.info({
    message: "Server has started",
    component: "infra",
    operation: "server_startup",
    metadata: { port: Env.PORT, startupTimeMs: startup.stop().ms },
  });

  new bg.GracefulShutdown(Logger).applyTo(app);
})();
