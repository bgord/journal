import * as bg from "@bgord/bun";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import * as infra from "+infra";
import { Logger } from "+infra/adapters/logger.adapter";
import { db } from "+infra/db";
import { prerequisites } from "+infra/prerequisites";
import { handleSsr } from "./fullstack/entry-server";
import { Env } from "./infra/env";
import { server, startup } from "./server";

const serveAsset = (req: Request) => {
  const url = new URL(req.url);

  const file = Bun.file(new URL(`./public${url.pathname}`, import.meta.url));

  return file.size
    ? new Response(file, { headers: { "Cache-Control": "no-store" } })
    : new Response("Not Found", { status: 404 });
};

(async function main() {
  await new bg.Prerequisites(Logger).check(prerequisites);

  migrate(db, { migrationsFolder: "infra/drizzle" });

  const app = Bun.serve({
    maxRequestBodySize: infra.BODY_LIMIT_MAX_SIZE,
    idleTimeout: infra.IDLE_TIMEOUT,
    routes: {
      "/assets/*": serveAsset,
      "/api/*": server.fetch,
      "/*": (request) => handleSsr(request),
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
