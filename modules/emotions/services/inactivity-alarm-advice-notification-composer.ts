import * as Services from "+emotions/services/notification-template";
import type * as VO from "+emotions/value-objects";

export class InactivityAlarmAdviceNotificationComposer {
  constructor(private readonly trigger: VO.InactivityAlarmTriggerType) {}

  compose(advice: VO.Advice): Services.NotificationTemplate {
    return new Services.NotificationTemplate(
      "Inactivity advice",
      `Inactive for ${this.trigger.inactivityDays} days, advice: ${advice.get()}`,
    );
  }
}
