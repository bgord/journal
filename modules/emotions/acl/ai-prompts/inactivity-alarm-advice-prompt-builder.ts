import * as AI from "+ai";
import type * as Emotions from "+emotions";
import type { LanguagesType } from "+languages";

const content: Record<LanguagesType, (trigger: Emotions.VO.InactivityAlarmTriggerType) => string> = {
  en: (trigger: Emotions.VO.InactivityAlarmTriggerType) => `Inactive for ${trigger.inactivityDays} days`,
  pl: (trigger: Emotions.VO.InactivityAlarmTriggerType) =>
    `Brak aktywności przez ${trigger.inactivityDays} dni`,
};

export class InactivityAlarmAdvicePromptBuilder {
  constructor(
    private readonly trigger: Emotions.VO.InactivityAlarmTriggerType,
    private readonly language: LanguagesType,
  ) {}

  generate(): AI.Prompt {
    return new AI.Prompt(content[this.language](this.trigger));
  }
}
