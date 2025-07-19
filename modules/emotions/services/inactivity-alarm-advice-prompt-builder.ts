import * as VO from "+emotions/value-objects";

export class InactivityAlarmAdvicePromptBuilder {
  constructor(private readonly trigger: VO.InactivityAlarmTriggerType) {}

  generate(): VO.Prompt {
    const content = `Inactive for ${this.trigger.inactivityDays} days`;

    return new VO.Prompt(content);
  }
}
