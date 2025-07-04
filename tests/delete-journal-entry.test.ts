import { describe, expect, jest, spyOn, test } from "bun:test";
import * as infra from "../infra";
import * as Emotions from "../modules/emotions";
import { server } from "../server";
import * as mocks from "./mocks";

const url = `/emotions/${mocks.emotionJournalEntryId}/delete`;

describe("DELETE /emotions/:id/delete", () => {
  test("validation - incorrect id", async () => {
    const response = await server.request("/emotions/id/delete", { method: "DELETE" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - EntryHasBeenStarted", async () => {
    const emotionJournalEntryBuild = spyOn(Emotions.Aggregates.EmotionJournalEntry, "build");

    const emotionJournalEntryDelete = spyOn(Emotions.Aggregates.EmotionJournalEntry.prototype, "delete");

    const history = [];

    const eventStoreFind = spyOn(infra.EventStore, "find").mockResolvedValue(history);

    const response = await server.request(url, { method: "DELETE" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(Emotions.Policies.EntryHasBenStarted.code);
    expect(json).toEqual({
      message: Emotions.Policies.EntryHasBenStarted.message,
      _known: true,
    });
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.EmotionJournalEntry.events,
      Emotions.Aggregates.EmotionJournalEntry.getStream(mocks.emotionJournalEntryId),
    );
    expect(emotionJournalEntryBuild).toHaveBeenCalledWith(mocks.emotionJournalEntryId, history);
    expect(emotionJournalEntryDelete).toHaveBeenCalledWith();
  });

  test("happy path - after situation", async () => {
    const eventStoreSave = spyOn(infra.EventStore, "save").mockImplementation(jest.fn());
    const emotionJournalEntryBuild = spyOn(Emotions.Aggregates.EmotionJournalEntry, "build");

    const emotionJournalEntryDelete = spyOn(Emotions.Aggregates.EmotionJournalEntry.prototype, "delete");

    const history = [mocks.GenericSituationLoggedEvent];

    const eventStoreFind = spyOn(infra.EventStore, "find").mockResolvedValue(history);

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
      Emotions.Aggregates.EmotionJournalEntry.events,
      Emotions.Aggregates.EmotionJournalEntry.getStream(mocks.emotionJournalEntryId),
    );
    expect(emotionJournalEntryBuild).toHaveBeenCalledWith(mocks.emotionJournalEntryId, history);
    expect(emotionJournalEntryDelete).toHaveBeenCalledWith();

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEmotionJournalEntryDeletedEvent]);
    jest.restoreAllMocks();
  });

  test("happy path - after emotion", async () => {
    const eventStoreSave = spyOn(infra.EventStore, "save").mockImplementation(jest.fn());
    const emotionJournalEntryBuild = spyOn(Emotions.Aggregates.EmotionJournalEntry, "build");

    const emotionJournalEntryDelete = spyOn(Emotions.Aggregates.EmotionJournalEntry.prototype, "delete");

    const history = [mocks.GenericSituationLoggedEvent, mocks.GenericEmotionLoggedEvent];

    const eventStoreFind = spyOn(infra.EventStore, "find").mockResolvedValue(history);

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
      Emotions.Aggregates.EmotionJournalEntry.events,
      Emotions.Aggregates.EmotionJournalEntry.getStream(mocks.emotionJournalEntryId),
    );
    expect(emotionJournalEntryBuild).toHaveBeenCalledWith(mocks.emotionJournalEntryId, history);
    expect(emotionJournalEntryDelete).toHaveBeenCalledWith();

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEmotionJournalEntryDeletedEvent]);
    jest.restoreAllMocks();
  });

  test("happy path - after reaction", async () => {
    const eventStoreSave = spyOn(infra.EventStore, "save").mockImplementation(jest.fn());
    const emotionJournalEntryBuild = spyOn(Emotions.Aggregates.EmotionJournalEntry, "build");

    const emotionJournalEntryDelete = spyOn(Emotions.Aggregates.EmotionJournalEntry.prototype, "delete");

    const history = [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ];

    const eventStoreFind = spyOn(infra.EventStore, "find").mockResolvedValue(history);

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
      Emotions.Aggregates.EmotionJournalEntry.events,
      Emotions.Aggregates.EmotionJournalEntry.getStream(mocks.emotionJournalEntryId),
    );
    expect(emotionJournalEntryBuild).toHaveBeenCalledWith(mocks.emotionJournalEntryId, history);
    expect(emotionJournalEntryDelete).toHaveBeenCalledWith();

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEmotionJournalEntryDeletedEvent]);
    jest.restoreAllMocks();
  });
});
