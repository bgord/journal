import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import * as v from "valibot";
import type { LanguagesType } from "+languages";
import { DateFormatter } from "../../../df";

const notification: Record<LanguagesType, (week: tools.Week) => bg.MailerTemplateMessage> = {
  en: (week: tools.Week) => ({
    subject: v.parse(
      bg.MailerSubject,
      `JOURNAL - weekly review ${DateFormatter.date(week.getStart())} - ${DateFormatter.date(week.getEnd())}`,
    ),
    html: v.parse(bg.MailerContentHtml, "Come back and journal"),
  }),
  pl: (week: tools.Week) => ({
    subject: v.parse(
      bg.MailerSubject,
      `JOURNAL - przegląd tygodnia ${DateFormatter.date(week.getStart())} - ${DateFormatter.date(week.getEnd())}`,
    ),
    html: v.parse(bg.MailerContentHtml, "Wróć do nas"),
  }),
};

export class WeeklyReviewSkippedNotificationComposer {
  compose(week: tools.Week, language: LanguagesType): bg.MailerTemplateMessage {
    return notification[language](week);
  }
}
