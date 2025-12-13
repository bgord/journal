import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import * as mocks from "./mocks";

describe("EntryAlarmDetector", async () => {
  const di = await bootstrap(mocks.Env);
  registerEventHandlers(di);
  registerCommandHandlers(di);

  const policy = new Emotions.Policies.EntryHistoryPublisher({
    ...di.Adapters.System,
    HistoryWriter: di.Adapters.History.HistoryWriter,
  });

  test("onEmotionLoggedEvent", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.historyId]);
    spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(di.Adapters.AI.AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onSituationLoggedEvent(mocks.GenericSituationLoggedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryHistorySituationLoggedEvent]);
  });

  test("onEmotionLoggedEvent", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.historyId]);
    spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(di.Adapters.AI.AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onEmotionLoggedEvent(mocks.GenericEmotionLoggedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryHistoryEmotionLoggedEvent]);
  });

  test("onReactionLoggedEvent", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.historyId]);
    spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(di.Adapters.AI.AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onReactionLoggedEvent(mocks.GenericReactionLoggedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryHistoryReactionLoggedEvent]);
  });

  test("onEmotionReappraisedEvent", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.historyId]);
    spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(di.Adapters.AI.AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onEmotionReappraisedEvent(mocks.GenericEmotionReappraisedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryHistoryEmotionReappraisedEvent]);
  });

  test("onReactionEvaluatedEvent", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.historyId]);
    spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(di.Adapters.AI.AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onReactionEvaluatedEvent(mocks.GenericReactionEvaluatedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryHistoryReactionEvaluatedEvent]);
  });

  test("onEntryDeletedEvent", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.historyId]);
    spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(di.Adapters.AI.AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onEntryDeletedEvent(mocks.GenericEntryDeletedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryHistoryClearedEvent]);
  });
});
