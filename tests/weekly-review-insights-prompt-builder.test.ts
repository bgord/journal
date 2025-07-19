// cspell:disable
import { describe, expect, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("WeeklyReviewInsightsPromptBuilder", () => {
  test("generate", () => {
    const builder = new Emotions.Services.WeeklyReviewInsightsPromptBuilder([mocks.fullEntry]);

    expect(builder.generate()).toEqual(
      new Emotions.Services.Prompt("Generate insights for these 1 entries."),
    );
  });
});
