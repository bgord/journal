import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { registerSseHandlers } from "+infra/register-sse-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";

const url = "/api/sse";

describe(`GET ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di);
  registerCommandHandlers(di);
  registerSseHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected, _known: true });
  });

  test("happy path - SseRegistry receives ALARM_GENERATED_EVENT from EventBus", async () => {
    using sseRegistryEmit = spyOn(di.Tools.SseRegistry, "emit");

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      di.Tools.EventBus.emit(mocks.GenericAlarmGeneratedEvent),
    );

    const identity = await di.Tools.HashContent.hash(mocks.userId);

    expect(sseRegistryEmit).toHaveBeenCalledWith(identity.get(), mocks.GenericAlarmGeneratedEvent);
  });
});
