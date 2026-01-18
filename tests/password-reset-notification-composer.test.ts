import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Auth from "+auth";

const url = tools.UrlWithoutSlash.parse("http://example.com");

describe("PasswordResetNotificationComposer", () => {
  test("compose", () => {
    const composer = new Auth.Services.PasswordResetNotificationComposer();
    const notification = composer.compose(url);

    expect(notification).toEqual({
      subject: bg.MailerSubject.parse("Reset your Journal password"),
      html: bg.MailerContentHtml.parse(
        `<p>Click to reset your password: <a href="${url}">Reset password</a></p>`,
      ),
    });
  });
});
