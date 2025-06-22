import type * as Events from "../../events";
import * as VO from "../../value-objects";

export type AlarmCheckOutputType = Events.AlarmGeneratedEventType | null;

export type AlarmEventToBeChecked = Events.EmotionLoggedEventType | Events.ReactionLoggedEventType;

export abstract class Alarm {
  abstract name: VO.AlarmName;

  abstract check(event: AlarmEventToBeChecked): AlarmCheckOutputType;
}
