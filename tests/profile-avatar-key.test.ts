import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Preferences from "+preferences";
import * as mocks from "./mocks";

describe("ProfileAvatarKeyFactory", () => {
  test("happy path", () => {
    expect(Preferences.VO.ProfileAvatarKeyFactory.stable(mocks.userId)).toEqual(
      tools.ObjectKey.parse(`users/${mocks.userId}/avatar.webp`),
    );
  });
});
