import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/publishing/link/${mocks.shareableLinkId}/revoke`;

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

  test("validation - incorrect id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      "/api/publishing/link/id/revoke",
      { method: "POST", headers: mocks.revisionHeaders() },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - ShareableLinkIsActive - already expired", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Tools.EventStore, "find").mockResolvedValue([
        mocks.GenericShareableLinkCreatedEvent,
        mocks.GenericShareableLinkExpiredEvent,
      ]),
    );

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(2) },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "shareable.link.is.active.error");
  });

  test("validation - ShareableLinkIsActive - already revoked", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Tools.EventStore, "find").mockResolvedValue([
        mocks.GenericShareableLinkCreatedEvent,
        mocks.GenericShareableLinkRevokedEvent,
      ]),
    );

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(2) },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "shareable.link.is.active.error");
  });

  test("validation - RequesterOwnsShareableLink", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth));
    spies.use(spyOn(di.Tools.EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]));

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(1) },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "requester.owns.shareable.link");
  });

  test("happy path", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Tools.EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]));
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.correlationIdAndRevisionHeaders(),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkRevokedEvent]);
  });
});
