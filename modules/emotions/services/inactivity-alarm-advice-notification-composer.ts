import type * as bg from "@bgord/bun";
import type * as AI from "+ai";
import { SupportedLanguages } from "+languages";
import type * as VO from "+emotions/value-objects";

const notification: Record<
  SupportedLanguages,
  (trigger: VO.InactivityAlarmTriggerType, advice: AI.Advice) => bg.MailerTemplateMessage
> = {
  [SupportedLanguages.en]: (trigger: VO.InactivityAlarmTriggerType, advice: AI.Advice) => ({
    subject: "JOURNAL - inactivity advice",
    html: `Inactive for ${trigger.inactivityDays} days, advice: ${advice.get()}`,
  }),
  [SupportedLanguages.pl]: (trigger: VO.InactivityAlarmTriggerType, advice: AI.Advice) => ({
    subject: "JOURNAL - porada dla braku aktywności",
    html: `Brak aktywności przez ${trigger.inactivityDays} dni, porada: ${advice.get()}`,
  }),
};

export class InactivityAlarmAdviceNotificationComposer {
  constructor(
    private readonly trigger: VO.InactivityAlarmTriggerType,
    private readonly language: SupportedLanguages,
  ) {}

  compose(advice: AI.Advice): bg.MailerTemplateMessage {
    return notification[this.language](this.trigger, advice);
  }
}
