import type { AlarmNameOption } from "./alarm-name-option";
import type { AlarmTriggerType } from "./alarm-trigger";

export class AlarmDetection {
  constructor(
    readonly trigger: AlarmTriggerType,
    readonly name: AlarmNameOption,
  ) {}
}
