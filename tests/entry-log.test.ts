import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { IdProvider } from "+infra/adapters";
import { auth } from "+infra/auth";
import { EventStore } from "+infra/event-store";
import { server } from "../server";
import * as mocks from "./mocks";

const url = "/api/entry/log";

const situation = {
  situationDescription: mocks.GenericSituationLoggedEvent.payload.description,
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

describe(`POST ${url}`, () => {
  test("situation - validation - empty payload", async () => {
    spyOn(auth.api, "getSession").mockResolvedValueOnce(mocks.auth);
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toEqual(400);
    expect(json).toEqual({
      message: Emotions.VO.SituationDescription.Errors.invalid,
      _known: true,
    });
  });

  test("situation - validation - missing kind", async () => {
    spyOn(auth.api, "getSession").mockResolvedValueOnce(mocks.auth);
    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ situationDescription: "Something happened", situationLocation: "work" }),
      },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: Emotions.VO.SituationKind.Errors.invalid, _known: true });
  });

  test("emotion - validation - empty payload", async () => {
    spyOn(auth.api, "getSession").mockResolvedValueOnce(mocks.auth);
    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ ...situation }) },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: Emotions.VO.EmotionLabel.Errors.invalid, _known: true });
  });

  test("emotion - validation - missing intensity", async () => {
    spyOn(auth.api, "getSession").mockResolvedValueOnce(mocks.auth);
    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ ...situation, emotionLabel: Emotions.VO.GenevaWheelEmotion.admiration }),
      },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: Emotions.VO.EmotionIntensity.Errors.min_max, _known: true });
  });

  test("reaction - validation - empty payload", async () => {
    spyOn(auth.api, "getSession").mockResolvedValueOnce(mocks.auth);
    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ ...situation, ...emotion }) },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: Emotions.VO.ReactionDescription.Errors.invalid, _known: true });
  });

  test("reaction - validation - missing type", async () => {
    spyOn(auth.api, "getSession").mockResolvedValueOnce(mocks.auth);
    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ ...situation, ...emotion, reactionDescription: "I got drunk" }),
      },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: Emotions.VO.ReactionType.Errors.invalid, _known: true });
  });

  test("reaction - validation - missing effectiveness", async () => {
    spyOn(auth.api, "getSession").mockResolvedValueOnce(mocks.auth);
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
    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: Emotions.VO.ReactionEffectiveness.Errors.min_max, _known: true });
  });

  test("happy path", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.entryId]);
    spyOn(auth.api, "getSession").mockResolvedValueOnce(mocks.auth);
    spyOn(tools.Revision.prototype, "next").mockImplementationOnce(() => mocks.revision);
    spyOn(IdProvider, "generate").mockReturnValue(ids.generate() as any);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementationOnce(jest.fn());

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ ...situation, ...emotion, ...reaction }),
        headers: mocks.correlationIdHeaders,
      },
      mocks.ip,
    );
    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ]);
  });
});
