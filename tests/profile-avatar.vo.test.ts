import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Preferences from "+preferences";
import * as mocks from "./mocks";

describe("ProfileAvatar", () => {
  test("MimeRegistry", () => {
    expect(Preferences.VO.ProfileAvatar.MimeRegistry.entries).toEqual([
      tools.Mimes.png,
      tools.Mimes.jpg,
      tools.Mimes.webp,
    ]);
  });

  test("key", () => {
    expect(Preferences.VO.ProfileAvatar.key(mocks.userId)).toEqual(mocks.objectKey);
  });
});
