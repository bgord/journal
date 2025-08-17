import { describe, expect, test } from "bun:test";
import * as Emotions from "+emotions";
import * as mocks from "./mocks";

describe("NegativeEmotionExtremeIntensityAlarm", () => {
  test("true - EMOTION_LOGGED_EVENT", () => {
    const result = Emotions.Services.EmotionAlarmDetector.detect({
      event: mocks.NegativeEmotionExtremeIntensityLoggedEvent,
      alarms: [Emotions.Services.NegativeEmotionExtremeIntensityAlarm],
    });
    expect(result).toEqual(mocks.entryDetection);
  });

  test("true - EMOTION_REAPPRAISED_EVENT", () => {
    const result = Emotions.Services.EmotionAlarmDetector.detect({
      event: mocks.NegativeEmotionExtremeIntensityReappraisedEvent,
      alarms: [Emotions.Services.NegativeEmotionExtremeIntensityAlarm],
    });
    expect(result).toEqual(mocks.entryDetection);
  });

  test("false", () => {
    const result = Emotions.Services.EmotionAlarmDetector.detect({
      event: mocks.GenericEmotionLoggedEvent,
      alarms: [Emotions.Services.NegativeEmotionExtremeIntensityAlarm],
    });
    expect(result).toEqual(null);
  });

  test("false", () => {
    const result = Emotions.Services.EmotionAlarmDetector.detect({
      event: mocks.GenericEmotionReappraisedEvent,
      alarms: [Emotions.Services.NegativeEmotionExtremeIntensityAlarm],
    });
    expect(result).toEqual(null);
  });
});
