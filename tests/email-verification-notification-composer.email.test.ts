import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import { bootstrap } from "+infra/bootstrap";

describe("EmailVerificationNotificationComposer", async () => {
  const di = await bootstrap();

  test("compose", () => {
    const composer = new Auth.Services.EmailVerificationNotificationComposer(di.Env.BETTER_AUTH_URL);
    const notification = composer.compose(v.parse(tools.UrlWithoutSlash, "http://example.com"));

    expect(notification).toEqual({
      subject: v.parse(bg.MailerSubject, "Verify your Journal account"),
      html: v.parse(
        bg.MailerContentHtml,
        `<p>Click to verify: <a href="http://example.com/?callbackURL=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Flogin">Verify</a></p>`,
      ),
    });
  });
});
