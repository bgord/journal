import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { Clock } from "+infra/adapters/clock.adapter";
import { Logger } from "+infra/adapters/logger.adapter";
import { db } from "+infra/db";
import { Env } from "+infra/env";
import { prerequisites } from "+infra/prerequisites";
import { server } from "./server";
import { handler } from "./web/entry-server";

const deps = { Logger: Logger, Clock: Clock };

(async function main() {
  await new bg.Prerequisites(deps).check(prerequisites);
  migrate(db, { migrationsFolder: "infra/drizzle" });

  const app = Bun.serve({
    maxRequestBodySize: tools.Size.fromKb(128).toBytes(),
    idleTimeout: tools.Duration.Seconds(10).seconds,
    routes: {
      "/favicon.ico": Bun.file("public/favicon.ico"),
      ...bg.StaticFiles.handle(
        "/public/*",
        Env.type === bg.NodeEnvironmentEnum.production
          ? bg.StaticFileStrategyMustRevalidate(tools.Duration.Minutes(5))
          : bg.StaticFileStrategyNoop,
      ),
      "/api/*": server.fetch,
      "/*": handler,
    },
  });

  Logger.info({
    message: "Server has started",
    component: "infra",
    operation: "server_startup",
    metadata: { port: Env.PORT },
  });

  new bg.GracefulShutdown(deps).applyTo(app);
})();
