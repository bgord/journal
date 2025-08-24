import * as AI from "+ai";
import type * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";

const content: Record<SupportedLanguages, (trigger: Emotions.VO.InactivityAlarmTriggerType) => string> = {
  [SupportedLanguages.en]: (trigger: Emotions.VO.InactivityAlarmTriggerType) =>
    `Inactive for ${trigger.inactivityDays} days`,
  [SupportedLanguages.pl]: (trigger: Emotions.VO.InactivityAlarmTriggerType) =>
    `Brak aktywności przez ${trigger.inactivityDays} dni`,
};

export class InactivityAlarmAdvicePromptBuilder {
  constructor(
    private readonly trigger: Emotions.VO.InactivityAlarmTriggerType,
    private readonly language: SupportedLanguages,
  ) {}

  generate(): AI.Prompt {
    return new AI.Prompt(content[this.language](this.trigger));
  }
}
