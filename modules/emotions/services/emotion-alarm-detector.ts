import * as Emotions from "+emotions";
import * as tools from "@bgord/tools";

type AlarmGeneratorConfigType = {
  event: Emotions.Services.AlarmEventToBeChecked;
  alarms: tools.Constructor<Emotions.Services.EmotionAlarmTemplate>[];
};

export class EmotionAlarmDetector {
  static detect(config: AlarmGeneratorConfigType): Emotions.VO.AlarmDetection | null {
    const result = config.alarms
      .map((Alarm) => new Alarm().check(config.event))
      .filter((result) => result !== null);

    if (!result.length) return null;

    if (!result[0]) return null;

    return result[0];
  }
}
