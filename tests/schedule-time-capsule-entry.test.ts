import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/entry/time-capsule-entry/schedule";
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

describe(`POST ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("situation - validation - empty payload", async () => {
    spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({
      message: Emotions.VO.SituationDescription.Errors.invalid,
      _known: true,
    });
  });

  test("situation - validation - missing kind", async () => {
    spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

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
    spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

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
    spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

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
    spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

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
    spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

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
    spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

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

  test("scheduledFor - missing", async () => {
    spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ ...situation, ...emotion, ...reaction }) },
      mocks.ip,
    );

    expect(response.status).toEqual(400);
  });

  test("scheduledFor - in the past", async () => {
    spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          ...situation,
          ...emotion,
          ...reaction,
          scheduledFor: mocks.timeCapsuleEntryScheduledForPastDate,
          scheduledForHour: 0,
        }),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, Emotions.Invariants.TimeCapsuleEntryScheduledInFuture);
  });

  test("scheduledForHour - missing", async () => {
    spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          ...situation,
          ...emotion,
          ...reaction,
          scheduledFor: mocks.timeCapsuleEntryScheduledForPastDate,
        }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(400);
  });

  test("happy path", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.entryId]);
    spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate());
    const eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          ...situation,
          ...emotion,
          ...reaction,
          scheduledFor: mocks.timeCapsuleEntryScheduledForDate,
          scheduledForHour: 0,
        }),
        headers: mocks.correlationIdHeaders,
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericTimeCapsuleEntryScheduledEvent]);
  });
});
