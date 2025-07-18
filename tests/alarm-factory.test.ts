import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { EventStore } from "../infra/event-store";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const detection: Emotions.Services.Alarms.AlarmApplicableCheckOutputType = {
  trigger: mocks.entryTrigger,
  name: Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
  applicable: true,
};

describe("AlarmFactory", () => {
  test("correct path", async () => {
    spyOn(bg.NewUUID, "generate").mockReturnValue(mocks.alarmId);
    spyOn(Emotions.Queries.CountTodaysAlarmsForUser, "execute").mockResolvedValue(0);
    spyOn(Emotions.Queries.CountAlarmsForEntry, "execute").mockResolvedValue(0);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await Emotions.Services.AlarmFactory.create(detection.name, mocks.entryTrigger, mocks.userId);
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmGeneratedEvent]);

    jest.restoreAllMocks();
  });

  test("correct path - at the limit", async () => {
    spyOn(bg.NewUUID, "generate").mockReturnValue(mocks.alarmId);
    spyOn(Emotions.Queries.CountTodaysAlarmsForUser, "execute").mockResolvedValue(9);
    spyOn(Emotions.Queries.CountAlarmsForEntry, "execute").mockResolvedValue(1);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await Emotions.Services.AlarmFactory.create(detection.name, mocks.entryTrigger, mocks.userId);
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmGeneratedEvent]);

    jest.restoreAllMocks();
  });

  test("DailyAlarmLimit - above the limit", async () => {
    spyOn(Emotions.Queries.CountTodaysAlarmsForUser, "execute").mockResolvedValue(10);
    spyOn(Emotions.Queries.CountAlarmsForEntry, "execute").mockResolvedValue(0);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    expect(async () =>
      Emotions.Services.AlarmFactory.create(detection.name, mocks.entryTrigger, mocks.userId),
    ).toThrow(Emotions.Policies.DailyAlarmLimit.error);

    expect(eventStoreSave).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });

  test("EntryAlarmLimit - above the limit", async () => {
    spyOn(Emotions.Queries.CountTodaysAlarmsForUser, "execute").mockResolvedValue(0);
    spyOn(Emotions.Queries.CountAlarmsForEntry, "execute").mockResolvedValue(2);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    expect(async () =>
      Emotions.Services.AlarmFactory.create(detection.name, mocks.entryTrigger, mocks.userId),
    ).toThrow(Emotions.Policies.EntryAlarmLimit.error);

    expect(eventStoreSave).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });
});
