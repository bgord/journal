import * as Events from "+emotions/events";
import * as Alarms from "+emotions/services/alarms";
import * as VO from "+emotions/value-objects";

/** @public */
export class NegativeEmotionExtremeIntensityAlarm extends Alarms.EmotionAlarmTemplate {
  name = VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM;

  check(event: Alarms.AlarmEventToBeChecked): Alarms.AlarmDetection | null {
    const trigger = VO.EntryAlarmTrigger.parse({
      type: VO.AlarmTriggerEnum.entry,
      entryId: event.payload.entryId,
    } satisfies VO.EntryAlarmTriggerType);

    switch (event.name) {
      case Events.EMOTION_LOGGED_EVENT: {
        const emotionLabel = new VO.EmotionLabel(event.payload.label);
        const emotionIntensity = new VO.EmotionIntensity(event.payload.intensity);

        const applicable = emotionLabel.isNegative() && emotionIntensity.isExtreme();

        if (!applicable) return null;

        return new Alarms.AlarmDetection(trigger, this.name);
      }
      case Events.EMOTION_REAPPRAISED_EVENT: {
        const emotionLabel = new VO.EmotionLabel(event.payload.newLabel);
        const emotionIntensity = new VO.EmotionIntensity(event.payload.newIntensity);

        const applicable = emotionLabel.isNegative() && emotionIntensity.isExtreme();

        if (!applicable) return null;

        return new Alarms.AlarmDetection(trigger, this.name);
      }
      default:
        return null;
    }
  }
}
