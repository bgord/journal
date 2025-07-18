import type * as Events from "+emotions/events";
import type * as VO from "+emotions/value-objects";
import type { AlarmTriggerType } from "./alarm-trigger";

export type AlarmApplicableCheckOutputType = {
  applicable: true;
  trigger: AlarmTriggerType;
  name: VO.AlarmNameOption;
};

type AlarmNotApplicableCheckOutputType = {
  applicable: false;
  name: VO.AlarmNameOption;
};

export type AlarmCheckOutputType = AlarmApplicableCheckOutputType | AlarmNotApplicableCheckOutputType;

export type AlarmEventToBeChecked = Events.EmotionLoggedEventType | Events.EmotionReappraisedEventType;

export abstract class AlarmTemplate {
  abstract name: VO.AlarmNameOption;

  abstract check(event: AlarmEventToBeChecked): AlarmCheckOutputType;
}
