import * as bg from "@bgord/bun";
import * as v from "valibot";
import type * as AI from "+ai";
import type { LanguagesType } from "+languages";
import type * as VO from "+emotions/value-objects";

const notification: Record<
  LanguagesType,
  (trigger: VO.InactivityAlarmTriggerType, advice: AI.Advice) => bg.MailerTemplateMessage
> = {
  en: (trigger: VO.InactivityAlarmTriggerType, advice: AI.Advice) => ({
    subject: v.parse(bg.MailerSubject, "JOURNAL - inactivity advice"),
    html: v.parse(
      bg.MailerContentHtml,
      `Inactive for ${trigger.inactivityDays} days, advice: ${advice.get()}`,
    ),
  }),
  pl: (trigger: VO.InactivityAlarmTriggerType, advice: AI.Advice) => ({
    subject: v.parse(bg.MailerSubject, "JOURNAL - porada dla braku aktywności"),
    html: v.parse(
      bg.MailerContentHtml,
      `Brak aktywności przez ${trigger.inactivityDays} dni, porada: ${advice.get()}`,
    ),
  }),
};

export class InactivityAlarmAdviceNotificationComposer {
  constructor(
    private readonly trigger: VO.InactivityAlarmTriggerType,
    private readonly language: LanguagesType,
  ) {}

  compose(advice: AI.Advice): bg.MailerTemplateMessage {
    return notification[this.language](this.trigger, advice);
  }
}
