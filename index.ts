import * as bg from "@bgord/bun";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import * as infra from "+infra";
import { Logger } from "+infra/adapters/logger.adapter";
import { db } from "+infra/db";
import { Env } from "+infra/env";
import { prerequisites } from "+infra/prerequisites";
import { handler } from "./fullstack/entry-server";
import forgotPasswordHtml from "./fullstack/pages/forgot-password.html";
import loginHtml from "./fullstack/pages/login.html";
import registerHtml from "./fullstack/pages/register.html";
import resetPassword from "./fullstack/pages/reset-password.html";
import { server, startup } from "./server";

(async function main() {
  await new bg.Prerequisites(Logger).check(prerequisites);
  migrate(db, { migrationsFolder: "infra/drizzle" });

  const app = Bun.serve({
    maxRequestBodySize: infra.BODY_LIMIT_MAX_SIZE,
    idleTimeout: infra.IDLE_TIMEOUT,
    routes: {
      "/favicon.ico": Bun.file("public/favicon.ico"),
      "/login": loginHtml,
      "/register": registerHtml,
      "/forgot-password": forgotPasswordHtml,
      "/reset-password": resetPassword,
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
