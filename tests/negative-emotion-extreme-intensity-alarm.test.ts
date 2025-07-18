import { describe, expect, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const detection = new Emotions.Services.Alarms.AlarmDetection(
  mocks.entryTrigger,
  Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
);

describe("NegativeEmotionExtremeIntensityAlarm", () => {
  test("true - EMOTION_LOGGED_EVENT", () => {
    const result = Emotions.Services.EmotionAlarmDetector.detect({
      event: mocks.NegativeEmotionExtremeIntensityLoggedEvent,
      alarms: [Emotions.Services.Alarms.NegativeEmotionExtremeIntensityAlarm],
    });

    expect(result).toEqual(detection);
  });

  test("true - EMOTION_REAPPRAISED_EVENT", () => {
    const result = Emotions.Services.EmotionAlarmDetector.detect({
      event: mocks.NegativeEmotionExtremeIntensityReappraisedEvent,
      alarms: [Emotions.Services.Alarms.NegativeEmotionExtremeIntensityAlarm],
    });

    expect(result).toEqual(detection);
  });

  test("false", () => {
    const result = Emotions.Services.EmotionAlarmDetector.detect({
      event: mocks.GenericEmotionLoggedEvent,
      alarms: [Emotions.Services.Alarms.NegativeEmotionExtremeIntensityAlarm],
    });

    expect(result).toEqual(null);
  });

  test("false", () => {
    const result = Emotions.Services.EmotionAlarmDetector.detect({
      event: mocks.GenericEmotionReappraisedEvent,
      alarms: [Emotions.Services.Alarms.NegativeEmotionExtremeIntensityAlarm],
    });

    expect(result).toEqual(null);
  });
});
