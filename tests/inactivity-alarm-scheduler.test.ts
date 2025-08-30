import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import * as Adapters from "+infra/adapters";
import { CommandBus } from "+infra/command-bus";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
import * as mocks from "./mocks";

const EventHandler = new bg.EventHandler(Adapters.logger);
const policy = new Emotions.Policies.InactivityAlarmScheduler({
  EventBus,
  EventHandler,
  CommandBus,
  UserDirectory: Adapters.Auth.UserDirectory,
  GetLatestEntryTimestampForUser: Adapters.Emotions.GetLatestEntryTimestampForUser,
  IdProvider: Adapters.IdProvider,
  Clock: Adapters.Clock,
});

describe("InactivityAlarmScheduler", () => {
  test("correct path - single user", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    spyOn(Adapters.Auth.UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(Adapters.Emotions.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(
      mocks.inactivityTrigger.lastEntryTimestamp,
    );
    spyOn(Adapters.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(Adapters.AI.AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event);
    });
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericInactivityAlarmGeneratedEvent]);
  });

  test("USER_DAILY", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    spyOn(Adapters.Auth.UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(Adapters.Emotions.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(
      mocks.inactivityTrigger.lastEntryTimestamp,
    );
    spyOn(Adapters.AI.AiGateway, "check").mockResolvedValue({
      violations: [
        { bucket: mocks.userDailyBucket, limit: AI.QuotaLimit.parse(10), id: "USER_DAILY", used: 10 },
      ],
    });
    spyOn(Adapters.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event);
    });
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("EMOTIONS_ALARM_INACTIVITY_WEEKLY", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    spyOn(Adapters.Auth.UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(Adapters.Emotions.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(
      mocks.inactivityTrigger.lastEntryTimestamp,
    );
    spyOn(Adapters.AI.AiGateway, "check").mockResolvedValue({
      violations: [
        {
          bucket: mocks.emotionsAlarmInactivityWeeklyBucket,
          limit: AI.QuotaLimit.parse(1),
          id: "EMOTIONS_ALARM_INACTIVITY_WEEKLY",
          used: 1,
        },
      ],
    });
    spyOn(Adapters.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event);
    });
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("DailyAlarmLimit - failure", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    spyOn(Adapters.Auth.UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(Adapters.Emotions.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(
      mocks.inactivityTrigger.lastEntryTimestamp,
    );
    spyOn(Adapters.AI.AiGateway, "check").mockRejectedValue(new Error("FAILURE"));
    spyOn(Adapters.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(
        async () => await policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event),
      ).toThrow();
    });
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("NoEntriesInTheLastWeek - undefined timestamp", async () => {
    spyOn(Adapters.Auth.UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(Adapters.Emotions.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(undefined);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("NoEntriesInTheLastWeek", async () => {
    spyOn(Adapters.Auth.UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(Adapters.Emotions.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(mocks.T0);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("InactivityAlarmSchedule", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });
});
