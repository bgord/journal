import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { auth } from "../infra/auth";
import { EventStore } from "../infra/event-store";
import * as Emotions from "../modules/emotions";
import { server } from "../server";
import * as mocks from "./mocks";

const url = `/entry/${mocks.entryId}/reappraise-emotion`;

describe("POST /entry/:id/reappraise-emotion", () => {
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
      message: Emotions.VO.EmotionLabel.Errors.invalid,
      _known: true,
    });
    jest.restoreAllMocks();
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

    expect(response.status).toBe(400);
    expect(json).toEqual({
      message: Emotions.VO.EmotionIntensity.Errors.min_max,
      _known: true,
    });
    jest.restoreAllMocks();
  });

  test("validation - incorrect id", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      "/entry/id/reappraise-emotion",
      {
        method: "POST",
        headers: mocks.revisionHeaders(),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
    jest.restoreAllMocks();
  });

  test("validation - EntryIsActionable", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const entryBuild = spyOn(Emotions.Aggregates.Entry, "build");
    const history = [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericEntryDeletedEvent,
    ];
    const eventStoreFind = spyOn(EventStore, "find").mockResolvedValue(history);

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

    const json = await response.json();

    expect(response.status).toBe(Emotions.Policies.EntryIsActionable.code);
    expect(json).toEqual({
      message: Emotions.Policies.EntryIsActionable.message,
      _known: true,
    });
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.Entry.events,
      Emotions.Aggregates.Entry.getStream(mocks.entryId),
    );
    expect(entryBuild).toHaveBeenCalledWith(mocks.entryId, history);
    jest.restoreAllMocks();
  });

  test("validation - EmotionCorrespondsToSituation", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const entryBuild = spyOn(Emotions.Aggregates.Entry, "build");
    const eventStoreFind = spyOn(EventStore, "find").mockResolvedValue([]);

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

    const json = await response.json();

    expect(response.status).toBe(Emotions.Policies.EmotionCorrespondsToSituation.code);
    expect(json).toEqual({
      message: Emotions.Policies.EmotionCorrespondsToSituation.message,
      _known: true,
    });
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.Entry.events,
      Emotions.Aggregates.Entry.getStream(mocks.entryId),
    );
    expect(entryBuild).toHaveBeenCalledWith(mocks.entryId, []);
    jest.restoreAllMocks();
  });

  test("validation - EmotionForReappraisalExists", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const entryBuild = spyOn(Emotions.Aggregates.Entry, "build");
    const history = [mocks.GenericSituationLoggedEvent];
    const eventStoreFind = spyOn(EventStore, "find").mockResolvedValue(history);

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

    const json = await response.json();

    expect(response.status).toBe(Emotions.Policies.EmotionForReappraisalExists.code);
    expect(json).toEqual({
      message: Emotions.Policies.EmotionForReappraisalExists.message,
      _known: true,
    });
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.Entry.events,
      Emotions.Aggregates.Entry.getStream(mocks.entryId),
    );
    expect(entryBuild).toHaveBeenCalledWith(mocks.entryId, history);
    jest.restoreAllMocks();
  });

  test("validation -  RequesterOwnsEntry", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const entryBuild = spyOn(Emotions.Aggregates.Entry, "build");
    const entryReappraiseEmotion = spyOn(Emotions.Aggregates.Entry.prototype, "reappraiseEmotion");
    const history = [mocks.GenericSituationLoggedEvent, mocks.GenericEmotionLoggedEvent];
    const eventStoreFind = spyOn(EventStore, "find").mockResolvedValue(history);

    const payload = {
      label: mocks.GenericEmotionReappraisedEvent.payload.newLabel,
      intensity: mocks.GenericEmotionReappraisedEvent.payload.newIntensity,
    };

    const emotion = new Emotions.Entities.Emotion(
      new Emotions.VO.EmotionLabel(payload.label),
      new Emotions.VO.EmotionIntensity(payload.intensity),
    );

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: new Headers({ "x-correlation-id": mocks.correlationId, ...mocks.revisionHeaders() }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(Emotions.Policies.RequesterOwnsEntry.code);
    expect(json).toEqual({ message: Emotions.Policies.RequesterOwnsEntry.message, _known: true });

    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.Entry.events,
      Emotions.Aggregates.Entry.getStream(mocks.entryId),
    );
    expect(entryBuild).toHaveBeenCalledWith(mocks.entryId, history);
    expect(entryReappraiseEmotion).toHaveBeenCalledWith(emotion, mocks.anotherUserId);

    jest.restoreAllMocks();
  });

  test("happy path", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    const entryBuild = spyOn(Emotions.Aggregates.Entry, "build");
    const entryReappraiseEmotion = spyOn(Emotions.Aggregates.Entry.prototype, "reappraiseEmotion");
    const history = [mocks.GenericSituationLoggedEvent, mocks.GenericEmotionLoggedEvent];
    const eventStoreFind = spyOn(EventStore, "find").mockResolvedValue(history);

    const payload = {
      label: mocks.GenericEmotionReappraisedEvent.payload.newLabel,
      intensity: mocks.GenericEmotionReappraisedEvent.payload.newIntensity,
    };

    const emotion = new Emotions.Entities.Emotion(
      new Emotions.VO.EmotionLabel(payload.label),
      new Emotions.VO.EmotionIntensity(payload.intensity),
    );

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: new Headers({ "x-correlation-id": mocks.correlationId, ...mocks.revisionHeaders() }),
      },
      mocks.ip,
    );

    expect(response.status).toBe(200);
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.Entry.events,
      Emotions.Aggregates.Entry.getStream(mocks.entryId),
    );
    expect(entryBuild).toHaveBeenCalledWith(mocks.entryId, history);
    expect(entryReappraiseEmotion).toHaveBeenCalledWith(emotion, mocks.userId);

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEmotionReappraisedEvent]);

    jest.restoreAllMocks();
  });
});
