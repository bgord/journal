import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { EventBus } from "../infra/event-bus";
import { EventStore } from "../infra/event-store";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const policy = new Emotions.Policies.TimeCapsuleEntriesScheduler(EventBus);

describe("TimeCapsuleEntriesScheduler", () => {
  test("correct path - no time capsule entries", async () => {
    spyOn(Emotions.Repos.TimeCapsuleEntryRepository, "listDueForScheduling").mockResolvedValue([]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await policy.onHourHasPassed(mocks.GenericHourHasPassedMondayUtc18Event);
    });

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("correct path", async () => {
    spyOn(Emotions.Repos.TimeCapsuleEntryRepository, "listDueForScheduling").mockResolvedValue([
      mocks.timeCapsuleEntry,
    ]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await policy.onHourHasPassed(mocks.GenericHourHasPassedMondayUtc18Event);
    });

    expect(eventStoreSave).toHaveBeenCalledWith([
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ]);
  });
});
