import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";

export class EmailVerificationNotificationComposer {
  constructor(private readonly BETTER_AUTH_URL: tools.UrlWithoutSlashType) {}

  compose(url: tools.UrlWithoutSlashType): bg.MailerTemplateMessage {
    const callbackUrl = new URL(url);
    callbackUrl.searchParams.set("callbackURL", `${this.BETTER_AUTH_URL}/auth/login`);

    return {
      subject: "Verify your Journal account",
      html: `<p>Click to verify: <a href="${callbackUrl.toString()}">Verify</a></p>`,
    };
  }
}
