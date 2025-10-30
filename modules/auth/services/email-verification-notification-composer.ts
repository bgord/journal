import * as tools from "@bgord/tools";
import { Env } from "+infra/env";

export class EmailVerificationNotificationComposer {
  compose(url: string): tools.NotificationTemplate {
    const callbackUrl = new URL(url);
    callbackUrl.searchParams.set("callbackURL", `${Env.BETTER_AUTH_URL}/auth/login`);

    return new tools.NotificationTemplate(
      "Verify your Journal account",
      `<p>Click to verify: <a href="${callbackUrl.toString()}">Verify</a></p>`,
    );
  }
}
