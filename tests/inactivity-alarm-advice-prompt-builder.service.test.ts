// cspell:disable
import { describe, expect, test } from "bun:test";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { languages } from "+languages";
import * as mocks from "./mocks";

describe("InactivityAlarmAdvicePromptBuilder", () => {
  test("generate - en", () => {
    const builder = new Emotions.ACL.AiPrompts.InactivityAlarmAdvicePromptBuilder(
      mocks.inactivityTrigger,
      languages.supported.en,
    );

    expect(builder.generate()).toEqual(
      new AI.Prompt(`Inactive for ${mocks.inactivityTrigger.inactivityDays} days`),
    );
  });

  test("generate - pl", () => {
    const builder = new Emotions.ACL.AiPrompts.InactivityAlarmAdvicePromptBuilder(
      mocks.inactivityTrigger,
      languages.supported.pl,
    );

    expect(builder.generate()).toEqual(
      new AI.Prompt(`Brak aktywności przez ${mocks.inactivityTrigger.inactivityDays} dni`),
    );
  });
});
