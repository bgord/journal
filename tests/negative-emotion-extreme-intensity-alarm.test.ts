import { describe, expect, test } from "bun:test";
import * as Emotions from "+emotions";
import * as mocks from "./mocks";

describe("NegativeEmotionExtremeIntensityAlarm", () => {
  test("EMOTION_LOGGED_EVENT - true", () => {
    const result = Emotions.Services.EmotionAlarmDetector.detect({
      event: mocks.NegativeEmotionExtremeIntensityLoggedEvent,
      alarms: [Emotions.Services.NegativeEmotionExtremeIntensityAlarm],
    });

    expect(result).toEqual(mocks.entryDetection);
  });

  test("EMOTION_LOGGED_EVENT - false - not negative, not extreme", () => {
    const result = Emotions.Services.EmotionAlarmDetector.detect({
      event: mocks.GenericEmotionLoggedEvent,
      alarms: [Emotions.Services.NegativeEmotionExtremeIntensityAlarm],
    });

    expect(result).toEqual(null);
  });

  test("EMOTION_LOGGED_EVENT - false - negative, not extreme", () => {
    const result = Emotions.Services.EmotionAlarmDetector.detect({
      event: mocks.NegativeEmotionLoggedEvent,
      alarms: [Emotions.Services.NegativeEmotionExtremeIntensityAlarm],
    });

    expect(result).toEqual(null);
  });

  test("EMOTION_REAPPRAISED_EVENT - true", () => {
    const result = Emotions.Services.EmotionAlarmDetector.detect({
      event: mocks.NegativeEmotionExtremeIntensityReappraisedEvent,
      alarms: [Emotions.Services.NegativeEmotionExtremeIntensityAlarm],
    });

    expect(result).toEqual(mocks.entryDetection);
  });

  test("EMOTION_REAPPRAISED_EVENT - false - not negative, not extreme", () => {
    const result = Emotions.Services.EmotionAlarmDetector.detect({
      event: mocks.GenericEmotionReappraisedEvent,
      alarms: [Emotions.Services.NegativeEmotionExtremeIntensityAlarm],
    });

    expect(result).toEqual(null);
  });

  test("EMOTION_REAPPRAISED_EVENT - false - negative, not extreme", () => {
    const result = Emotions.Services.EmotionAlarmDetector.detect({
      event: mocks.NegativeEmotionReappraisedEvent,
      alarms: [Emotions.Services.NegativeEmotionExtremeIntensityAlarm],
    });

    expect(result).toEqual(null);
  });

  test("result filtering", () => {
    class NoopAlarm extends Emotions.Services.EmotionAlarmTemplate {
      name = Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM;

      check(_event: Emotions.Events.EmotionReappraisedEventType): Emotions.VO.AlarmDetection | null {
        return null;
      }
    }

    const result = Emotions.Services.EmotionAlarmDetector.detect({
      event: mocks.NegativeEmotionExtremeIntensityReappraisedEvent,
      alarms: [NoopAlarm, Emotions.Services.NegativeEmotionExtremeIntensityAlarm],
    });

    expect(result).toEqual(mocks.entryDetection);
  });

  test("unknown event", () => {
    const result = Emotions.Services.EmotionAlarmDetector.detect({
      // @ts-expect-error
      event: mocks.GenericHourHasPassedEvent,
      alarms: [Emotions.Services.NegativeEmotionExtremeIntensityAlarm],
    });

    expect(result).toEqual(null);
  });
});
