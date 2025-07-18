import * as Auth from "+auth";
import { describe, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("InactivityAlarmScheduler", () => {
  test("correct path - single user", async () => {
    spyOn(Auth.Repos.UserRepository, "listIds").mockResolvedValue([mocks.userId]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await Emotions.Services.InactivityAlarmScheduler.process();
    });

    jest.restoreAllMocks();
  });
});
