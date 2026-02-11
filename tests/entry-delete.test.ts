import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/entry/${mocks.entryId}/delete`;

describe(`DELETE ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "DELETE" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.ShieldAuthError.message, _known: true });
  });

  test("validation - incorrect id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      "/api/entry/id/delete",
      { method: "DELETE", headers: mocks.revisionHeaders() },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - EntryHasBeenStarted", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Tools.EventStore, "find").mockResolvedValue([]));

    const response = await server.request(
      url,
      { method: "DELETE", headers: mocks.revisionHeaders() },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "entry.has.been.started");
  });

  test("validation -  RequesterOwnsEntry", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth));
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));
    spies.use(spyOn(di.Tools.EventStore, "find").mockResolvedValue([mocks.GenericSituationLoggedEvent]));

    const response = await server.request(
      url,
      { method: "DELETE", headers: mocks.revisionHeaders() },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "requester.owns.entry.error");
  });

  test("happy path - after situation", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Tools.EventStore, "find").mockResolvedValue([mocks.GenericSituationLoggedEvent]));
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));

    const response = await server.request(
      url,
      { method: "DELETE", headers: mocks.correlationIdAndRevisionHeaders() },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryDeletedEvent]);
  });

  test("happy path - after emotion", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Tools.EventStore, "find").mockResolvedValue([
        mocks.GenericSituationLoggedEvent,
        mocks.GenericEmotionLoggedEvent,
      ]),
    );
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));

    const response = await server.request(
      url,
      { method: "DELETE", headers: mocks.correlationIdAndRevisionHeaders() },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryDeletedEvent]);
  });

  test("happy path - after reaction", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Tools.EventStore, "find").mockResolvedValue([
        mocks.GenericSituationLoggedEvent,
        mocks.GenericEmotionLoggedEvent,
        mocks.GenericReactionLoggedEvent,
      ]),
    );
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));

    const response = await server.request(
      url,
      { method: "DELETE", headers: mocks.correlationIdAndRevisionHeaders() },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryDeletedEvent]);
  });
});
