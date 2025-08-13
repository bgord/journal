// cspell:disable
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { describe, expect, test } from "bun:test";
import * as mocks from "./mocks";

describe("InactivityAlarmAdvicePromptBuilder", () => {
  test("generate", () => {
    const builder = new Emotions.ACL.AiPrompts.InactivityAlarmAdvicePromptBuilder(mocks.inactivityTrigger);

    expect(builder.generate()).toEqual(
      new AI.Prompt(`Inactive for ${mocks.inactivityTrigger.inactivityDays} days`),
    );
  });
});
