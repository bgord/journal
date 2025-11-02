import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import * as Adapters from "+infra/adapters";
import { CommandBus } from "+infra/command-bus";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
import * as mocks from "./mocks";

const EventHandler = new bg.EventHandler(Adapters.Logger);
const policy = new Emotions.Policies.TimeCapsuleEntriesScheduler({
  EventBus,
  EventHandler,
  CommandBus,
  TimeCapsuleDueEntries: Adapters.Emotions.TimeCapsuleDueEntries,
  IdProvider: Adapters.IdProvider,
  Clock: Adapters.Clock,
});

describe("TimeCapsuleEntriesScheduler", () => {
  test("TimeCapsuleEntryIsPublishable - status", async () => {
    spyOn(Adapters.Emotions.TimeCapsuleDueEntries, "listDue").mockResolvedValue([
      mocks.timeCapsuleEntryPublished,
    ]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("TimeCapsuleEntryIsPublishable - scheduledFor", async () => {
    spyOn(Adapters.Clock, "nowMs").mockReturnValueOnce(mocks.T0.subtract(tools.Duration.Days(1)).ms);
    spyOn(Adapters.Emotions.TimeCapsuleDueEntries, "listDue").mockResolvedValue([mocks.timeCapsuleEntry]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("correct path - no time capsule entries", async () => {
    spyOn(Adapters.Emotions.TimeCapsuleDueEntries, "listDue").mockResolvedValue([]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("correct path", async () => {
    spyOn(Adapters.Clock, "nowMs").mockReturnValueOnce(mocks.timeCapsuleEntryScheduledFor.ms);
    spyOn(Adapters.Emotions.TimeCapsuleDueEntries, "listDue").mockResolvedValue([mocks.timeCapsuleEntry]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([
      mocks.GenericSituationLoggedTimeCapsuleEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ]);
  });
});
