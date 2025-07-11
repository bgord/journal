import { describe, expect, jest, spyOn, test } from "bun:test";
import { EventStore } from "../infra/event-store";
import * as Emotions from "../modules/emotions";
import { server } from "../server";
import * as mocks from "./mocks";

const url = `/entry/${mocks.entryId}/delete`;

describe("DELETE /entry/:id/delete", () => {
  test("validation - incorrect id", async () => {
    const response = await server.request("/entry/id/delete", { method: "DELETE" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - EntryHasBeenStarted", async () => {
    const entryBuild = spyOn(Emotions.Aggregates.Entry, "build");
    const entryDelete = spyOn(Emotions.Aggregates.Entry.prototype, "delete");

    const eventStoreFind = spyOn(EventStore, "find").mockResolvedValue([]);

    const response = await server.request(url, { method: "DELETE" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(Emotions.Policies.EntryHasBenStarted.code);
    expect(json).toEqual({
      message: Emotions.Policies.EntryHasBenStarted.message,
      _known: true,
    });
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.Entry.events,
      Emotions.Aggregates.Entry.getStream(mocks.entryId),
    );
    expect(entryBuild).toHaveBeenCalledWith(mocks.entryId, []);
    expect(entryDelete).toHaveBeenCalledWith();
  });

  test("happy path - after situation", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    const entryBuild = spyOn(Emotions.Aggregates.Entry, "build");

    const entryDelete = spyOn(Emotions.Aggregates.Entry.prototype, "delete");

    const history = [mocks.GenericSituationLoggedEvent];

    const eventStoreFind = spyOn(EventStore, "find").mockResolvedValue(history);

    const response = await server.request(
      url,
      {
        method: "DELETE",
        headers: new Headers({ "x-correlation-id": mocks.correlationId }),
      },
      mocks.ip,
    );

    expect(response.status).toBe(200);
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.Entry.events,
      Emotions.Aggregates.Entry.getStream(mocks.entryId),
    );
    expect(entryBuild).toHaveBeenCalledWith(mocks.entryId, history);
    expect(entryDelete).toHaveBeenCalledWith();

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryDeletedEvent]);
    jest.restoreAllMocks();
  });

  test("happy path - after emotion", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    const entryBuild = spyOn(Emotions.Aggregates.Entry, "build");

    const entryDelete = spyOn(Emotions.Aggregates.Entry.prototype, "delete");

    const history = [mocks.GenericSituationLoggedEvent, mocks.GenericEmotionLoggedEvent];

    const eventStoreFind = spyOn(EventStore, "find").mockResolvedValue(history);

    const response = await server.request(
      url,
      {
        method: "DELETE",
        headers: new Headers({ "x-correlation-id": mocks.correlationId }),
      },
      mocks.ip,
    );

    expect(response.status).toBe(200);
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.Entry.events,
      Emotions.Aggregates.Entry.getStream(mocks.entryId),
    );
    expect(entryBuild).toHaveBeenCalledWith(mocks.entryId, history);
    expect(entryDelete).toHaveBeenCalledWith();

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryDeletedEvent]);
    jest.restoreAllMocks();
  });

  test("happy path - after reaction", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    const entryBuild = spyOn(Emotions.Aggregates.Entry, "build");

    const entryDelete = spyOn(Emotions.Aggregates.Entry.prototype, "delete");

    const history = [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ];

    const eventStoreFind = spyOn(EventStore, "find").mockResolvedValue(history);

    const response = await server.request(
      url,
      {
        method: "DELETE",
        headers: new Headers({ "x-correlation-id": mocks.correlationId }),
      },
      mocks.ip,
    );

    expect(response.status).toBe(200);
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.Entry.events,
      Emotions.Aggregates.Entry.getStream(mocks.entryId),
    );
    expect(entryBuild).toHaveBeenCalledWith(mocks.entryId, history);
    expect(entryDelete).toHaveBeenCalledWith();

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryDeletedEvent]);
    jest.restoreAllMocks();
  });
});
