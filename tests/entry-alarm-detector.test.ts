import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { EventBus } from "../infra/event-bus";
import { EventStore } from "../infra/event-store";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("EntryAlarmDetector", () => {
  test("onEmotionLoggedEvent", async () => {
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.alarmId);
    spyOn(Emotions.Queries.CountTodaysAlarmsForUser, "execute").mockResolvedValue({ count: 0 });
    spyOn(Emotions.Queries.CountAlarmsForEntry, "execute").mockResolvedValue(0);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.EntryAlarmDetector(EventBus);

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.detect(mocks.NegativeEmotionExtremeIntensityLoggedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmGeneratedEvent]);
  });

  test("onEmotionLoggedEvent - respects DailyAlarmLimit", async () => {
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.alarmId);
    spyOn(Emotions.Queries.CountTodaysAlarmsForUser, "execute").mockResolvedValue({ count: 10 });
    spyOn(Emotions.Queries.CountAlarmsForEntry, "execute").mockResolvedValue(0);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.EntryAlarmDetector(EventBus);

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      expect(async () => saga.detect(mocks.NegativeEmotionExtremeIntensityLoggedEvent)).toThrow(
        Emotions.Invariants.DailyAlarmLimit.error,
      ),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("onEmotionLoggedEvent - respects EntryAlarmLimit", async () => {
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.alarmId);
    spyOn(Emotions.Queries.CountTodaysAlarmsForUser, "execute").mockResolvedValue({ count: 0 });
    spyOn(Emotions.Queries.CountAlarmsForEntry, "execute").mockResolvedValue(2);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.EntryAlarmDetector(EventBus);

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      expect(async () => saga.detect(mocks.NegativeEmotionExtremeIntensityLoggedEvent)).toThrow(
        Emotions.Invariants.EntryAlarmLimit.error,
      ),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("onEmotionReappraisedEvent", async () => {
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.alarmId);
    spyOn(Emotions.Queries.CountTodaysAlarmsForUser, "execute").mockResolvedValue({ count: 0 });
    spyOn(Emotions.Queries.CountAlarmsForEntry, "execute").mockResolvedValue(0);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.EntryAlarmDetector(EventBus);

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.detect(mocks.NegativeEmotionExtremeIntensityReappraisedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmGeneratedEvent]);
  });

  test("onEmotionReappraisedEvent - respects DailyAlarmLimit", async () => {
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.alarmId);
    spyOn(Emotions.Queries.CountTodaysAlarmsForUser, "execute").mockResolvedValue({ count: 10 });
    spyOn(Emotions.Queries.CountAlarmsForEntry, "execute").mockResolvedValue(0);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.EntryAlarmDetector(EventBus);

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      expect(async () => saga.detect(mocks.NegativeEmotionExtremeIntensityReappraisedEvent)).toThrow(
        Emotions.Invariants.DailyAlarmLimit.error,
      ),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("onEmotionReappraisedEvent - respects EntryAlarmLimit", async () => {
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.alarmId);
    spyOn(Emotions.Queries.CountTodaysAlarmsForUser, "execute").mockResolvedValue({ count: 0 });
    spyOn(Emotions.Queries.CountAlarmsForEntry, "execute").mockResolvedValue(2);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.EntryAlarmDetector(EventBus);

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      expect(async () => saga.detect(mocks.NegativeEmotionExtremeIntensityReappraisedEvent)).toThrow(
        Emotions.Invariants.EntryAlarmLimit.error,
      ),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });
});
