import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { auth } from "../infra/auth";
import { EventStore } from "../infra/event-store";
import * as Emotions from "../modules/emotions";
import { server } from "../server";
import * as mocks from "./mocks";

const url = "/entry/log";

const situation = {
  situationDescription: mocks.GenericSituationLoggedEvent.payload.description,
  situationLocation: mocks.GenericSituationLoggedEvent.payload.location,
  situationKind: mocks.GenericSituationLoggedEvent.payload.kind,
};

const emotion = {
  emotionLabel: mocks.GenericEmotionLoggedEvent.payload.label,
  emotionIntensity: mocks.GenericEmotionLoggedEvent.payload.intensity,
};

const reaction = {
  reactionDescription: mocks.GenericReactionLoggedEvent.payload.description,
  reactionType: mocks.GenericReactionLoggedEvent.payload.type,
  reactionEffectiveness: mocks.GenericReactionLoggedEvent.payload.effectiveness,
};

describe("POST /entry/log", () => {
  test("situation - validation - empty payload", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(url, { method: "POST" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      message: Emotions.VO.SituationDescription.Errors.invalid,
      _known: true,
    });
  });

  test("situation - validation - missing kind and location", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ situationDescription: "Something happened" }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: Emotions.VO.SituationLocation.Errors.invalid, _known: true });
  });

  test("situation - validation - missing kind", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ situationDescription: "Something happened", situationLocation: "work" }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: Emotions.VO.SituationKind.Errors.invalid, _known: true });
  });

  test("emotion - validation - empty payload", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ ...situation }) },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: Emotions.VO.EmotionLabel.Errors.invalid, _known: true });
  });

  test("emotion - validation - missing intensity", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ ...situation, emotionLabel: Emotions.VO.GenevaWheelEmotion.admiration }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: Emotions.VO.EmotionIntensity.Errors.min_max, _known: true });
  });

  test("reaction - validation - empty payload", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ ...situation, ...emotion }) },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: Emotions.VO.ReactionDescription.Errors.invalid, _known: true });
  });

  test("reaction - validation - missing type", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ ...situation, ...emotion, reactionDescription: "I got drunk" }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: Emotions.VO.ReactionType.Errors.invalid, _known: true });
  });

  test("reaction - validation - missing effectiveness", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          ...situation,
          ...emotion,
          reactionDescription: "I got drunk",
          reactionType: Emotions.VO.GrossEmotionRegulationStrategy.acceptance,
        }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: Emotions.VO.ReactionEffectiveness.Errors.min_max, _known: true });
  });

  test("situation - OneSituationPerEntry", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [mocks.GenericSituationLoggedEvent]);
    spyOn(bg.NewUUID, "generate").mockReturnValue(mocks.entryId);
    spyOn(Emotions.Aggregates.Entry, "create").mockReturnValue(entry);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ ...situation, ...emotion, ...reaction }),
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
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    spyOn(bg.NewUUID, "generate").mockReturnValue(mocks.entryId);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ ...situation, ...emotion, ...reaction }),
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
