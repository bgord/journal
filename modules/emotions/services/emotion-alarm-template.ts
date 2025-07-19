import type * as Events from "+emotions/events";
import { AlarmDetection } from "+emotions/value-objects/alarm-detection";
import { AlarmNameOption } from "+emotions/value-objects/alarm-name-option";

export type AlarmEventToBeChecked = Events.EmotionLoggedEventType | Events.EmotionReappraisedEventType;

export abstract class EmotionAlarmTemplate {
  abstract name: AlarmNameOption;

  abstract check(event: AlarmEventToBeChecked): AlarmDetection | null;
}
