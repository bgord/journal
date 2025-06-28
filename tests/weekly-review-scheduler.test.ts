import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as infra from "../infra";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("WeeklyReviewScheduler", () => {
  test("correct path", async () => {
    spyOn(Emotions.Repos.EmotionJournalEntryRepository, "countInWeek").mockResolvedValue(1);
    spyOn(Date, "now").mockReturnValue(mocks.weekStartedAt);
    spyOn(bg.NewUUID, "generate").mockReturnValue(mocks.weeklyReviewId);
    const eventStoreSave = spyOn(infra.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await Emotions.Services.WeeklyReviewScheduler.process();
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewRequestedEvent]);

    jest.restoreAllMocks();
  });

  test("JournalEntriesForWeekExist", async () => {
    spyOn(Emotions.Repos.EmotionJournalEntryRepository, "countInWeek").mockResolvedValue(0);
    spyOn(Date, "now").mockReturnValue(mocks.weekStartedAt);
    spyOn(bg.NewUUID, "generate").mockReturnValue(mocks.weeklyReviewId);
    const eventStoreSave = spyOn(infra.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await Emotions.Services.WeeklyReviewScheduler.process();
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewSkippedEvent]);

    jest.restoreAllMocks();
  });
});
