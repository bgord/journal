import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as infra from "../infra";
import * as Emotions from "../modules/emotions";
import { server } from "../server";
import * as mocks from "./mocks";

const url = "/emotions/log-entry";

const situation = {
  description: mocks.GenericSituationLoggedEvent.payload.description,
  location: mocks.GenericSituationLoggedEvent.payload.location,
  kind: mocks.GenericSituationLoggedEvent.payload.kind,
};

const emotion = {
  label: mocks.GenericEmotionLoggedEvent.payload.label,
  intensity: mocks.GenericEmotionLoggedEvent.payload.intensity,
};

const reaction = {
  description: mocks.GenericReactionLoggedEvent.payload.description,
  type: mocks.GenericReactionLoggedEvent.payload.type,
  effectiveness: mocks.GenericReactionLoggedEvent.payload.effectiveness,
};

describe("POST /emotions/log-entry", () => {
  test("situation - validation - empty payload", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      message: Emotions.VO.SituationDescription.Errors.invalid,
      _known: true,
    });
  });

  test("situation - validation - missing kind and location", async () => {
    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ situation: { description: "Something happened" } }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: Emotions.VO.SituationLocation.Errors.invalid, _known: true });
  });

  test("situation - validation - missing kind", async () => {
    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ situation: { description: "Something happened", location: "work" } }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: Emotions.VO.SituationKind.Errors.invalid, _known: true });
  });

  test("emotion - validation - empty payload", async () => {
    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ situation }) },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: Emotions.VO.EmotionLabel.Errors.invalid, _known: true });
  });

  test("emotion - validation - missing intensity", async () => {
    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ situation, emotion: { label: Emotions.VO.GenevaWheelEmotion.admiration } }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: Emotions.VO.EmotionIntensity.Errors.min_max, _known: true });
  });

  test("reaction - validation - empty payload", async () => {
    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ situation, emotion }) },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: Emotions.VO.ReactionDescription.Errors.invalid, _known: true });
  });

  test("reaction - validation - missing type", async () => {
    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ situation, emotion, reaction: { description: "I got drunk" } }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: Emotions.VO.ReactionType.Errors.invalid, _known: true });
  });

  test("reaction - validation - missing effectiveness", async () => {
    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          situation,
          emotion,
          reaction: {
            description: "I got drunk",
            type: Emotions.VO.GrossEmotionRegulationStrategy.acceptance,
          },
        }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: Emotions.VO.ReactionEffectiveness.Errors.min_max, _known: true });
  });

  test("situation - OneSituationPerEntry", async () => {
    const eventStoreSave = spyOn(infra.EventStore, "save").mockImplementation(jest.fn());
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.emotionJournalEntryId, [
      mocks.GenericSituationLoggedEvent,
    ]);
    spyOn(bg.NewUUID, "generate").mockReturnValue(mocks.emotionJournalEntryId);
    spyOn(Emotions.Aggregates.EmotionJournalEntry, "create").mockReturnValue(emotionJournalEntry);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ situation, emotion, reaction }),
        headers: new Headers({ "x-correlation-id": mocks.correlationId }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toBe(Emotions.Policies.OneSituationPerEntry.code);
    expect(json).toEqual({ message: Emotions.Policies.OneSituationPerEntry.message, _known: true });

    expect(eventStoreSave).not.toHaveBeenCalledWith();

    jest.restoreAllMocks();
  });

  test("happy path", async () => {
    const eventStoreSave = spyOn(infra.EventStore, "save").mockImplementation(jest.fn());
    spyOn(bg.NewUUID, "generate").mockReturnValue(mocks.emotionJournalEntryId);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ situation, emotion, reaction }),
        headers: new Headers({ "x-correlation-id": mocks.correlationId }),
      },
      mocks.ip,
    );

    expect(response.status).toBe(200);

    expect(eventStoreSave).toHaveBeenCalledWith([
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ]);

    jest.restoreAllMocks();
  });
});
