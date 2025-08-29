import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import * as Adapters from "+infra/adapters";
import { logger } from "+infra/adapters/logger.adapter";
import { CommandBus } from "+infra/command-bus";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
import * as mocks from "./mocks";

const EventHandler = new bg.EventHandler(logger);
const policy = new Emotions.Policies.WeeklyReviewScheduler({
  EventBus,
  EventHandler,
  CommandBus,
  IdProvider: Adapters.IdProvider,
  UserDirectory: Adapters.Auth.UserDirectory,
});

describe("WeeklyReviewScheduler", () => {
  test("correct path - single user", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.weeklyReviewId]);
    spyOn(Adapters.Auth.UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(Adapters.Emotions.EntriesPerWeekCount, "execute").mockResolvedValue(1);
    spyOn(tools.Week, "fromNow").mockReturnValue(mocks.week);
    spyOn(Adapters.IdProvider, "generate").mockReturnValue(ids.generate() as any);
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
    const ids = new bg.IdProviderDeterministicAdapter([mocks.entryId]);
    spyOn(Adapters.Auth.UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(Adapters.Emotions.EntriesPerWeekCount, "execute").mockResolvedValue(0);
    spyOn(tools.Week, "fromNow").mockReturnValue(mocks.week);
    spyOn(Adapters.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedMondayUtc18Event),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewSkippedEvent]);
  });
});
