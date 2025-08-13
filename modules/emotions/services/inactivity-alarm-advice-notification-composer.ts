import * as AI from "+ai";
import * as VO from "+emotions/value-objects";

export class InactivityAlarmAdviceNotificationComposer {
  constructor(private readonly trigger: VO.InactivityAlarmTriggerType) {}

  compose(advice: AI.Advice): VO.NotificationTemplate {
    return new VO.NotificationTemplate(
      "Inactivity advice",
      `Inactive for ${this.trigger.inactivityDays} days, advice: ${advice.get()}`,
    );
  }
}
