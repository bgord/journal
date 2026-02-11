import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/entry/${mocks.entryId}/evaluate-reaction`;

describe(`POST ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.ShieldAuthError.message, _known: true });
  });

  test("validation - empty payload", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({}), headers: mocks.revisionHeaders() },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({
      message: Emotions.VO.ReactionDescription.Errors.invalid,
      _known: true,
    });
  });

  test("validation - missing type", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

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

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "reaction.type.invalid", _known: true });
  });

  test("validation - missing effectiveness", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

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

    expect(response.status).toEqual(400);
    expect(json).toEqual({
      message: Emotions.VO.ReactionEffectiveness.Errors.min_max,
      _known: true,
    });
  });

  test("validation - incorrect id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      "/api/entry/id/evaluate-reaction",
      { method: "POST", body: JSON.stringify({}), headers: mocks.revisionHeaders() },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - EntryIsActionable", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Tools.EventStore, "find").mockResolvedValue([
        mocks.GenericSituationLoggedEvent,
        mocks.GenericEmotionLoggedEvent,
        mocks.GenericReactionLoggedEvent,
        mocks.GenericEntryDeletedEvent,
      ]),
    );

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

    await testcases.assertInvariantError(response, 403, "entry.is.actionable.error");
  });

  test("validation - ReactionCorrespondsToSituationAndEmotion - missing situation", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Tools.EventStore, "find").mockResolvedValue([]));
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
      400,
      "reaction.corresponds.to.situation.and.emotion.error",
    );
  });

  test("validation - ReactionCorrespondsToSituationAndEmotion - missing emotion", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Tools.EventStore, "find").mockResolvedValue([mocks.GenericSituationLoggedEvent]));
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
      400,
      "reaction.corresponds.to.situation.and.emotion.error",
    );
  });

  test("validation - ReactionForEvaluationExists", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Tools.EventStore, "find").mockResolvedValue([
        mocks.GenericSituationLoggedEvent,
        mocks.GenericEmotionLoggedEvent,
      ]),
    );
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

    await testcases.assertInvariantError(response, 400, "reaction.for.evaluation.exists.error");
  });

  test("validation -  RequesterOwnsEntry", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth));
    spies.use(
      spyOn(di.Tools.EventStore, "find").mockResolvedValue([
        mocks.GenericSituationLoggedEvent,
        mocks.GenericEmotionLoggedEvent,
        mocks.GenericReactionLoggedEvent,
      ]),
    );
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

    await testcases.assertInvariantError(response, 403, "requester.owns.entry.error");
  });

  test("happy path", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Tools.EventStore, "find").mockResolvedValue([
        mocks.GenericSituationLoggedEvent,
        mocks.GenericEmotionLoggedEvent,
        mocks.GenericReactionLoggedEvent,
      ]),
    );
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
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
        headers: mocks.correlationIdAndRevisionHeaders(3),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericReactionEvaluatedEvent]);
  });
});
