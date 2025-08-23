import * as tools from "@bgord/tools";
import type * as AI from "+ai";
import type { SupportedLanguages } from "+languages";
import type * as VO from "+emotions/value-objects";

export class InactivityAlarmAdviceNotificationComposer {
  constructor(
    private readonly trigger: VO.InactivityAlarmTriggerType,
    _language: SupportedLanguages,
  ) {}

  compose(advice: AI.Advice): tools.NotificationTemplate {
    return new tools.NotificationTemplate(
      "Inactivity advice",
      `Inactive for ${this.trigger.inactivityDays} days, advice: ${advice.get()}`,
    );
  }
}
