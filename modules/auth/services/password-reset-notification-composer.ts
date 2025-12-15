import * as tools from "@bgord/tools";

export class PasswordResetNotificationComposer {
  compose(url: tools.UrlWithoutSlashType): tools.NotificationTemplate {
    return new tools.NotificationTemplate(
      "Reset your Journal password",
      `<p>Click to reset your password: <a href="${url}">Reset password</a></p>`,
    );
  }
}
