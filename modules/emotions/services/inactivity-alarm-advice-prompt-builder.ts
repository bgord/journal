import * as AI from "+ai";
import * as VO from "+emotions/value-objects";

export class InactivityAlarmAdvicePromptBuilder {
  constructor(private readonly trigger: VO.InactivityAlarmTriggerType) {}

  generate(): AI.Prompt {
    const content = `Inactive for ${this.trigger.inactivityDays} days`;

    return new AI.Prompt(content);
  }
}
