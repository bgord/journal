import * as tools from "@bgord/tools";

export class EmailVerificationNotificationComposer {
  compose(url: string): tools.NotificationTemplate {
    const callbackUrl = new URL(url);
    callbackUrl.searchParams.set("callbackURL", "http://localhost:5173");

    return new tools.NotificationTemplate(
      "Verify your Journal account",
      `<p>Click to verify: <a href="${callbackUrl.toString()}">Verify</a></p>`,
    );
  }
}
