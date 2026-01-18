import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { SupportedLanguages } from "+languages";

const notification: Record<SupportedLanguages, (week: tools.Week) => bg.MailerTemplateMessage> = {
  [SupportedLanguages.en]: (week: tools.Week) => ({
    subject: `JOURNAL - weekly review ${tools.DateFormatters.date(week.getStart().ms)} - ${tools.DateFormatters.date(week.getEnd().ms)}`,
    html: "Find the file attached",
  }),
  [SupportedLanguages.pl]: (week: tools.Week) => ({
    subject: `JOURNAL - przegląd tygodnia ${tools.DateFormatters.date(week.getStart().ms)} - ${tools.DateFormatters.date(week.getEnd().ms)}`,
    html: "Plik w załączniku",
  }),
};

export class WeeklyReviewExportNotificationComposer {
  compose(week: tools.Week, language: SupportedLanguages): bg.MailerTemplateMessage {
    return notification[language](week);
  }
}
