import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { AiGateway } from "+infra/adapters/ai";
import { HistoryWriter } from "+infra/adapters/history";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
import { logger } from "+infra/logger";
import * as mocks from "./mocks";

const EventHandler = new bg.EventHandler(logger);
const policy = new Emotions.Policies.EntryHistoryPublisher(EventBus, EventHandler, HistoryWriter);

describe("EntryAlarmDetector", () => {
  test("onEmotionLoggedEvent", async () => {
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.historyId);
    spyOn(AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onSituationLoggedEvent(mocks.GenericSituationLoggedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryHistorySituationLoggedEvent]);
  });

  test("onEmotionLoggedEvent", async () => {
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.historyId);
    spyOn(AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onEmotionLoggedEvent(mocks.GenericEmotionLoggedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryHistoryEmotionLoggedEvent]);
  });

  test("onReactionLoggedEvent", async () => {
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.historyId);
    spyOn(AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onReactionLoggedEvent(mocks.GenericReactionLoggedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryHistoryReactionLoggedEvent]);
  });

  test("onEmotionReappraisedEvent", async () => {
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.historyId);
    spyOn(AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onEmotionReappraisedEvent(mocks.GenericEmotionReappraisedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryHistoryEmotionReappraisedEvent]);
  });

  test("onReactionEvaluatedEvent", async () => {
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.historyId);
    spyOn(AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onReactionEvaluatedEvent(mocks.GenericReactionEvaluatedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryHistoryReactionEvaluatedEvent]);
  });

  test("onEntryDeletedEvent", async () => {
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.historyId);
    spyOn(AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onEntryDeletedEvent(mocks.GenericEntryDeletedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericEntryHistoryClearedEvent]);
  });
});
