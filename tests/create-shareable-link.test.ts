import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Publishing from "+publishing";
import { bootstrap } from "+infra/bootstrap";
import { EnvironmentLoader } from "+infra/env";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/publishing/link/create";

describe(`POST ${url}`, async () => {
  const di = await bootstrap(await EnvironmentLoader.load());
  registerEventHandlers(di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("validation - empty payload", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST" }, mocks.ip);
    expect(response.status).toEqual(400);
  });

  test("validation - publicationSpecification", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ publicationSpecification: 1 }) },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: Publishing.VO.PublicationSpecificationErrors.invalid, _known: true });
  });

  test("validation - durationMs", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ publicationSpecification: "entries", durationMs: "ok" }) },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - dateRangeStart", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ publicationSpecification: "entries", durationMs: 1000, dateRangeStart: "ok" }),
      },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - dateRangeEnd", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          publicationSpecification: "entries",
          durationMs: 1000,
          dateRangeStart: 0,
          dateRangeEnd: "ok",
        }),
      },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - dateRange", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          publicationSpecification: "entries",
          durationMs: 1000,
          dateRangeStart: mocks.dateRangeStart,
          dateRangeEnd: "2000-01-01",
        }),
      },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "invalid.date.range", _known: true });
  });

  test("validation - ShareableLinksPerOwnerLimit", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(di.Adapters.Publishing.ShareableLinksQuotaQuery, "execute").mockResolvedValue({ count: 50 });
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          publicationSpecification: "entries",
          durationMs: 1000,
          dateRangeStart: mocks.dateRangeStart,
          dateRangeEnd: mocks.dateRangeEnd,
        }),
        headers: mocks.correlationIdHeaders,
      },
      mocks.ip,
    );
    await testcases.assertInvariantError(response, Publishing.Invariants.ShareableLinksPerOwnerLimit);

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.shareableLinkId]);
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(di.Adapters.Publishing.ShareableLinksQuotaQuery, "execute").mockResolvedValue({ count: 0 });
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          publicationSpecification: "entries",
          durationMs: 1000,
          dateRangeStart: mocks.dateRangeStart,
          dateRangeEnd: mocks.dateRangeEnd,
        }),
        headers: mocks.correlationIdHeaders,
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkCreatedEvent]);
  });
});
