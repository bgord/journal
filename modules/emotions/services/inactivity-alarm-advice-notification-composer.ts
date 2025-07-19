import type * as VO from "+emotions/value-objects";

export class InactivityAlarmAdviceNotificationComposer {
  constructor(private readonly trigger: VO.InactivityAlarmTriggerType) {}

  compose(advice: VO.Advice) {
    return {
      subject: "Inactivity advice",
      content: `Inactive for ${this.trigger.inactivityDays} days, advice: ${advice.get()}`,
    };
  }
}
