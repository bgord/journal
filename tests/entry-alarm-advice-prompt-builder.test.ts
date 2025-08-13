// cspell:disable
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+infra/i18n";
import { describe, expect, test } from "bun:test";
import * as mocks from "./mocks";

describe("EntryAlarmAdvicePromptBuilder", () => {
  test("situation + emotion (en)", () => {
    const builder = new Emotions.ACL.AiPrompts.EntryAlarmAdvicePromptBuilder(
      mocks.partialEntry,
      Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
      SupportedLanguages.en,
    );

    expect(builder.generate()).toEqual(
      new AI.Prompt(
        "Here is a summary of an entry from my AI journal app, it triggered an NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM alarm. Situation (achievement): I finished a project, at work. Emotion: anger, intensity 5/5. As a compassionate mental health coach, please suggest two brief coping strategies for this situation.",
      ),
    );
  });

  test("situation + emotion + reaction (en)", () => {
    const builder = new Emotions.ACL.AiPrompts.EntryAlarmAdvicePromptBuilder(
      mocks.fullEntry,
      Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
      SupportedLanguages.en,
    );

    expect(builder.generate()).toEqual(
      new AI.Prompt(
        "Here is a summary of an entry from my AI journal app, it triggered an NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM alarm. Situation (achievement): I finished a project, at work. Emotion: anger, intensity 5/5. Reaction (avoidance): Got drunk, intensity 1/5. As a compassionate mental health coach, please suggest two brief coping strategies for this situation.",
      ),
    );
  });

  test("situation + emotion (pl)", () => {
    const builder = new Emotions.ACL.AiPrompts.EntryAlarmAdvicePromptBuilder(
      mocks.partialEntry,
      Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
      SupportedLanguages.pl,
    );

    expect(builder.generate()).toEqual(
      new AI.Prompt(
        "Oto podsumowanie wpisu z mojej aplikacji dziennika AI, który wywołał alarm NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM. Sytuacja (achievement): I finished a project, w work. Emocja: anger, intensywność 5/5. Jako współczujący coach zdrowia psychicznego, proszę, zasugeruj dwie krótkie strategie radzenia sobie z tą sytuacją.",
      ),
    );
  });

  test("situation + emotion + reaction (pl)", () => {
    const builder = new Emotions.ACL.AiPrompts.EntryAlarmAdvicePromptBuilder(
      mocks.fullEntry,
      Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
      SupportedLanguages.pl,
    );

    expect(builder.generate()).toEqual(
      new AI.Prompt(
        "Oto podsumowanie wpisu z mojej aplikacji dziennika AI, który wywołał alarm NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM. Sytuacja (achievement): I finished a project, w work. Emocja: anger, intensywność 5/5. Reakcja (avoidance): Got drunk, skuteczność 1/5. Jako współczujący coach zdrowia psychicznego, proszę, zasugeruj dwie krótkie strategie radzenia sobie z tą sytuacją.",
      ),
    );
  });
});
