import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";

export class PasswordResetNotificationComposer {
  compose(url: tools.UrlWithoutSlashType): bg.MailerTemplateMessage {
    return {
      subject: "Reset your Journal password",
      html: `<p>Click to reset your password: <a href="${url}">Reset password</a></p>`,
    };
  }
}
