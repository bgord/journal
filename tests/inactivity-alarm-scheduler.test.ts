import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { AiGateway } from "+infra/adapters/ai";
import { UserDirectory } from "+infra/adapters/auth";
import { GetLatestEntryTimestampForUser } from "+infra/adapters/emotions";
import { CommandBus } from "+infra/command-bus";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
import { logger } from "+infra/logger.adapter";
import * as mocks from "./mocks";

const EventHandler = new bg.EventHandler(logger);
const policy = new Emotions.Policies.InactivityAlarmScheduler({
  EventBus,
  EventHandler,
  CommandBus,
  UserDirectory,
  GetLatestEntryTimestampForUser,
});

describe("InactivityAlarmScheduler", () => {
  test("correct path - single user", async () => {
    spyOn(UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(GetLatestEntryTimestampForUser, "execute").mockResolvedValue(
      mocks.inactivityTrigger.lastEntryTimestamp,
    );
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.alarmId);
    spyOn(AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event);
    });
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericInactivityAlarmGeneratedEvent]);
  });

  test("USER_DAILY", async () => {
    spyOn(UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(GetLatestEntryTimestampForUser, "execute").mockResolvedValue(
      mocks.inactivityTrigger.lastEntryTimestamp,
    );
    spyOn(AiGateway, "check").mockResolvedValue({
      violations: [
        { bucket: mocks.userDailyBucket, limit: AI.QuotaLimit.parse(10), id: "USER_DAILY", used: 10 },
      ],
    });
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.alarmId);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event);
    });
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("EMOTIONS_ALARM_INACTIVITY_WEEKLY", async () => {
    spyOn(UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(GetLatestEntryTimestampForUser, "execute").mockResolvedValue(
      mocks.inactivityTrigger.lastEntryTimestamp,
    );
    spyOn(AiGateway, "check").mockResolvedValue({
      violations: [
        {
          bucket: mocks.emotionsAlarmInactivityWeeklyBucket,
          limit: AI.QuotaLimit.parse(1),
          id: "EMOTIONS_ALARM_INACTIVITY_WEEKLY",
          used: 1,
        },
      ],
    });
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.alarmId);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event);
    });
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("DailyAlarmLimit - failure", async () => {
    spyOn(UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(GetLatestEntryTimestampForUser, "execute").mockResolvedValue(
      mocks.inactivityTrigger.lastEntryTimestamp,
    );
    spyOn(AiGateway, "check").mockRejectedValue(new Error("FAILURE"));
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.alarmId);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(
        async () => await policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event),
      ).toThrow();
    });
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("NoEntriesInTheLastWeek - undefined timestamp", async () => {
    spyOn(UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(GetLatestEntryTimestampForUser, "execute").mockResolvedValue(undefined);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("NoEntriesInTheLastWeek", async () => {
    spyOn(UserDirectory, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(GetLatestEntryTimestampForUser, "execute").mockResolvedValue(tools.Time.Now().value);
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
