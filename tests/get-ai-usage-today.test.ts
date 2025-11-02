import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Adapters from "+infra/adapters";
import { auth } from "+infra/auth";
import { server } from "../server";
import * as mocks from "./mocks";

const url = "/api/ai-usage-today/get";

describe(`GET ${url}`, () => {
  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("happy path", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Adapters.AI.RuleInspector, "inspect").mockResolvedValue(mocks.ruleInspection);

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual(mocks.ruleInspection);
  });
});
