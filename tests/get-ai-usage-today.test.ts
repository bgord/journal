import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as AI from "+ai";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";

const url = "/api/ai-usage-today/get";

describe(`GET ${url}`, async () => {
  const di = await bootstrap();
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected, _known: true });
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using ruleInspectorInspect = spyOn(di.Adapters.AI.RuleInspector, "inspect").mockResolvedValue(
      mocks.ruleInspection,
    );

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual(mocks.ruleInspection);
    expect(ruleInspectorInspect).toHaveBeenCalledWith(AI.USER_DAILY_RULE, mocks.AiUsageContext);
  });
});
