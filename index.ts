import * as bg from "@bgord/bun";
import * as infra from "./infra";
import { server, startup } from "./server";

(async function main() {
  await bg.Prerequisites.check(infra.prerequisites);

  const app = Bun.serve({
    fetch: server.fetch,
    maxRequestBodySize: infra.BODY_LIMIT_MAX_SIZE,
  });

  infra.logger.info({
    message: "Server has started",
    operation: "server_startup",
    metadata: {
      port: infra.Env.PORT,
      startupTimeMs: startup.stop().durationMs,
    },
  });

  bg.GracefulShutdown.applyTo(app);
})();
