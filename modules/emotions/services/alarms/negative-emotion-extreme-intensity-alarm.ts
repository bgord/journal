import * as Events from "+emotions/events";
import * as Alarms from "+emotions/services/alarms";
import * as VO from "+emotions/value-objects";

/** @public */
export class NegativeEmotionExtremeIntensityAlarm extends Alarms.AlarmTemplate {
  name = VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM;

  check(event: Alarms.AlarmEventToBeChecked): Alarms.AlarmCheckOutputType {
    const trigger = VO.EntryAlarmTrigger.parse({
      type: VO.AlarmTriggerEnum.entry,
      entryId: event.payload.entryId,
    } satisfies VO.EntryAlarmTriggerType);

    switch (event.name) {
      case Events.EMOTION_LOGGED_EVENT: {
        const emotionLabel = new VO.EmotionLabel(event.payload.label);
        const emotionIntensity = new VO.EmotionIntensity(event.payload.intensity);

        return {
          trigger,
          applicable: emotionLabel.isNegative() && emotionIntensity.isExtreme(),
          name: this.name,
        };
      }
      case Events.EMOTION_REAPPRAISED_EVENT: {
        const emotionLabel = new VO.EmotionLabel(event.payload.newLabel);
        const emotionIntensity = new VO.EmotionIntensity(event.payload.newIntensity);

        return {
          trigger,
          applicable: emotionLabel.isNegative() && emotionIntensity.isExtreme(),
          name: this.name,
        };
      }
      default:
        return { applicable: false, name: this.name };
    }
  }
}
