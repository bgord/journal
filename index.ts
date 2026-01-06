import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { bootstrap } from "+infra/bootstrap";
import { db } from "+infra/db";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "./server";
import { handler } from "./web/entry-server";

(async function main() {
  const di = await bootstrap();
  const server = createServer(di);

  await new bg.PrerequisiteRunnerStartup(di.Adapters.System).check(di.Tools.Prerequisites);
  migrate(db, { migrationsFolder: "infra/drizzle" });

  registerEventHandlers(di);
  registerCommandHandlers(di);

  const app = Bun.serve({
    port: di.Env.PORT,
    maxRequestBodySize: tools.Size.fromKb(128).toBytes(),
    idleTimeout: tools.Duration.Seconds(10).seconds,
    routes: {
      "/favicon.ico": Bun.file("public/favicon.ico"),
      "/robots.txt": Bun.file("public/robots.txt"),
      ...bg.StaticFiles.handle(
        "/public/*",
        di.Env.type === bg.NodeEnvironmentEnum.production
          ? bg.StaticFileStrategyMustRevalidate(tools.Duration.Minutes(5))
          : bg.StaticFileStrategyNoop,
      ),
      "/api/*": server.fetch,
      "/*": bg.SSR.essentials(handler, di.Adapters.System),
    },
  });

  new bg.GracefulShutdown(di.Adapters.System).applyTo(app);

  di.Adapters.System.Logger.info({
    message: "Server has started",
    component: "infra",
    operation: "server_startup",
    metadata: { port: di.Env.PORT },
  });
})();
