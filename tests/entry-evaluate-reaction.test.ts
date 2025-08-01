import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { auth } from "../infra/auth";
import { EventStore } from "../infra/event-store";
import * as Emotions from "../modules/emotions";
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
    const entryBuild = spyOn(Emotions.Aggregates.Entry, "build");
    const history = [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
      mocks.GenericEntryDeletedEvent,
    ];
    const eventStoreFind = spyOn(EventStore, "find").mockResolvedValue(history);

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

    await testcases.assertPolicyError(response, Emotions.Policies.EntryIsActionable);
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.Entry.events,
      Emotions.Aggregates.Entry.getStream(mocks.entryId),
    );
    expect(entryBuild).toHaveBeenCalledWith(mocks.entryId, history);
  });

  test("validation - ReactionCorrespondsToSituationAndEmotion - missing situation", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const entryBuild = spyOn(Emotions.Aggregates.Entry, "build");
    const eventStoreFind = spyOn(EventStore, "find").mockResolvedValue([]);

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

    await testcases.assertPolicyError(response, Emotions.Policies.ReactionCorrespondsToSituationAndEmotion);
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.Entry.events,
      Emotions.Aggregates.Entry.getStream(mocks.entryId),
    );
    expect(entryBuild).toHaveBeenCalledWith(mocks.entryId, []);
  });

  test("validation - ReactionCorrespondsToSituationAndEmotion - missing emotion", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const entryBuild = spyOn(Emotions.Aggregates.Entry, "build");
    const history = [mocks.GenericSituationLoggedEvent];
    const eventStoreFind = spyOn(EventStore, "find").mockResolvedValue(history);

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

    await testcases.assertPolicyError(response, Emotions.Policies.ReactionCorrespondsToSituationAndEmotion);
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.Entry.events,
      Emotions.Aggregates.Entry.getStream(mocks.entryId),
    );
    expect(entryBuild).toHaveBeenCalledWith(mocks.entryId, history);
  });

  test("validation - ReactionForEvaluationExists", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const entryBuild = spyOn(Emotions.Aggregates.Entry, "build");
    const history = [mocks.GenericSituationLoggedEvent, mocks.GenericEmotionLoggedEvent];
    const eventStoreFind = spyOn(EventStore, "find").mockResolvedValue(history);

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

    await testcases.assertPolicyError(response, Emotions.Policies.ReactionForEvaluationExists);
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.Entry.events,
      Emotions.Aggregates.Entry.getStream(mocks.entryId),
    );
    expect(entryBuild).toHaveBeenCalledWith(mocks.entryId, history);
  });

  test("validation -  RequesterOwnsEntry", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    const entryBuild = spyOn(Emotions.Aggregates.Entry, "build");
    const entryEvaluateReaction = spyOn(Emotions.Aggregates.Entry.prototype, "evaluateReaction");
    const history = [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ];
    const eventStoreFind = spyOn(EventStore, "find").mockResolvedValue(history);

    const payload = {
      description: mocks.GenericReactionEvaluatedEvent.payload.description,
      type: mocks.GenericReactionEvaluatedEvent.payload.type,
      effectiveness: mocks.GenericReactionEvaluatedEvent.payload.effectiveness,
    };

    const reaction = new Emotions.Entities.Reaction(
      new Emotions.VO.ReactionDescription(payload.description),
      new Emotions.VO.ReactionType(payload.type),
      new Emotions.VO.ReactionEffectiveness(payload.effectiveness),
    );

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: mocks.revisionHeaders(3),
      },
      mocks.ip,
    );

    await testcases.assertPolicyError(response, Emotions.Policies.RequesterOwnsEntry);

    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.Entry.events,
      Emotions.Aggregates.Entry.getStream(mocks.entryId),
    );
    expect(entryBuild).toHaveBeenCalledWith(mocks.entryId, history);
    expect(entryEvaluateReaction).toHaveBeenCalledWith(reaction, mocks.anotherUserId);
  });

  test("happy path", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    const entryBuild = spyOn(Emotions.Aggregates.Entry, "build");
    const entryEvaluateReaction = spyOn(Emotions.Aggregates.Entry.prototype, "evaluateReaction");
    const history = [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ];
    const eventStoreFind = spyOn(EventStore, "find").mockResolvedValue(history);

    const payload = {
      description: mocks.GenericReactionEvaluatedEvent.payload.description,
      type: mocks.GenericReactionEvaluatedEvent.payload.type,
      effectiveness: mocks.GenericReactionEvaluatedEvent.payload.effectiveness,
    };

    const reaction = new Emotions.Entities.Reaction(
      new Emotions.VO.ReactionDescription(payload.description),
      new Emotions.VO.ReactionType(payload.type),
      new Emotions.VO.ReactionEffectiveness(payload.effectiveness),
    );

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
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.Entry.events,
      Emotions.Aggregates.Entry.getStream(mocks.entryId),
    );
    expect(entryBuild).toHaveBeenCalledWith(mocks.entryId, history);
    expect(entryEvaluateReaction).toHaveBeenCalledWith(reaction, mocks.userId);

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericReactionEvaluatedEvent]);
  });
});
