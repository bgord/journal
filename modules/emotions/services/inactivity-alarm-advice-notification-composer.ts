import * as tools from "@bgord/tools";
import type * as AI from "+ai";
import { SupportedLanguages } from "+languages";
import type * as VO from "+emotions/value-objects";

const notification: Record<
  SupportedLanguages,
  (trigger: VO.InactivityAlarmTriggerType, advice: AI.Advice) => tools.NotificationTemplate
> = {
  [SupportedLanguages.en]: (trigger: VO.InactivityAlarmTriggerType, advice: AI.Advice) =>
    new tools.NotificationTemplate(
      "Inactivity advice",
      `Inactive for ${trigger.inactivityDays} days, advice: ${advice.get()}`,
    ),
  [SupportedLanguages.pl]: (trigger: VO.InactivityAlarmTriggerType, advice: AI.Advice) =>
    new tools.NotificationTemplate(
      "Porada dla braku aktywności",
      `Brak aktywności przez ${trigger.inactivityDays} dni, porada: ${advice.get()}`,
    ),
};

export class InactivityAlarmAdviceNotificationComposer {
  constructor(
    private readonly trigger: VO.InactivityAlarmTriggerType,
    private readonly language: SupportedLanguages,
  ) {}

  compose(advice: AI.Advice): tools.NotificationTemplate {
    return notification[this.language](this.trigger, advice);
  }
}
