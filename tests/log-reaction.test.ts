import { describe, expect, jest, spyOn, test } from "bun:test";
import * as infra from "../infra";
import * as Emotions from "../modules/emotions";
import { server } from "../server";
import * as mocks from "./mocks";

describe("POST /emotions/:id/log-reaction", () => {
  test("validation - empty payload", async () => {
    const response = await server.request(
      `/emotions/${mocks.emotionJournalEntryId}/log-reaction`,
      { method: "POST" },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      message: Emotions.VO.ReactionDescription.Errors.invalid,
      _known: true,
    });
  });

  test("validation - missing type", async () => {
    const response = await server.request(
      `/emotions/${mocks.emotionJournalEntryId}/log-reaction`,
      {
        method: "POST",
        body: JSON.stringify({
          description: "I got drunk",
        }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      message: Emotions.VO.ReactionType.Errors.invalid,
      _known: true,
    });
  });

  test("validation - missing effectiveness", async () => {
    const response = await server.request(
      `/emotions/${mocks.emotionJournalEntryId}/log-reaction`,
      {
        method: "POST",
        body: JSON.stringify({
          description: "I got drunk",
          type: Emotions.VO.GrossEmotionRegulationStrategy.acceptance,
        }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      message: Emotions.VO.ReactionEffectiveness.Errors.min_max,
      _known: true,
    });
  });

  test("validation - incorrect id", async () => {
    const response = await server.request("/emotions/id/log-reaction", { method: "POST" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - EntryIsActionable", async () => {
    const emotionJournalEntryBuild = spyOn(Emotions.Aggregates.EmotionJournalEntry, "build");

    const emotionJournalEntryLogReaction = spyOn(
      Emotions.Aggregates.EmotionJournalEntry.prototype,
      "logReaction",
    );

    const history = [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
      mocks.GenericEmotionJournalEntryDeletedEvent,
    ];

    const eventStoreFind = spyOn(infra.EventStore, "find").mockResolvedValue(history);

    const payload = {
      description: "I got drunk",
      type: Emotions.VO.GrossEmotionRegulationStrategy.acceptance,
      effectiveness: 1,
    };

    const reaction = new Emotions.Entities.Reaction(
      new Emotions.VO.ReactionDescription(payload.description),
      new Emotions.VO.ReactionType(payload.type),
      new Emotions.VO.ReactionEffectiveness(payload.effectiveness),
    );

    const response = await server.request(
      `/emotions/${mocks.emotionJournalEntryId}/log-reaction`,
      {
        method: "POST",
        body: JSON.stringify(payload),
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
    expect(emotionJournalEntryLogReaction).toHaveBeenCalledWith(reaction);
  });

  test("validation - EntryIsActionable", async () => {
    const emotionJournalEntryBuild = spyOn(Emotions.Aggregates.EmotionJournalEntry, "build");

    const history = [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
      mocks.GenericEmotionJournalEntryDeletedEvent,
    ];

    const eventStoreFind = spyOn(infra.EventStore, "find").mockResolvedValue(history);

    const payload = {
      description: "I got drunk",
      type: Emotions.VO.GrossEmotionRegulationStrategy.acceptance,
      effectiveness: 1,
    };

    const response = await server.request(
      `/emotions/${mocks.emotionJournalEntryId}/log-reaction`,
      {
        method: "POST",
        body: JSON.stringify(payload),
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

  test("validation - OneReactionPerEntry", async () => {
    const emotionJournalEntryBuild = spyOn(Emotions.Aggregates.EmotionJournalEntry, "build");

    const history = [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ];

    const eventStoreFind = spyOn(infra.EventStore, "find").mockResolvedValue(history);

    const payload = {
      description: "I got drunk",
      type: Emotions.VO.GrossEmotionRegulationStrategy.acceptance,
      effectiveness: 1,
    };

    const response = await server.request(
      `/emotions/${mocks.emotionJournalEntryId}/log-reaction`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(Emotions.Policies.OneReactionPerEntry.code);
    expect(json).toEqual({
      message: Emotions.Policies.OneReactionPerEntry.message,
      _known: true,
    });
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.EmotionJournalEntry.events,
      Emotions.Aggregates.EmotionJournalEntry.getStream(mocks.emotionJournalEntryId),
    );
    expect(emotionJournalEntryBuild).toHaveBeenCalledWith(mocks.emotionJournalEntryId, history);
  });

  test("validation - ReactionCorrespondsToSituationAndEmotion - missing situation", async () => {
    const emotionJournalEntryBuild = spyOn(Emotions.Aggregates.EmotionJournalEntry, "build");

    const history = [];

    const eventStoreFind = spyOn(infra.EventStore, "find").mockResolvedValue(history);

    const payload = {
      description: "I got drunk",
      type: Emotions.VO.GrossEmotionRegulationStrategy.acceptance,
      effectiveness: 1,
    };

    const response = await server.request(
      `/emotions/${mocks.emotionJournalEntryId}/log-reaction`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.code);
    expect(json).toEqual({
      message: Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.message,
      _known: true,
    });
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.EmotionJournalEntry.events,
      Emotions.Aggregates.EmotionJournalEntry.getStream(mocks.emotionJournalEntryId),
    );
    expect(emotionJournalEntryBuild).toHaveBeenCalledWith(mocks.emotionJournalEntryId, history);
  });

  test("validation - ReactionCorrespondsToSituationAndEmotion - missing emotion", async () => {
    const emotionJournalEntryBuild = spyOn(Emotions.Aggregates.EmotionJournalEntry, "build");

    const history = [mocks.GenericSituationLoggedEvent];

    const eventStoreFind = spyOn(infra.EventStore, "find").mockResolvedValue(history);

    const payload = {
      description: "I got drunk",
      type: Emotions.VO.GrossEmotionRegulationStrategy.acceptance,
      effectiveness: 1,
    };

    const response = await server.request(
      `/emotions/${mocks.emotionJournalEntryId}/log-reaction`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.code);
    expect(json).toEqual({
      message: Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.message,
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

    const emotionJournalEntryLogReaction = spyOn(
      Emotions.Aggregates.EmotionJournalEntry.prototype,
      "logReaction",
    );

    const history = [mocks.GenericSituationLoggedEvent, mocks.GenericEmotionLoggedEvent];

    const eventStoreFind = spyOn(infra.EventStore, "find").mockResolvedValue(history);

    const payload = {
      description: mocks.GenericReactionLoggedEvent.payload.description,
      type: mocks.GenericReactionLoggedEvent.payload.type,
      effectiveness: mocks.GenericReactionLoggedEvent.payload.effectiveness,
    };

    const reaction = new Emotions.Entities.Reaction(
      new Emotions.VO.ReactionDescription(payload.description),
      new Emotions.VO.ReactionType(payload.type),
      new Emotions.VO.ReactionEffectiveness(payload.effectiveness),
    );

    const response = await server.request(
      `/emotions/${mocks.emotionJournalEntryId}/log-reaction`,
      {
        method: "POST",
        body: JSON.stringify(payload),
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
    expect(emotionJournalEntryLogReaction).toHaveBeenCalledWith(reaction);

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericReactionLoggedEvent]);
    jest.restoreAllMocks();
  });
});
