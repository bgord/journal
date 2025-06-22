import type * as Events from "../../events";
import type * as VO from "../../value-objects";

export type AlarmApplicableCheckOutputType = {
  applicable: true;
  name: VO.AlarmName;
};
export type AlarmNotApplicableCheckOutputType = {
  applicable: false;
  name: VO.AlarmName;
};

export type AlarmCheckOutputType = AlarmApplicableCheckOutputType | AlarmNotApplicableCheckOutputType;

export type AlarmEventToBeChecked = Events.EmotionLoggedEventType | Events.EmotionReappraisedEventType;

export abstract class Alarm {
  abstract name: VO.AlarmName;

  abstract check(event: AlarmEventToBeChecked): AlarmCheckOutputType;
}
