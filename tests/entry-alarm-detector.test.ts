import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import * as mocks from "./mocks";

describe("EntryAlarmDetector", async () => {
  const di = await bootstrap();
  registerEventHandlers(di);
  registerCommandHandlers(di);
  const policy = new Emotions.Policies.EntryAlarmDetector({ ...di.Adapters.System, ...di.Tools });

  test("onEmotionLoggedEvent", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate()));
    spies.use(spyOn(di.Adapters.AI.AiGateway, "check").mockResolvedValue({ violations: [] }));

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.detect(mocks.NegativeEmotionExtremeIntensityLoggedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmGeneratedEvent]);
  });

  test("onEmotionLoggedEvent - respects DailyAlarmLimit", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate()));
    spies.use(
      spyOn(di.Adapters.AI.AiGateway, "check").mockResolvedValue({
        violations: [
          {
            bucket: mocks.userDailyBucket,
            limit: v.parse(AI.QuotaLimit, 10),
            id: "USER_DAILY",
            used: tools.Int.nonNegative(10),
          },
        ],
      }),
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.detect(mocks.NegativeEmotionExtremeIntensityLoggedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("onEmotionLoggedEvent - respects EntryAlarmLimit", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate()));
    spies.use(
      spyOn(di.Adapters.AI.AiGateway, "check").mockResolvedValue({
        violations: [
          {
            bucket: mocks.emotionsAlarmEntryBucket,
            limit: v.parse(AI.QuotaLimit, 2),
            id: "EMOTIONS_ALARM_ENTRY",
            used: tools.Int.nonNegative(2),
          },
        ],
      }),
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.detect(mocks.NegativeEmotionExtremeIntensityLoggedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("onEmotionReappraisedEvent", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate()));
    spies.use(spyOn(di.Adapters.AI.AiGateway, "check").mockResolvedValue({ violations: [] }));

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await policy.detect(mocks.NegativeEmotionExtremeIntensityReappraisedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmGeneratedEvent]);
  });

  test("onEmotionReappraisedEvent - respects DailyAlarmLimit", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate()));
    spies.use(
      spyOn(di.Adapters.AI.AiGateway, "check").mockResolvedValue({
        violations: [
          {
            bucket: mocks.userDailyBucket,
            limit: v.parse(AI.QuotaLimit, 10),
            id: "USER_DAILY",
            used: tools.Int.nonNegative(10),
          },
        ],
      }),
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.detect(mocks.NegativeEmotionExtremeIntensityReappraisedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("onEmotionReappraisedEvent - respects EntryAlarmLimit", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate()));
    spies.use(
      spyOn(di.Adapters.AI.AiGateway, "check").mockResolvedValue({
        violations: [
          {
            bucket: mocks.emotionsAlarmEntryBucket,
            limit: v.parse(AI.QuotaLimit, 2),
            id: "EMOTIONS_ALARM_ENTRY",
            used: tools.Int.nonNegative(2),
          },
        ],
      }),
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.detect(mocks.NegativeEmotionExtremeIntensityReappraisedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("no detection", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate()));
    spies.use(spyOn(di.Adapters.AI.AiGateway, "check").mockResolvedValue({ violations: [] }));

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.detect(mocks.GenericEmotionLoggedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });
});
