import { describe, expect, test } from "bun:test";

import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("Alarm", () => {
  test("create new aggregate", () => {
    expect(() => Emotions.Aggregates.Alarm.create(mocks.alarmId)).not.toThrow();
  });

  test("build new aggregate", () => {
    const emotionJournalEntry = Emotions.Aggregates.Alarm.build(mocks.alarmId, []);

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("generate - correct path", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, []);

    await alarm.generate(mocks.id, Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM);

    expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmGeneratedEvent]);
  });

  test("generate - AlarmGeneratedOnce", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent]);

    expect(async () =>
      alarm.generate(mocks.id, Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM),
    ).toThrow(Emotions.Policies.AlarmGeneratedOnce.error);

    expect(alarm.pullEvents()).toEqual([]);
  });
});
