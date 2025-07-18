import type * as Events from "+emotions/events";
import type * as VO from "+emotions/value-objects";

// TODO: cleanup
// trigger and name should travel together
// alarm-factory and so on

export class AlarmDetection {
  constructor(
    readonly trigger: VO.AlarmTriggerType,
    readonly name: VO.AlarmNameOption,
  ) {}
}

export type AlarmEventToBeChecked = Events.EmotionLoggedEventType | Events.EmotionReappraisedEventType;

export abstract class AlarmTemplate {
  abstract name: VO.AlarmNameOption;

  abstract check(event: AlarmEventToBeChecked): AlarmDetection | null;
}
