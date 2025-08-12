// cspell:disable
import * as AI from "+ai";
import { describe, expect, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("InactivityAlarmAdvicePromptBuilder", () => {
  test("generate", () => {
    const builder = new Emotions.Services.InactivityAlarmAdvicePromptBuilder(mocks.inactivityTrigger);

    expect(builder.generate()).toEqual(
      new AI.Prompt(`Inactive for ${mocks.inactivityTrigger.inactivityDays} days`),
    );
  });
});
