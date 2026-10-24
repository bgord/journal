import { describe, expect, test } from "bun:test";
import * as Preferences from "+preferences";
import * as mocks from "./mocks";

describe("ProfileAvatar", () => {
  test("key", () => {
    expect(Preferences.VO.ProfileAvatar.key(mocks.userId)).toEqual(mocks.objectKey);
  });
});
