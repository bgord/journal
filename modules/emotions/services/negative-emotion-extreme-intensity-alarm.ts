import * as v from "valibot";
import type * as Emotions from "+emotions";
import { EMOTION_LOGGED_EVENT } from "../events/EMOTION_LOGGED_EVENT";
import { EMOTION_REAPPRAISED_EVENT } from "../events/EMOTION_REAPPRAISED_EVENT";
import { EmotionAlarmTemplate } from "../services/emotion-alarm-template";
import { AlarmDetection } from "../value-objects/alarm-detection";
import { AlarmNameOption } from "../value-objects/alarm-name-option";
import { AlarmTriggerEnum, EntryAlarmTrigger } from "../value-objects/alarm-trigger";
import { EmotionIntensity } from "../value-objects/emotion-intensity";
import { EmotionLabel } from "../value-objects/emotion-label";

export class NegativeEmotionExtremeIntensityAlarm extends EmotionAlarmTemplate {
  name = AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM;

  check(event: Emotions.Services.AlarmEventToBeChecked): Emotions.VO.AlarmDetection | null {
    switch (event.name) {
      case EMOTION_LOGGED_EVENT: {
        const trigger = v.parse(EntryAlarmTrigger, {
          type: AlarmTriggerEnum.entry,
          entryId: event.payload.entryId,
        } satisfies Emotions.VO.EntryAlarmTriggerType);

        const emotionLabel = new EmotionLabel(event.payload.label);
        const emotionIntensity = new EmotionIntensity(event.payload.intensity);

        const applicable = emotionLabel.isNegative() && emotionIntensity.isExtreme();

        if (!applicable) return null;

        return new AlarmDetection(trigger, this.name);
      }
      case EMOTION_REAPPRAISED_EVENT: {
        const trigger = v.parse(EntryAlarmTrigger, {
          type: AlarmTriggerEnum.entry,
          entryId: event.payload.entryId,
        } satisfies Emotions.VO.EntryAlarmTriggerType);

        const emotionLabel = new EmotionLabel(event.payload.newLabel);
        const emotionIntensity = new EmotionIntensity(event.payload.newIntensity);

        const applicable = emotionLabel.isNegative() && emotionIntensity.isExtreme();

        if (!applicable) return null;

        return new AlarmDetection(trigger, this.name);
      }
      default:
        return null;
    }
  }
}
