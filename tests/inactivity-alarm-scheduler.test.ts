import * as Auth from "+auth";
import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("InactivityAlarmScheduler", () => {
  test("correct path - single user", async () => {
    spyOn(Auth.Repos.UserRepository, "listIds").mockResolvedValue([mocks.userId]);
    spyOn(Emotions.Queries.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(Date.now());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await Emotions.Services.InactivityAlarmScheduler.process();
    });

    jest.restoreAllMocks();
  });

  test("NoEntriesInTheLastWeek - undefined timestamp", async () => {
    spyOn(Auth.Repos.UserRepository, "listIds").mockResolvedValue([mocks.userId]);
    spyOn(Emotions.Queries.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(undefined);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(async () => await Emotions.Services.InactivityAlarmScheduler.process()).toThrow(
        Emotions.Policies.NoEntriesInTheLastWeek.error,
      );
    });

    jest.restoreAllMocks();
  });

  test("NoEntriesInTheLastWeek", async () => {
    spyOn(Auth.Repos.UserRepository, "listIds").mockResolvedValue([mocks.userId]);
    spyOn(Emotions.Queries.GetLatestEntryTimestampForUser, "execute").mockResolvedValue(1);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(async () => await Emotions.Services.InactivityAlarmScheduler.process()).toThrow(
        Emotions.Policies.NoEntriesInTheLastWeek.error,
      );
    });

    jest.restoreAllMocks();
  });
});
