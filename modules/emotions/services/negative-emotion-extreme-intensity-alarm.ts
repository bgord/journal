import * as Emotions from "+emotions";

/** @public */
export class NegativeEmotionExtremeIntensityAlarm extends Emotions.Services.EmotionAlarmTemplate {
  name = Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM;

  check(event: Emotions.Services.AlarmEventToBeChecked): Emotions.VO.AlarmDetection | null {
    const trigger = Emotions.VO.EntryAlarmTrigger.parse({
      type: Emotions.VO.AlarmTriggerEnum.entry,
      entryId: event.payload.entryId,
    } satisfies Emotions.VO.EntryAlarmTriggerType);

    switch (event.name) {
      case Emotions.Events.EMOTION_LOGGED_EVENT: {
        const emotionLabel = new Emotions.VO.EmotionLabel(event.payload.label);
        const emotionIntensity = new Emotions.VO.EmotionIntensity(event.payload.intensity);

        const applicable = emotionLabel.isNegative() && emotionIntensity.isExtreme();

        if (!applicable) return null;

        return new Emotions.VO.AlarmDetection(trigger, this.name);
      }
      case Emotions.Events.EMOTION_REAPPRAISED_EVENT: {
        const emotionLabel = new Emotions.VO.EmotionLabel(event.payload.newLabel);
        const emotionIntensity = new Emotions.VO.EmotionIntensity(event.payload.newIntensity);

        const applicable = emotionLabel.isNegative() && emotionIntensity.isExtreme();

        if (!applicable) return null;

        return new Emotions.VO.AlarmDetection(trigger, this.name);
      }
      default:
        return null;
    }
  }
}
