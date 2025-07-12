import { describe, expect, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("WeeklyReviewInsightsPrompt", () => {
  test("generate", () => {
    const prompt = new Emotions.Services.WeeklyReviewInsightsPrompt([mocks.fullEntry]);

    expect(prompt.generate()).toEqual([
      {
        role: "system",
        content: "You are a compassionate mental health coach providing short, practical advice.",
      },
      {
        role: "user",
        content: "Generate insights for these 1 entries.",
      },
    ]);
  });
});
