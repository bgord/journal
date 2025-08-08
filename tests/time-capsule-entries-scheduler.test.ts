import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { EventBus } from "../infra/event-bus";
import { EventStore } from "../infra/event-store";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const policy = new Emotions.Policies.TimeCapsuleEntriesScheduler(EventBus);

describe("TimeCapsuleEntriesScheduler", () => {
  test("TimeCapsuleEntryIsPublishable - status", async () => {
    spyOn(Emotions.Repos.TimeCapsuleEntryRepository, "listDueForPublishing").mockResolvedValue([
      mocks.timeCapsuleEntryPublished,
    ]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await policy.onHourHasPassed();
    });

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("TimeCapsuleEntryIsPublishable - scheduledFor", async () => {
    spyOn(Date, "now").mockReturnValue(tools.Timestamp.parse(mocks.scheduledFor - tools.Time.Days(1).ms));
    spyOn(Emotions.Repos.TimeCapsuleEntryRepository, "listDueForPublishing").mockResolvedValue([
      mocks.timeCapsuleEntry,
    ]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await policy.onHourHasPassed();
    });

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("correct path - no time capsule entries", async () => {
    spyOn(Emotions.Repos.TimeCapsuleEntryRepository, "listDueForPublishing").mockResolvedValue([]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await policy.onHourHasPassed();
    });

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("correct path", async () => {
    spyOn(Date, "now").mockReturnValue(tools.Timestamp.parse(mocks.scheduledFor + tools.Time.Days(1).ms));
    spyOn(Emotions.Repos.TimeCapsuleEntryRepository, "listDueForPublishing").mockResolvedValue([
      mocks.timeCapsuleEntry,
    ]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await policy.onHourHasPassed();
    });

    expect(eventStoreSave).toHaveBeenCalledWith([
      mocks.GenericSituationLoggedTimeCapsuleEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ]);
  });
});
