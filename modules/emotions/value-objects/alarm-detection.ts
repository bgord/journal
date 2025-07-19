import type { AlarmNameOption } from "+emotions/value-objects/alarm-name-option";
import type { AlarmTriggerType } from "+emotions/value-objects/alarm-trigger";

export class AlarmDetection {
  constructor(
    readonly trigger: AlarmTriggerType,
    readonly name: AlarmNameOption,
  ) {}
}
