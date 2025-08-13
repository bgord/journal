import { describe, expect, test } from "bun:test";
import { SupportedLanguages } from "../infra/i18n";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("WeeklyReviewInsightsPromptBuilder", () => {
  test("generate - en", () => {
    const prompt = new Emotions.ACL.AiPrompts.WeeklyReviewInsightsPromptBuilder(
      [mocks.fullEntry],
      SupportedLanguages.en,
    ).generate();

    expect(prompt.read()).toEqual([
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

  test("generate - pl", () => {
    const prompt = new Emotions.ACL.AiPrompts.WeeklyReviewInsightsPromptBuilder(
      [mocks.fullEntry],
      SupportedLanguages.pl,
    ).generate();

    expect(prompt.read()).toEqual([
      {
        role: "system",
        content: "You are a compassionate mental health coach providing short, practical advice.",
      },
      {
        role: "user",
        content: "Podsumuj te 1 wpisów.",
      },
    ]);
  });
});
