import { describe, expect, jest, spyOn, test } from "bun:test";
import * as Publishing from "../modules/publishing";
import * as mocks from "./mocks";

describe("onShareableLinkRevokedEvent", () => {
  test("should call repository revoke method with the event", async () => {
    const revoke = spyOn(Publishing.Repos.ShareableLinkRepository, "revoke").mockImplementation(jest.fn());

    await Publishing.EventHandlers.onShareableLinkRevokedEvent(mocks.GenericShareableLinkRevokedEvent);

    expect(revoke).toHaveBeenCalledTimes(1);
    expect(revoke).toHaveBeenCalledWith(mocks.GenericShareableLinkRevokedEvent);
  });
});
