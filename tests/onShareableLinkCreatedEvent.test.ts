import { describe, expect, jest, spyOn, test } from "bun:test";
import * as Publishing from "../modules/publishing";
import * as mocks from "./mocks";

describe("onShareableLinkCreatedEvent", () => {
  test("should call repository create method with the event", async () => {
    const create = spyOn(Publishing.Repos.ShareableLinkRepository, "create").mockImplementation(jest.fn());

    await Publishing.EventHandlers.onShareableLinkCreatedEvent(mocks.GenericShareableLinkCreatedEvent);

    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith(mocks.GenericShareableLinkCreatedEvent);
  });
});
