import * as Events from "+emotions/events";
import * as Alarms from "+emotions/services/alarms";
import * as VO from "+emotions/value-objects";

/** @public */
export class NegativeEmotionExtremeIntensityAlarm extends Alarms.Alarm {
  name = VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM;

  check(event: Alarms.AlarmEventToBeChecked): Alarms.AlarmCheckOutputType {
    switch (event.name) {
      case Events.EMOTION_LOGGED_EVENT: {
        const emotionLabel = new VO.EmotionLabel(event.payload.label);
        const emotionIntensity = new VO.EmotionIntensity(event.payload.intensity);

        return {
          applicable: emotionLabel.isNegative() && emotionIntensity.isExtreme(),
          name: this.name,
        };
      }
      case Events.EMOTION_REAPPRAISED_EVENT: {
        const emotionLabel = new VO.EmotionLabel(event.payload.newLabel);
        const emotionIntensity = new VO.EmotionIntensity(event.payload.newIntensity);

        return {
          applicable: emotionLabel.isNegative() && emotionIntensity.isExtreme(),
          name: this.name,
        };
      }
      default:
        return { applicable: false, name: this.name };
    }
  }
}
