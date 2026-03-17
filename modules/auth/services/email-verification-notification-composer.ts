import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import * as v from "valibot";

export class EmailVerificationNotificationComposer {
  constructor(private readonly BETTER_AUTH_URL: tools.UrlWithoutSlashType) {}

  compose(url: tools.UrlWithoutSlashType): bg.MailerTemplateMessage {
    const callbackUrl = new URL(url);
    callbackUrl.searchParams.set("callbackURL", `${this.BETTER_AUTH_URL}/auth/login`);

    return {
      subject: v.parse(bg.MailerSubject, "Verify your Journal account"),
      html: v.parse(
        bg.MailerContentHtml,
        `<p>Click to verify: <a href="${callbackUrl.toString()}">Verify</a></p>`,
      ),
    };
  }
}
