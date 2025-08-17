import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Auth from "+auth";
import * as Emotions from "+emotions";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
import { logger } from "+infra/logger";
import * as mocks from "./mocks";

const EventHandler = new bg.EventHandler(logger);
const policy = new Emotions.Policies.WeeklyReviewScheduler(EventBus, EventHandler);

describe("WeeklyReviewScheduler", () => {
  test("correct path - single user", async () => {
    spyOn(Auth.Repos.UserRepository, "listIds").mockResolvedValue([mocks.userId]);
    spyOn(Emotions.Queries.CountEntriesPerWeekForUser, "execute").mockResolvedValue(1);
    spyOn(tools.Week, "fromNow").mockReturnValue(mocks.week);
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.weeklyReviewId);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await policy.onHourHasPassed(mocks.GenericHourHasPassedMondayUtc18Event);
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewRequestedEvent]);
  });

  test("WeeklyReviewSchedule", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await policy.onHourHasPassed(mocks.GenericHourHasPassedEvent);
    });

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("EntriesForWeekExist", async () => {
    spyOn(Auth.Repos.UserRepository, "listIds").mockResolvedValue([mocks.userId]);
    spyOn(Emotions.Queries.CountEntriesPerWeekForUser, "execute").mockResolvedValue(0);
    spyOn(tools.Week, "fromNow").mockReturnValue(mocks.week);
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.weeklyReviewId);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await policy.onHourHasPassed(mocks.GenericHourHasPassedMondayUtc18Event);
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewSkippedEvent]);
  });
});
