import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import * as Adapters from "+infra/adapters";
import { CommandBus } from "+infra/command-bus";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
import * as mocks from "./mocks";

const EventHandler = new bg.EventHandler(Adapters.Logger);
const policy = new Emotions.Policies.EntryAlarmDetector({
  EventBus,
  EventHandler,
  CommandBus,
  IdProvider: Adapters.IdProvider,
  Clock: Adapters.Clock,
});

describe("EntryAlarmDetector", () => {
  test("onEmotionLoggedEvent", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    spyOn(Adapters.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(Adapters.AI.AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.detect(mocks.NegativeEmotionExtremeIntensityLoggedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmGeneratedEvent]);
  });

  test("onEmotionLoggedEvent - respects DailyAlarmLimit", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    spyOn(Adapters.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(Adapters.AI.AiGateway, "check").mockResolvedValue({
      violations: [
        { bucket: mocks.userDailyBucket, limit: AI.QuotaLimit.parse(10), id: "USER_DAILY", used: 10 },
      ],
    });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.detect(mocks.NegativeEmotionExtremeIntensityLoggedEvent),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("onEmotionLoggedEvent - respects EntryAlarmLimit", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    spyOn(Adapters.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(Adapters.AI.AiGateway, "check").mockResolvedValue({
      violations: [
        {
          bucket: mocks.emotionsAlarmEntryBucket,
          limit: AI.QuotaLimit.parse(2),
          id: "EMOTIONS_ALARM_ENTRY",
          used: 2,
        },
      ],
    });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.detect(mocks.NegativeEmotionExtremeIntensityLoggedEvent),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("onEmotionReappraisedEvent", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    spyOn(Adapters.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(Adapters.AI.AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await policy.detect(mocks.NegativeEmotionExtremeIntensityReappraisedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmGeneratedEvent]);
  });

  test("onEmotionReappraisedEvent - respects DailyAlarmLimit", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    spyOn(Adapters.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(Adapters.AI.AiGateway, "check").mockResolvedValue({
      violations: [
        { bucket: mocks.userDailyBucket, limit: AI.QuotaLimit.parse(10), id: "USER_DAILY", used: 10 },
      ],
    });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.detect(mocks.NegativeEmotionExtremeIntensityReappraisedEvent),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("onEmotionReappraisedEvent - respects EntryAlarmLimit", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    spyOn(Adapters.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    spyOn(Adapters.AI.AiGateway, "check").mockResolvedValue({
      violations: [
        {
          bucket: mocks.emotionsAlarmEntryBucket,
          limit: AI.QuotaLimit.parse(2),
          id: "EMOTIONS_ALARM_ENTRY",
          used: 2,
        },
      ],
    });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.detect(mocks.NegativeEmotionExtremeIntensityReappraisedEvent),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });
});
