import type * as Events from "../../events";
import * as VO from "../../value-objects";

export abstract class Alarm {
  abstract name: VO.AlarmName;

  abstract check(): Events.AlarmGeneratedEventType | null;
}
