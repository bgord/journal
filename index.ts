import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { ApiClient } from "@bgord/ui";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { bootstrap } from "+infra/bootstrap";
import { db } from "+infra/db";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerCronTasks } from "+infra/register-cron-tasks";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { registerSseHandlers } from "+infra/register-sse-handlers";
import { createServer } from "./server";
import { handler } from "./web/entry-server";

void (async function main() {
  const di = await bootstrap();
  const server = createServer(di);

  migrate(db, { migrationsFolder: "infra/drizzle" });

  registerEventHandlers(di);
  registerCommandHandlers(di);
  registerSseHandlers(di);
  registerCronTasks(di);

  await new bg.PrerequisiteRunnerStartup(di.Adapters.System).check(di.Tools.Prerequisites.healthcheck);

  const app = Bun.serve({
    port: di.Env.PORT,
    maxRequestBodySize: tools.Size.fromMB(12).toBytes(),
    idleTimeout: tools.Duration.Seconds(120).seconds,
    routes: {
      "/favicon.ico": Bun.file("public/favicon.ico"),
      "/robots.txt": Bun.file("public/robots.txt"),
      ...bg.StaticFilesHono.handle(
        "/public/*",
        di.Env.type === bg.NodeEnvironmentEnum.production
          ? new bg.CacheControlImmutableStrategy(
              new bg.CacheControlMustRevalidateStrategy(tools.Duration.Minutes(5)),
            )
          : new bg.CacheControlNoopStrategy(),
      ),
      "/api/*": server.fetch,
      "/*": bg.SSRBun.essentials(
        (request, nonce) => handler(request, nonce, String(di.Tools.CommitConfig.get())),
        di.Adapters.System,
      ),
    },
  });

  ApiClient.useServer((request) => server.fetch(request, app));

  new bg.GracefulShutdown(di.Adapters.System).applyTo(app);

  di.Adapters.System.Logger.info({
    message: "Server has started",
    component: "infra",
    operation: "server_startup",
    metadata: { port: di.Env.PORT },
  });
})();
