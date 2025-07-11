import type * as Events from "+emotions/events";
import type * as VO from "+emotions/value-objects";

export type AlarmApplicableCheckOutputType = {
  applicable: true;
  name: VO.AlarmNameOption;
};

type AlarmNotApplicableCheckOutputType = {
  applicable: false;
  name: VO.AlarmNameOption;
};

export type AlarmCheckOutputType = AlarmApplicableCheckOutputType | AlarmNotApplicableCheckOutputType;

export type AlarmEventToBeChecked = Events.EmotionLoggedEventType | Events.EmotionReappraisedEventType;

export abstract class Alarm {
  abstract name: VO.AlarmNameOption;

  abstract check(event: AlarmEventToBeChecked): AlarmCheckOutputType;
}
