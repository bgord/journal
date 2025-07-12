import { describe, expect, jest, spyOn, test } from "bun:test";
import { EventStore } from "../infra/event-store";
import * as Emotions from "../modules/emotions";
import { server } from "../server";
import * as mocks from "./mocks";

const url = `/entry/${mocks.entryId}/reappraise-emotion`;

describe("POST /entry/:id/reappraise-emotion", () => {
  test("validation - empty payload", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      message: Emotions.VO.EmotionLabel.Errors.invalid,
      _known: true,
    });
  });

  test("validation - missing intensity", async () => {
    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          label: Emotions.VO.GenevaWheelEmotion.admiration,
        }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      message: Emotions.VO.EmotionIntensity.Errors.min_max,
      _known: true,
    });
  });

  test("validation - incorrect id", async () => {
    const response = await server.request(
      "/entry/id/reappraise-emotion",
      {
        method: "POST",
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - EntryIsActionable", async () => {
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
  });

  test("validation - EmotionCorrespondsToSituation", async () => {
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
  });

  test("validation - EmotionForReappraisalExists", async () => {
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
  });

  test("happy path", async () => {
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
        headers: new Headers({ "x-correlation-id": mocks.correlationId }),
      },
      mocks.ip,
    );

    expect(response.status).toBe(200);
    expect(eventStoreFind).toHaveBeenCalledWith(
      Emotions.Aggregates.Entry.events,
      Emotions.Aggregates.Entry.getStream(mocks.entryId),
    );
    expect(entryBuild).toHaveBeenCalledWith(mocks.entryId, history);
    expect(entryReappraiseEmotion).toHaveBeenCalledWith(emotion);

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEmotionReappraisedEvent]);

    jest.restoreAllMocks();
  });
});
