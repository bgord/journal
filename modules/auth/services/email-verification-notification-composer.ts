import * as tools from "@bgord/tools";

export class EmailVerificationNotificationComposer {
  constructor(private readonly BETTER_AUTH_URL: string) {}

  compose(url: string): tools.NotificationTemplate {
    const callbackUrl = new URL(url);
    callbackUrl.searchParams.set("callbackURL", `${this.BETTER_AUTH_URL}/auth/login`);

    return new tools.NotificationTemplate(
      "Verify your Journal account",
      `<p>Click to verify: <a href="${callbackUrl.toString()}">Verify</a></p>`,
    );
  }
}
