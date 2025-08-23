import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { UserDirectory } from "+infra/adapters/auth";
import { EntriesPerWeekCount } from "+infra/adapters/emotions";
import { CommandBus } from "+infra/command-bus";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
import { logger } from "+infra/logger";
import * as mocks from "./mocks";

const EventHandler = new bg.EventHandler(logger);
const policy = new Emotions.Policies.WeeklyReviewScheduler(EventBus, EventHandler, CommandBus, UserDirectory);

describe("WeeklyReviewScheduler", () => {
  test("correct path - single user", async () => {
    spyOn(UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(EntriesPerWeekCount, "execute").mockResolvedValue(1);
    spyOn(tools.Week, "fromNow").mockReturnValue(mocks.week);
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.weeklyReviewId);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedMondayUtc18Event),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewRequestedEvent]);
  });

  test("WeeklyReviewSchedule", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("EntriesForWeekExist", async () => {
    spyOn(UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(EntriesPerWeekCount, "execute").mockResolvedValue(0);
    spyOn(tools.Week, "fromNow").mockReturnValue(mocks.week);
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.weeklyReviewId);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedMondayUtc18Event),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewSkippedEvent]);
  });
});
