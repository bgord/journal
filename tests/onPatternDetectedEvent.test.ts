import { describe, expect, jest, spyOn, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("onPatternDetectedEvent", () => {
  test("LowCopingEffectivenessPatternDetectedEvent", async () => {
    const create = spyOn(Emotions.Repos.PatternsRepository, "create").mockImplementation(jest.fn());

    await Emotions.EventHandlers.onPatternDetectedEvent(mocks.LowCopingEffectivenessPatternDetectedEvent);

    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith(mocks.LowCopingEffectivenessPatternDetectedEvent);
  });

  test("MoreNegativeThanPositiveEmotionsPatternDetectedEvent", async () => {
    const create = spyOn(Emotions.Repos.PatternsRepository, "create").mockImplementation(jest.fn());

    await Emotions.EventHandlers.onPatternDetectedEvent(
      mocks.MoreNegativeThanPositiveEmotionsPatternDetectedEvent,
    );

    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith(mocks.MoreNegativeThanPositiveEmotionsPatternDetectedEvent);
  });

  test("MultipleMaladaptiveReactionsPatternDetectedEvent", async () => {
    const create = spyOn(Emotions.Repos.PatternsRepository, "create").mockImplementation(jest.fn());

    await Emotions.EventHandlers.onPatternDetectedEvent(
      mocks.MultipleMaladaptiveReactionsPatternDetectedEvent,
    );

    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith(mocks.MultipleMaladaptiveReactionsPatternDetectedEvent);
  });

  test("PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent", async () => {
    const create = spyOn(Emotions.Repos.PatternsRepository, "create").mockImplementation(jest.fn());

    await Emotions.EventHandlers.onPatternDetectedEvent(
      mocks.PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent,
    );

    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith(mocks.PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent);
  });
});
