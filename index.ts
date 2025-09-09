import * as bg from "@bgord/bun";
import * as infra from "+infra";
import { Logger } from "+infra/adapters/logger.adapter";
import { Env } from "+infra/env";
import { prerequisites } from "+infra/prerequisites";
import { server, startup } from "./server";

(async function main() {
  await new bg.Prerequisites(Logger).check(prerequisites);

  const app = Bun.serve({
    fetch: server.fetch,
    maxRequestBodySize: infra.BODY_LIMIT_MAX_SIZE,
    idleTimeout: infra.IDLE_TIMEOUT,
  });

  Logger.info({
    message: "Server has started",
    component: "infra",
    operation: "server_startup",
    metadata: { port: Env.PORT, startupTimeMs: startup.stop().durationMs },
  });

  bg.GracefulShutdown.applyTo(app);
})();
