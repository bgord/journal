import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type { LanguagesType } from "+languages";

const notification: Record<LanguagesType, (week: tools.Week) => bg.MailerTemplateMessage> = {
  en: (week: tools.Week) => ({
    subject: v.parse(
      bg.MailerSubject,
      `JOURNAL - weekly review ${tools.DateFormatter.date(week.getStart())} - ${tools.DateFormatter.date(week.getEnd())}`,
    ),
    html: v.parse(bg.MailerContentHtml, "Find the file attached"),
  }),
  pl: (week: tools.Week) => ({
    subject: v.parse(
      bg.MailerSubject,
      `JOURNAL - przegląd tygodnia ${tools.DateFormatter.date(week.getStart())} - ${tools.DateFormatter.date(week.getEnd())}`,
    ),
    html: v.parse(bg.MailerContentHtml, "Plik w załączniku"),
  }),
};

export class WeeklyReviewExportNotificationComposer {
  compose(week: tools.Week, language: LanguagesType): bg.MailerTemplateMessage {
    return notification[language](week);
  }
}
