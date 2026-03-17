import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";

const url = v.parse(tools.UrlWithoutSlash, "http://example.com");

describe("PasswordResetNotificationComposer", () => {
  test("compose", () => {
    const composer = new Auth.Services.PasswordResetNotificationComposer();
    const notification = composer.compose(url);

    expect(notification).toEqual({
      subject: v.parse(bg.MailerSubject, "Reset your Journal password"),
      html: v.parse(
        bg.MailerContentHtml,
        `<p>Click to reset your password: <a href="${url}">Reset password</a></p>`,
      ),
    });
  });
});
