import * as Emotions from "+emotions";

export type AlarmEventToBeChecked =
  | Emotions.Events.EmotionLoggedEventType
  | Emotions.Events.EmotionReappraisedEventType;

export abstract class EmotionAlarmTemplate {
  abstract name: Emotions.VO.AlarmNameOption;

  abstract check(event: AlarmEventToBeChecked): Emotions.VO.AlarmDetection | null;
}
