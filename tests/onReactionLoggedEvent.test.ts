import { describe, expect, jest, spyOn, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("onReactionLoggedEvent", () => {
  test("should call repository logReaction method with the event", async () => {
    const logReaction = spyOn(Emotions.Repos.EntryRepository, "logReaction").mockImplementation(jest.fn());

    await Emotions.EventHandlers.onReactionLoggedEvent(mocks.GenericReactionLoggedEvent);

    expect(logReaction).toHaveBeenCalledTimes(1);
    expect(logReaction).toHaveBeenCalledWith(mocks.GenericReactionLoggedEvent);
  });
});
