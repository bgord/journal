import * as AI from "+ai";
import type * as Emotions from "+emotions";
import type { SupportedLanguages } from "+languages";

export class InactivityAlarmAdvicePromptBuilder {
  constructor(
    private readonly trigger: Emotions.VO.InactivityAlarmTriggerType,
    _language: SupportedLanguages,
  ) {}

  generate(): AI.Prompt {
    const content = `Inactive for ${this.trigger.inactivityDays} days`;

    return new AI.Prompt(content);
  }
}
