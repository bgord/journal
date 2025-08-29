import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import * as Adapters from "+infra/adapters";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
import * as mocks from "./mocks";

const EventHandler = new bg.EventHandler(Adapters.logger);
const policy = new Emotions.Policies.EntryHistoryPublisher({
  EventBus,
  EventHandler,
  HistoryWriter: Adapters.History.HistoryWriter,
});

describe("EntryAlarmDetector", () => {
  test("onEmotionLoggedEvent", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.historyId]);
    spyOn(Adapters.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(Adapters.AI.AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onSituationLoggedEvent(mocks.GenericSituationLoggedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryHistorySituationLoggedEvent]);
  });

  test("onEmotionLoggedEvent", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.historyId]);
    spyOn(Adapters.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(Adapters.AI.AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onEmotionLoggedEvent(mocks.GenericEmotionLoggedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryHistoryEmotionLoggedEvent]);
  });

  test("onReactionLoggedEvent", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.historyId]);
    spyOn(Adapters.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(Adapters.AI.AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onReactionLoggedEvent(mocks.GenericReactionLoggedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryHistoryReactionLoggedEvent]);
  });

  test("onEmotionReappraisedEvent", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.historyId]);
    spyOn(Adapters.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(Adapters.AI.AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onEmotionReappraisedEvent(mocks.GenericEmotionReappraisedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryHistoryEmotionReappraisedEvent]);
  });

  test("onReactionEvaluatedEvent", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.historyId]);
    spyOn(Adapters.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(Adapters.AI.AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onReactionEvaluatedEvent(mocks.GenericReactionEvaluatedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryHistoryReactionEvaluatedEvent]);
  });

  test("onEntryDeletedEvent", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.historyId]);
    spyOn(Adapters.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(Adapters.AI.AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onEntryDeletedEvent(mocks.GenericEntryDeletedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryHistoryClearedEvent]);
  });
});
