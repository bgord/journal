import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/publishing/link/create";

describe(`POST ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.ShieldAuthError.message, _known: true });
  });

  test("validation - empty payload", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST", body: JSON.stringify({}) }, mocks.ip);

    expect(response.status).toEqual(400);
  });

  test("validation - publicationSpecification", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ publicationSpecification: 1 }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "publication.specification.invalid", _known: true });
  });

  test("validation - durationMs", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

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
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

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
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

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
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

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
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Publishing.ShareableLinksQuotaQuery, "execute").mockResolvedValue({
        count: tools.IntegerNonNegative.parse(3),
      }),
    );
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

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

    await testcases.assertInvariantError(response, 403, "ShareableLinksPerOwnerLimit");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.shareableLinkId]);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate()));
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));
    spies.use(
      spyOn(di.Adapters.Publishing.ShareableLinksQuotaQuery, "execute").mockResolvedValue({
        count: tools.IntegerNonNegative.parse(0),
      }),
    );
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

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
