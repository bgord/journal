import * as Auth from "+auth";
import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { EventStore } from "../infra/event-store";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("InactivityAlarmScheduler", () => {
  test("correct path - single user", async () => {
    spyOn(Auth.Repos.UserRepository, "listIds").mockResolvedValue([mocks.userId]);
    spyOn(Emotions.Queries.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(
      mocks.inactivityTrigger.lastEntryTimestamp,
    );
    spyOn(bg.NewUUID, "generate").mockReturnValue(mocks.alarmId);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await Emotions.Services.InactivityAlarmScheduler.process();
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericInactivityAlarmGeneratedEvent]);

    jest.restoreAllMocks();
  });

  test("NoEntriesInTheLastWeek - undefined timestamp", async () => {
    spyOn(Auth.Repos.UserRepository, "listIds").mockResolvedValue([mocks.userId]);
    spyOn(Emotions.Queries.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(undefined);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await Emotions.Services.InactivityAlarmScheduler.process(),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });

  test("NoEntriesInTheLastWeek", async () => {
    spyOn(Auth.Repos.UserRepository, "listIds").mockResolvedValue([mocks.userId]);
    spyOn(Emotions.Queries.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(Date.now());
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await Emotions.Services.InactivityAlarmScheduler.process(),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });
});
