import * as Auth from "+auth";
import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { EventBus } from "../infra/event-bus";
import { EventStore } from "../infra/event-store";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const policy = new Emotions.Policies.InactivityAlarmScheduler(EventBus);

describe("InactivityAlarmScheduler", () => {
  test("correct path - single user", async () => {
    spyOn(Auth.Repos.UserRepository, "listIds").mockResolvedValue([mocks.userId]);
    spyOn(Emotions.Queries.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(
      mocks.inactivityTrigger.lastEntryTimestamp,
    );
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.alarmId);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await policy.onHourHasPassed(mocks.GenericHourHasPassedWednesdayUtc18Event);
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericInactivityAlarmGeneratedEvent]);
  });

  test("DailyAlarmLimit", async () => {
    spyOn(Auth.Repos.UserRepository, "listIds").mockResolvedValue([mocks.userId]);
    spyOn(Emotions.Queries.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(
      mocks.inactivityTrigger.lastEntryTimestamp,
    );
    spyOn(Emotions.Queries.CountTodaysAlarmsForUser, "execute").mockResolvedValue({ count: 11 });
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.alarmId);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(async () => await policy.onHourHasPassed(mocks.GenericHourHasPassedWednesdayUtc18Event)).toThrow(
        Emotions.Invariants.DailyAlarmLimit.error,
      );
    });

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("DailyAlarmLimit - failure", async () => {
    spyOn(Auth.Repos.UserRepository, "listIds").mockResolvedValue([mocks.userId]);
    spyOn(Emotions.Queries.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(
      mocks.inactivityTrigger.lastEntryTimestamp,
    );
    spyOn(Emotions.Queries.CountTodaysAlarmsForUser, "execute").mockImplementation(() => {
      throw new Error("FAILURE");
    });
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.alarmId);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(
        async () => await policy.onHourHasPassed(mocks.GenericHourHasPassedWednesdayUtc18Event),
      ).toThrow();
    });

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("NoEntriesInTheLastWeek - undefined timestamp", async () => {
    spyOn(Auth.Repos.UserRepository, "listIds").mockResolvedValue([mocks.userId]);
    spyOn(Emotions.Queries.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(undefined);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await policy.onHourHasPassed(mocks.GenericHourHasPassedWednesdayUtc18Event),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("NoEntriesInTheLastWeek", async () => {
    spyOn(Auth.Repos.UserRepository, "listIds").mockResolvedValue([mocks.userId]);
    spyOn(Emotions.Queries.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(Date.now());
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await policy.onHourHasPassed(mocks.GenericHourHasPassedWednesdayUtc18Event),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("InactivityAlarmSchedule", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await policy.onHourHasPassed(mocks.GenericHourHasPassedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });
});
