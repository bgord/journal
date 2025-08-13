import * as Emotions from "+emotions";
import { auth } from "+infra/auth";
import { EventStore } from "+infra/event-store";
import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { server } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/entry/${mocks.entryId}/evaluate-reaction`;

describe("POST /entry/:id/evaluate-reaction", () => {
  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toBe(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("validation - empty payload", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders() },
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
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ description: "I got drunk" }),
        headers: mocks.revisionHeaders(),
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
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          description: "I got drunk",
          type: Emotions.VO.GrossEmotionRegulationStrategy.acceptance,
        }),
        headers: mocks.revisionHeaders(),
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
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      "/entry/id/evaluate-reaction",
      { method: "POST", headers: mocks.revisionHeaders() },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - EntryIsActionable", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
      mocks.GenericEntryDeletedEvent,
    ]);

    const payload = {
      description: "I got drunk",
      type: Emotions.VO.GrossEmotionRegulationStrategy.acceptance,
      effectiveness: 1,
    };

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: mocks.revisionHeaders(4),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, Emotions.Invariants.EntryIsActionable);
  });

  test("validation - ReactionCorrespondsToSituationAndEmotion - missing situation", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(EventStore, "find").mockResolvedValue([]);

    const payload = {
      description: "I got drunk",
      type: Emotions.VO.GrossEmotionRegulationStrategy.acceptance,
      effectiveness: 1,
    };

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: mocks.revisionHeaders(),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(
      response,
      Emotions.Invariants.ReactionCorrespondsToSituationAndEmotion,
    );
  });

  test("validation - ReactionCorrespondsToSituationAndEmotion - missing emotion", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericSituationLoggedEvent]);

    const payload = {
      description: "I got drunk",
      type: Emotions.VO.GrossEmotionRegulationStrategy.acceptance,
      effectiveness: 1,
    };

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: mocks.revisionHeaders(1),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(
      response,
      Emotions.Invariants.ReactionCorrespondsToSituationAndEmotion,
    );
  });

  test("validation - ReactionForEvaluationExists", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
    ]);

    const payload = {
      description: "I got drunk",
      type: Emotions.VO.GrossEmotionRegulationStrategy.acceptance,
      effectiveness: 1,
    };

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: mocks.revisionHeaders(2),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, Emotions.Invariants.ReactionForEvaluationExists);
  });

  test("validation -  RequesterOwnsEntry", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ]);

    const payload = {
      description: mocks.GenericReactionEvaluatedEvent.payload.description,
      type: mocks.GenericReactionEvaluatedEvent.payload.type,
      effectiveness: mocks.GenericReactionEvaluatedEvent.payload.effectiveness,
    };

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: mocks.revisionHeaders(3),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, Emotions.Invariants.RequesterOwnsEntry);
  });

  test("happy path", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const payload = {
      description: mocks.GenericReactionEvaluatedEvent.payload.description,
      type: mocks.GenericReactionEvaluatedEvent.payload.type,
      effectiveness: mocks.GenericReactionEvaluatedEvent.payload.effectiveness,
    };

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: new Headers({ "x-correlation-id": mocks.correlationId, ...mocks.revisionHeaders(3) }),
      },
      mocks.ip,
    );

    expect(response.status).toBe(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericReactionEvaluatedEvent]);
  });
});
