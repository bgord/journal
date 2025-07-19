import * as VO from "+emotions/value-objects";
import { Prompt } from "./prompt-template";

export class InactivityAlarmAdvicePromptBuilder {
  constructor(private readonly trigger: VO.InactivityAlarmTriggerType) {}

  generate(): Prompt {
    const content = `Inactive for ${this.trigger.inactivityDays} days`;

    return new Prompt(content);
  }
}
