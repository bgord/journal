import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { auth } from "+infra/auth";
import { EventStore } from "+infra/event-store";
import { server } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/entry/${mocks.entryId}/reappraise-emotion`;

describe(`POST ${url}`, () => {
  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toEqual(403);
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
    expect(response.status).toEqual(400);
    expect(json).toEqual({
      message: Emotions.VO.EmotionLabel.Errors.invalid,
      _known: true,
    });
  });

  test("validation - missing intensity", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ label: Emotions.VO.GenevaWheelEmotion.admiration }),
        headers: mocks.revisionHeaders(),
      },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toEqual(400);
    expect(json).toEqual({
      message: Emotions.VO.EmotionIntensity.Errors.min_max,
      _known: true,
    });
  });

  test("validation - invalid id", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      "/api/entry/id/reappraise-emotion",
      {
        method: "POST",
        headers: mocks.revisionHeaders(),
      },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - EntryIsActionable", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericEntryDeletedEvent,
    ]);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          label: Emotions.VO.GenevaWheelEmotion.admiration,
          intensity: 4,
        }),
        headers: mocks.revisionHeaders(3),
      },
      mocks.ip,
    );
    await testcases.assertInvariantError(response, Emotions.Invariants.EntryIsActionable);
  });

  test("validation - EmotionCorrespondsToSituation", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(EventStore, "find").mockResolvedValue([]);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          label: Emotions.VO.GenevaWheelEmotion.admiration,
          intensity: 4,
        }),
        headers: mocks.revisionHeaders(),
      },
      mocks.ip,
    );
    await testcases.assertInvariantError(response, Emotions.Invariants.EmotionCorrespondsToSituation);
  });

  test("validation - EmotionForReappraisalExists", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericSituationLoggedEvent]);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          label: Emotions.VO.GenevaWheelEmotion.admiration,
          intensity: 4,
        }),
        headers: mocks.revisionHeaders(1),
      },
      mocks.ip,
    );
    await testcases.assertInvariantError(response, Emotions.Invariants.EmotionForReappraisalExists);
  });

  test("validation -  RequesterOwnsEntry", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
    ]);

    const payload = {
      label: mocks.GenericEmotionReappraisedEvent.payload.newLabel,
      intensity: mocks.GenericEmotionReappraisedEvent.payload.newIntensity,
    };

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: mocks.correlationIdAndRevisionHeaders(),
      },
      mocks.ip,
    );
    await testcases.assertInvariantError(response, Emotions.Invariants.RequesterOwnsEntry);
  });

  test("happy path", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
    ]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const payload = {
      label: mocks.GenericEmotionReappraisedEvent.payload.newLabel,
      intensity: mocks.GenericEmotionReappraisedEvent.payload.newIntensity,
    };

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: mocks.correlationIdAndRevisionHeaders(),
      },
      mocks.ip,
    );
    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEmotionReappraisedEvent]);
  });
});
