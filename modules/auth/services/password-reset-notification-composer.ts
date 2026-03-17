import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import * as v from "valibot";

export class PasswordResetNotificationComposer {
  compose(url: tools.UrlWithoutSlashType): bg.MailerTemplateMessage {
    return {
      subject: v.parse(bg.MailerSubject, "Reset your Journal password"),
      html: v.parse(
        bg.MailerContentHtml,
        `<p>Click to reset your password: <a href="${url}">Reset password</a></p>`,
      ),
    };
  }
}
