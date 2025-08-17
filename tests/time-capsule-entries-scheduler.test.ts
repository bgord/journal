import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { TimeCapsuleDueEntries } from "+infra/adapters/emotions";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
import { logger } from "+infra/logger";
import * as mocks from "./mocks";

const EventHandler = new bg.EventHandler(logger);
const policy = new Emotions.Policies.TimeCapsuleEntriesScheduler(
  EventBus,
  EventHandler,
  TimeCapsuleDueEntries,
);

describe("TimeCapsuleEntriesScheduler", () => {
  test("TimeCapsuleEntryIsPublishable - status", async () => {
    spyOn(TimeCapsuleDueEntries, "listDue").mockResolvedValue([mocks.timeCapsuleEntryPublished]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => policy.onHourHasPassed());
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("TimeCapsuleEntryIsPublishable - scheduledFor", async () => {
    spyOn(Date, "now").mockReturnValue(tools.Timestamp.parse(mocks.scheduledFor - tools.Time.Days(1).ms));
    spyOn(TimeCapsuleDueEntries, "listDue").mockResolvedValue([mocks.timeCapsuleEntry]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => policy.onHourHasPassed());
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("correct path - no time capsule entries", async () => {
    spyOn(TimeCapsuleDueEntries, "listDue").mockResolvedValue([]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => policy.onHourHasPassed());
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("correct path", async () => {
    spyOn(Date, "now").mockReturnValue(tools.Timestamp.parse(mocks.scheduledFor + tools.Time.Days(1).ms));
    spyOn(TimeCapsuleDueEntries, "listDue").mockResolvedValue([mocks.timeCapsuleEntry]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => policy.onHourHasPassed());
    expect(eventStoreSave).toHaveBeenCalledWith([
      mocks.GenericSituationLoggedTimeCapsuleEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ]);
  });
});
