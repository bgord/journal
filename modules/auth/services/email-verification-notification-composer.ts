import * as tools from "@bgord/tools";
import { Env } from "+infra/env";

export class EmailVerificationNotificationComposer {
  compose(url: string): tools.NotificationTemplate {
    console.log(url);
    console.log({ callback: `${Env.BETTER_AUTH_URL}/auth/login` });
    console.log({ BETTER_AUTH_URL: Env.BETTER_AUTH_URL });

    const callbackUrl = new URL(url);
    callbackUrl.searchParams.set("callbackURL", `${Env.BETTER_AUTH_URL}/auth/login`);

    console.log("link", callbackUrl.toString());

    return new tools.NotificationTemplate(
      "Verify your Journal account",
      `<p>Click to verify: <a href="${callbackUrl.toString()}">Verify</a></p>`,
    );
  }
}
