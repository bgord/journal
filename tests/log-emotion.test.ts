import { describe, expect, jest, spyOn, test } from "bun:test";
import * as infra from "../infra";
import * as Emotions from "../modules/emotions";
import { server } from "../server";
import * as mocks from "./mocks";

describe("POST /emotions/:id/log-emotion", () => {
  test("validation - empty payload", async () => {
    const response = await server.request(
      `/emotions/${mocks.emotionJournalEntryId}/log-emotion`,
      { method: "POST" },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      message: Emotions.VO.EmotionLabel.Errors.invalid,
      _known: true,
    });
  });

  test("validation - missing intensity", async () => {
    const response = await server.request(
      `/emotions/${mocks.emotionJournalEntryId}/log-emotion`,
      {
        method: "POST",
        body: JSON.stringify({
          label: Emotions.VO.GenevaWheelEmotion.admiration,
        }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      message: Emotions.VO.EmotionIntensity.Errors.min_max,
      _known: true,
    });
  });

  test("validation - incorrect id", async () => {
    const response = await server.request(
      "/emotions/id/log-emotion",
      {
        method: "POST",
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - EntryIsActionable", async () => {
    const emotionJournalEntryBuild = spyOn(Emotions.Aggregates.EmotionJournalEntry, "build");

    const history = [mocks.GenericSituationLoggedEvent, mocks.GenericEmotionJournalEntryDeletedEvent];

    const eventStoreFind = spyOn(infra.EventStore, "find").mockResolvedValue(history);

    const response = await server.request(
      `/emotions/${mocks.emotionJournalEntryId}/log-emotion`,
      {
        method: "POST",
        body: JSON.stringify({
          label: Emotions.VO.GenevaWheelEmotion.admiration,
          intensity: 4,
        }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(Emotions.Policies.EntryIsActionable.code);
    expect(json).toEqual({
      message: Emotions.Policies.EntryIsActionable.message,
      _known: true,
    });
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.EmotionJournalEntry.events,
      Emotions.Aggregates.EmotionJournalEntry.getStream(mocks.emotionJournalEntryId),
    );
    expect(emotionJournalEntryBuild).toHaveBeenCalledWith(mocks.emotionJournalEntryId, history);
  });

  test("validation - EmotionCorrespondsToSituation", async () => {
    const emotionJournalEntryBuild = spyOn(Emotions.Aggregates.EmotionJournalEntry, "build");

    const history = [];

    const eventStoreFind = spyOn(infra.EventStore, "find").mockResolvedValue(history);

    const response = await server.request(
      `/emotions/${mocks.emotionJournalEntryId}/log-emotion`,
      {
        method: "POST",
        body: JSON.stringify({
          label: Emotions.VO.GenevaWheelEmotion.admiration,
          intensity: 4,
        }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(Emotions.Policies.EmotionCorrespondsToSituation.code);
    expect(json).toEqual({
      message: Emotions.Policies.EmotionCorrespondsToSituation.message,
      _known: true,
    });
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.EmotionJournalEntry.events,
      Emotions.Aggregates.EmotionJournalEntry.getStream(mocks.emotionJournalEntryId),
    );
    expect(emotionJournalEntryBuild).toHaveBeenCalledWith(mocks.emotionJournalEntryId, history);
  });

  test("validation - OneEmotionPerEntry", async () => {
    const emotionJournalEntryBuild = spyOn(Emotions.Aggregates.EmotionJournalEntry, "build");

    const history = [mocks.GenericSituationLoggedEvent, mocks.GenericEmotionLoggedEvent];

    const eventStoreFind = spyOn(infra.EventStore, "find").mockResolvedValue(history);

    const response = await server.request(
      `/emotions/${mocks.emotionJournalEntryId}/log-emotion`,
      {
        method: "POST",
        body: JSON.stringify({
          label: Emotions.VO.GenevaWheelEmotion.admiration,
          intensity: 4,
        }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(Emotions.Policies.OneEmotionPerEntry.code);
    expect(json).toEqual({
      message: Emotions.Policies.OneEmotionPerEntry.message,
      _known: true,
    });
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.EmotionJournalEntry.events,
      Emotions.Aggregates.EmotionJournalEntry.getStream(mocks.emotionJournalEntryId),
    );
    expect(emotionJournalEntryBuild).toHaveBeenCalledWith(mocks.emotionJournalEntryId, history);
  });

  test("happy path", async () => {
    const eventStoreSave = spyOn(infra.EventStore, "save").mockImplementation(jest.fn());
    const emotionJournalEntryBuild = spyOn(Emotions.Aggregates.EmotionJournalEntry, "build");

    const emotionJournalEntryLogEmotion = spyOn(
      Emotions.Aggregates.EmotionJournalEntry.prototype,
      "logEmotion",
    );

    const history = [mocks.GenericSituationLoggedEvent];

    const eventStoreFind = spyOn(infra.EventStore, "find").mockResolvedValue(history);

    const payload = {
      label: mocks.GenericEmotionLoggedEvent.payload.label,
      intensity: mocks.GenericEmotionLoggedEvent.payload.intensity,
    };

    const emotion = new Emotions.Entities.Emotion(
      new Emotions.VO.EmotionLabel(payload.label),
      new Emotions.VO.EmotionIntensity(payload.intensity),
    );

    const response = await server.request(
      `/emotions/${mocks.emotionJournalEntryId}/log-emotion`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      mocks.ip,
    );

    expect(response.status).toBe(200);
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.EmotionJournalEntry.events,
      Emotions.Aggregates.EmotionJournalEntry.getStream(mocks.emotionJournalEntryId),
    );
    expect(emotionJournalEntryBuild).toHaveBeenCalledWith(mocks.emotionJournalEntryId, history);
    expect(emotionJournalEntryLogEmotion).toHaveBeenCalledWith(emotion);

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEmotionLoggedEvent]);
    jest.restoreAllMocks();
  });
});
