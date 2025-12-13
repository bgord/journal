import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("InactivityAlarmScheduler", async () => {
  const di = await bootstrap(mocks.Env);

  const policy = new Emotions.Policies.InactivityAlarmScheduler({
    ...di.Adapters.System,
    UserDirectory: di.Adapters.Auth.UserDirectory,
    GetLatestEntryTimestampForUser: di.Adapters.Emotions.GetLatestEntryTimestampForUser,
  });

  test("correct path - single user", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    spyOn(di.Adapters.Auth.UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(di.Adapters.Emotions.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(
      mocks.inactivityTrigger.lastEntryTimestamp,
    );
    spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(di.Adapters.AI.AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event);
    });
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericInactivityAlarmGeneratedEvent]);
  });

  test("USER_DAILY", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    spyOn(di.Adapters.Auth.UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(di.Adapters.Emotions.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(
      mocks.inactivityTrigger.lastEntryTimestamp,
    );
    spyOn(di.Adapters.AI.AiGateway, "check").mockResolvedValue({
      violations: [
        { bucket: mocks.userDailyBucket, limit: AI.QuotaLimit.parse(10), id: "USER_DAILY", used: 10 },
      ],
    });
    spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event);
    });
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("EMOTIONS_ALARM_INACTIVITY_WEEKLY", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    spyOn(di.Adapters.Auth.UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(di.Adapters.Emotions.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(
      mocks.inactivityTrigger.lastEntryTimestamp,
    );
    spyOn(di.Adapters.AI.AiGateway, "check").mockResolvedValue({
      violations: [
        {
          bucket: mocks.emotionsAlarmInactivityWeeklyBucket,
          limit: AI.QuotaLimit.parse(1),
          id: "EMOTIONS_ALARM_INACTIVITY_WEEKLY",
          used: 1,
        },
      ],
    });
    spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event);
    });
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("DailyAlarmLimit - failure", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    spyOn(di.Adapters.Auth.UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(di.Adapters.Emotions.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(
      mocks.inactivityTrigger.lastEntryTimestamp,
    );
    spyOn(di.Adapters.AI.AiGateway, "check").mockRejectedValue(new Error("FAILURE"));
    spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(
        async () => await policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event),
      ).toThrow();
    });
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("NoEntriesInTheLastWeek - undefined timestamp", async () => {
    spyOn(di.Adapters.Auth.UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(di.Adapters.Emotions.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(undefined);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("NoEntriesInTheLastWeek", async () => {
    spyOn(di.Adapters.Auth.UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(di.Adapters.Emotions.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(
      mocks.GenericHourHasPassedWednesdayUtc18Event.payload.timestamp,
    );
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("InactivityAlarmSchedule", async () => {
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });
});
