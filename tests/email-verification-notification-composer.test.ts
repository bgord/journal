import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Auth from "+auth";

describe("EmailVerificationNotificationComposer", () => {
  test("compose", () => {
    const composer = new Auth.Services.EmailVerificationNotificationComposer();
    const notification = composer.compose("http://example.com");

    expect(notification).toEqual(
      new tools.NotificationTemplate(
        "Verify your Journal account",
        `<p>Click to verify: <a href="http://example.com/?callbackURL=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Flogin">Verify</a></p>`,
      ),
    );
  });
});
