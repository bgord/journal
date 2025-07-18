import type * as Events from "+emotions/events";
import type * as VO from "+emotions/value-objects";

export class AlarmDetection {
  constructor(
    readonly trigger: VO.AlarmTriggerType,
    readonly name: VO.AlarmNameOption,
  ) {}
}

export type AlarmEventToBeChecked = Events.EmotionLoggedEventType | Events.EmotionReappraisedEventType;

export abstract class EmotionAlarmTemplate {
  abstract name: VO.AlarmNameOption;

  abstract check(event: AlarmEventToBeChecked): AlarmDetection | null;
}
