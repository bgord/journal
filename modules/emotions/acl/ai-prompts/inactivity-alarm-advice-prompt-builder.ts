import * as AI from "+ai";
import type * as Emotions from "+emotions";

export class InactivityAlarmAdvicePromptBuilder {
  constructor(private readonly trigger: Emotions.VO.InactivityAlarmTriggerType) {}

  generate(): AI.Prompt {
    const content = `Inactive for ${this.trigger.inactivityDays} days`;

    return new AI.Prompt(content);
  }
}
