import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/history/${mocks.entryId}/list`;

describe("GET /api/history/:entryId/list", async () => {
  const di = await bootstrap();
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    await testcases.assertAuthResponse(response);
  });

  test("validation - incorrect id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      `/api/history/${"a".repeat(129)}/list`,
      { method: "GET", headers: mocks.revisionHeaders() },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "history.subject.too.long" });
  });

  test("validation - RequesterOwnsEntry", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth));
    spies.use(spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.fullEntry));

    const response = await server.request(url, { method: "GET", headers: mocks.revisionHeaders() }, mocks.ip);

    await testcases.assertInvariantError(response, 403, "requester.owns.entry.error");
  });

  test("validation - RequesterOwnsEntry - missing entry", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(undefined));

    const response = await server.request(url, { method: "GET", headers: mocks.revisionHeaders() }, mocks.ip);

    await testcases.assertInvariantError(response, 403, "requester.owns.entry.error");
  });

  test("happy path", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.fullEntry));
    spies.use(spyOn(di.Adapters.History.HistoryReader, "read").mockResolvedValue([mocks.historyItem]));

    const response = await server.request(url, { method: "GET", headers: mocks.revisionHeaders() }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual([{ ...mocks.historyItem, createdAt: "2025/01/01 00:00" }]);
  });

  test("happy path - empty", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.fullEntry));
    spies.use(spyOn(di.Adapters.History.HistoryReader, "read").mockResolvedValue([]));

    const response = await server.request(url, { method: "GET", headers: mocks.revisionHeaders() }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual([]);
  });
});
