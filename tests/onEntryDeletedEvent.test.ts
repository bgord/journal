import { describe, expect, jest, spyOn, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("onEntryDeletedEvent", () => {
  test("should call repository deleteEntry method with the event", async () => {
    const deleteEntry = spyOn(Emotions.Repos.EntryRepository, "deleteEntry").mockImplementation(jest.fn());

    await Emotions.EventHandlers.onEntryDeletedEvent(mocks.GenericEntryDeletedEvent);

    expect(deleteEntry).toHaveBeenCalledTimes(1);
    expect(deleteEntry).toHaveBeenCalledWith(mocks.GenericEntryDeletedEvent);
  });
});
