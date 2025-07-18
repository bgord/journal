import * as Auth from "+auth";
import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { EventStore } from "../infra/event-store";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("WeeklyReviewScheduler", () => {
  test("correct path - single user", async () => {
    spyOn(Auth.Repos.UserRepository, "listIds").mockResolvedValue([mocks.userId]);
    spyOn(Emotions.Repos.EntryRepository, "countInWeekFor").mockResolvedValue(1);
    spyOn(Date, "now").mockReturnValue(mocks.weekStartedAt);
    spyOn(bg.NewUUID, "generate").mockReturnValue(mocks.weeklyReviewId);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await Emotions.Services.WeeklyReviewScheduler.process();
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewRequestedEvent]);

    jest.restoreAllMocks();
  });

  test("EntriesForWeekExist", async () => {
    spyOn(Auth.Repos.UserRepository, "listIds").mockResolvedValue([mocks.userId]);
    spyOn(Emotions.Repos.EntryRepository, "countInWeekFor").mockResolvedValue(0);
    spyOn(Date, "now").mockReturnValue(mocks.weekStartedAt);
    spyOn(bg.NewUUID, "generate").mockReturnValue(mocks.weeklyReviewId);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await Emotions.Services.WeeklyReviewScheduler.process();
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewSkippedEvent]);

    jest.restoreAllMocks();
  });
});
