import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { SupportedLanguages } from "+languages";

const notification: Record<SupportedLanguages, (week: tools.Week) => bg.MailerTemplateMessage> = {
  [SupportedLanguages.en]: (week: tools.Week) => ({
    subject: bg.MailerSubject.parse(
      `JOURNAL - weekly review ${tools.DateFormatters.date(week.getStart().ms)} - ${tools.DateFormatters.date(week.getEnd().ms)}`,
    ),
    html: bg.MailerContentHtml.parse("Come back and journal"),
  }),
  [SupportedLanguages.pl]: (week: tools.Week) => ({
    subject: bg.MailerSubject.parse(
      `JOURNAL - przegląd tygodnia ${tools.DateFormatters.date(week.getStart().ms)} - ${tools.DateFormatters.date(week.getEnd().ms)}`,
    ),
    html: bg.MailerContentHtml.parse("Wróć do nas"),
  }),
};

export class WeeklyReviewSkippedNotificationComposer {
  compose(week: tools.Week, language: SupportedLanguages): bg.MailerTemplateMessage {
    return notification[language](week);
  }
}
