import { describe, expect, jest, spyOn, test } from "bun:test";
import * as infra from "../infra";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const detection: Emotions.Services.Alarms.AlarmApplicableCheckOutputType = {
  name: Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
  applicable: true,
};

describe("AlarmCreator", () => {
  test("correct path", async () => {
    spyOn(Emotions.Repos.AlarmRepository, "getCreatedTodayCount").mockResolvedValue(0);
    const eventStoreSave = spyOn(infra.EventStore, "save").mockImplementation(jest.fn());

    await Emotions.Services.AlarmCreator.create(detection.name, mocks.id);

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmGeneratedEvent]);

    jest.restoreAllMocks();
  });

  test("correct path - at the limit", async () => {
    spyOn(Emotions.Repos.AlarmRepository, "getCreatedTodayCount").mockResolvedValue(4);
    const eventStoreSave = spyOn(infra.EventStore, "save").mockImplementation(jest.fn());

    await Emotions.Services.AlarmCreator.create(detection.name, mocks.id);

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmGeneratedEvent]);

    jest.restoreAllMocks();
  });

  test("DailyAlarmLimit - at the limit", async () => {
    spyOn(Emotions.Repos.AlarmRepository, "getCreatedTodayCount").mockResolvedValue(5);
    const eventStoreSave = spyOn(infra.EventStore, "save").mockImplementation(jest.fn());

    expect(async () => Emotions.Services.AlarmCreator.create(detection.name, mocks.id)).toThrow(
      Emotions.Policies.DailyAlarmLimit.error,
    );

    expect(eventStoreSave).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });
});
