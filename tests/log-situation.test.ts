import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as infra from "../infra";
import * as Emotions from "../modules/emotions";
import { server } from "../server";
import * as mocks from "./mocks";

describe("POST /emotions/log-situation", () => {
  test("validation - empty payload", async () => {
    const response = await server.request("/emotions/log-situation", { method: "POST" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      message: Emotions.VO.SituationDescription.Errors.invalid,
      _known: true,
    });
  });

  test("validation - missing kind and location", async () => {
    const response = await server.request(
      "/emotions/log-situation",
      {
        method: "POST",
        body: JSON.stringify({ description: "Something happened" }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      message: Emotions.VO.SituationLocation.Errors.invalid,
      _known: true,
    });
  });

  test("validation - missing kind", async () => {
    const response = await server.request(
      "/emotions/log-situation",
      {
        method: "POST",
        body: JSON.stringify({
          description: "Something happened",
          location: "work",
        }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      message: Emotions.VO.SituationKind.Errors.invalid,
      _known: true,
    });
  });

  test("happy path", async () => {
    spyOn(bg.NewUUID, "generate").mockReturnValue(mocks.emotionJournalEntryId);
    const eventStoreSave = spyOn(infra.EventStore, "save").mockImplementation(jest.fn());

    const emotionJournalEntryCreate = spyOn(Emotions.Aggregates.EmotionJournalEntry, "create");

    const emotionJournalEntryLogSituation = spyOn(
      Emotions.Aggregates.EmotionJournalEntry.prototype,
      "logSituation",
    );

    const payload = {
      description: mocks.GenericSituationLoggedEvent.payload.description,
      location: mocks.GenericSituationLoggedEvent.payload.location,
      kind: mocks.GenericSituationLoggedEvent.payload.kind,
    };

    const situation = new Emotions.Entities.Situation(
      new Emotions.VO.SituationDescription(payload.description),
      new Emotions.VO.SituationLocation(payload.location),
      new Emotions.VO.SituationKind(payload.kind),
    );

    const response = await server.request(
      "/emotions/log-situation",
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: new Headers({ "x-correlation-id": mocks.correlationId }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(emotionJournalEntryCreate).toHaveBeenCalledWith(mocks.expectAnyId);
    expect(emotionJournalEntryLogSituation).toHaveBeenCalledWith(situation);

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericSituationLoggedEvent]);
    jest.restoreAllMocks();
  });
});
