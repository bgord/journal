import { AlarmEventToBeChecked, EmotionAlarmTemplate } from "+emotions/services/emotion-alarm-template";
import type * as VO from "+emotions/value-objects";
import * as tools from "@bgord/tools";

type AlarmGeneratorConfigType = {
  event: AlarmEventToBeChecked;
  alarms: tools.Constructor<EmotionAlarmTemplate>[];
};

export class EmotionAlarmDetector {
  static detect(config: AlarmGeneratorConfigType): VO.AlarmDetection | null {
    const result = config.alarms
      .map((Alarm) => new Alarm().check(config.event))
      .filter((result) => result !== null);

    if (!result.length) return null;

    if (!result[0]) return null;

    return result[0];
  }
}
