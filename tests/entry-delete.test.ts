import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { auth } from "+infra/auth";
import { EventStore } from "+infra/event-store";
import { server } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/entry/${mocks.entryId}/delete`;

describe("DELETE /entry/:id/delete", () => {
  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "DELETE" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toBe(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("validation - incorrect id", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      "/entry/id/delete",
      { method: "DELETE", headers: mocks.revisionHeaders() },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - EntryHasBeenStarted", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(EventStore, "find").mockResolvedValue([]);

    const response = await server.request(
      url,
      { method: "DELETE", headers: mocks.revisionHeaders() },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, Emotions.Invariants.EntryHasBenStarted);
  });

  test("validation -  RequesterOwnsEntry", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericSituationLoggedEvent]);

    const response = await server.request(
      url,
      { method: "DELETE", headers: mocks.revisionHeaders() },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, Emotions.Invariants.RequesterOwnsEntry);
  });

  test("happy path - after situation", async () => {
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericSituationLoggedEvent]);
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const response = await server.request(
      url,
      {
        method: "DELETE",
        headers: new Headers({ "x-correlation-id": mocks.correlationId, ...mocks.revisionHeaders() }),
      },
      mocks.ip,
    );

    expect(response.status).toBe(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryDeletedEvent]);
  });

  test("happy path - after emotion", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
    ]);
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const response = await server.request(
      url,
      {
        method: "DELETE",
        headers: new Headers({ "x-correlation-id": mocks.correlationId, ...mocks.revisionHeaders() }),
      },
      mocks.ip,
    );

    expect(response.status).toBe(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryDeletedEvent]);
  });

  test("happy path - after reaction", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ]);
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const response = await server.request(
      url,
      {
        method: "DELETE",
        headers: new Headers({ "x-correlation-id": mocks.correlationId, ...mocks.revisionHeaders() }),
      },
      mocks.ip,
    );

    expect(response.status).toBe(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryDeletedEvent]);
  });
});
