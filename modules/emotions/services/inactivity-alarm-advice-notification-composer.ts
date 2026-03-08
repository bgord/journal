import * as bg from "@bgord/bun";
import type * as AI from "+ai";
import type { LanguagesType } from "+languages";
import type * as VO from "+emotions/value-objects";

const notification: Record<
  LanguagesType,
  (trigger: VO.InactivityAlarmTriggerType, advice: AI.Advice) => bg.MailerTemplateMessage
> = {
  en: (trigger: VO.InactivityAlarmTriggerType, advice: AI.Advice) => ({
    subject: bg.MailerSubject.parse("JOURNAL - inactivity advice"),
    html: bg.MailerContentHtml.parse(`Inactive for ${trigger.inactivityDays} days, advice: ${advice.get()}`),
  }),
  pl: (trigger: VO.InactivityAlarmTriggerType, advice: AI.Advice) => ({
    subject: bg.MailerSubject.parse("JOURNAL - porada dla braku aktywności"),
    html: bg.MailerContentHtml.parse(
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
