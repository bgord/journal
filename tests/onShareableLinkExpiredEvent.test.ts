import { describe, expect, jest, spyOn, test } from "bun:test";
import * as Publishing from "../modules/publishing";
import * as mocks from "./mocks";

describe("onShareableLinkExpiredEvent", () => {
  test("should call repository expire method with the event", async () => {
    const expire = spyOn(Publishing.Repos.ShareableLinkRepository, "expire").mockImplementation(jest.fn());

    await Publishing.EventHandlers.onShareableLinkExpiredEvent(mocks.GenericShareableLinkExpiredEvent);

    expect(expire).toHaveBeenCalledTimes(1);
    expect(expire).toHaveBeenCalledWith(mocks.GenericShareableLinkExpiredEvent);
  });
});
