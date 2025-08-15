import * as tools from "@bgord/tools";
import * as AI from "+ai";
import * as VO from "+emotions/value-objects";

export class InactivityAlarmAdviceNotificationComposer {
  constructor(private readonly trigger: VO.InactivityAlarmTriggerType) {}

  compose(advice: AI.Advice): tools.NotificationTemplate {
    return new tools.NotificationTemplate(
      "Inactivity advice",
      `Inactive for ${this.trigger.inactivityDays} days, advice: ${advice.get()}`,
    );
  }
}
