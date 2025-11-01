import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { type Context, Hono } from "hono";
import { serveStatic } from "hono/bun";
import { etag } from "hono/etag";
import * as infra from "+infra";
import { Logger } from "+infra/adapters/logger.adapter";
import { db } from "+infra/db";
import { Env } from "+infra/env";
import { prerequisites } from "+infra/prerequisites";
import { server, startup } from "./server";
import { handler } from "./web/entry-server";

type StaticFilesStrategy = (path: string, context: Context) => Promise<void> | void;

const StaticFileStrategyNoop: StaticFilesStrategy = () => {};

const StaticFileStrategyMustRevalidate: StaticFilesStrategy = (_path, c) => {
  c.header("Cache-Control", `public, max-age=${tools.Duration.Minutes(5).ms}, must-revalidate`);
};

export class StaticFiles {
  static handle(path: string, strategy: StaticFilesStrategy) {
    return {
      [path]: new Hono().use(
        path,
        etag(),
        serveStatic({
          root: "./",
          precompressed: true,
          onFound: strategy,
        }),
      ).fetch,
    };
  }
}

(async function main() {
  await new bg.Prerequisites(Logger).check(prerequisites);
  migrate(db, { migrationsFolder: "infra/drizzle" });

  const app = Bun.serve({
    maxRequestBodySize: infra.BODY_LIMIT_MAX_SIZE,
    idleTimeout: infra.IDLE_TIMEOUT,
    routes: {
      "/favicon.ico": Bun.file("public/favicon.ico"),
      ...StaticFiles.handle(
        "/public/*",
        Env.type === bg.NodeEnvironmentEnum.production
          ? StaticFileStrategyMustRevalidate
          : StaticFileStrategyNoop,
      ),
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
