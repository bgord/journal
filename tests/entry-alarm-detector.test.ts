import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { AiGateway } from "+infra/adapters/ai";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
import { logger } from "+infra/logger";
import * as mocks from "./mocks";

const EventHandler = new bg.EventHandler(logger);
const policy = new Emotions.Policies.EntryAlarmDetector(EventBus, EventHandler);

describe("EntryAlarmDetector", () => {
  test("onEmotionLoggedEvent", async () => {
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.alarmId);
    spyOn(AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.detect(mocks.NegativeEmotionExtremeIntensityLoggedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmGeneratedEvent]);
  });

  test("onEmotionLoggedEvent - respects DailyAlarmLimit", async () => {
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.alarmId);
    spyOn(AiGateway, "check").mockResolvedValue({
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
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.alarmId);
    spyOn(AiGateway, "check").mockResolvedValue({
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
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.alarmId);
    spyOn(AiGateway, "check").mockResolvedValue({ violations: [] });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await policy.detect(mocks.NegativeEmotionExtremeIntensityReappraisedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmGeneratedEvent]);
  });

  test("onEmotionReappraisedEvent - respects DailyAlarmLimit", async () => {
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.alarmId);
    spyOn(AiGateway, "check").mockResolvedValue({
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
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.alarmId);
    spyOn(AiGateway, "check").mockResolvedValue({
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
