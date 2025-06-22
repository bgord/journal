import * as VO from "../../value-objects";

export abstract class Alarm {
  abstract name: VO.AlarmName;

  abstract check(): boolean;
}
