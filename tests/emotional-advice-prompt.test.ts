// cspell:disable
import { describe, expect, test } from "bun:test";
import { SupportedLanguages } from "../infra/i18n";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("EmotionalAdvicePrompt", () => {
  test("situation + emotion (en)", () => {
    const prompt = new Emotions.Services.EmotionalAdvicePrompt(
      mocks.partialEntry,
      Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
      SupportedLanguages.en,
    );

    expect(prompt.generate()).toEqual([
      {
        role: "system",
        content: "You are a compassionate mental health coach providing short, practical advice.",
      },
      {
        role: "user",
        content:
          "Here is a summary of an entry from my AI journal app, it triggered an NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM alarm. Situation (achievement): I finished a project, at work. Emotion: anger, intensity 5/5. As a compassionate mental health coach, please suggest two brief coping strategies for this situation.",
      },
    ]);
  });

  test("situation + emotion + reaction (en)", () => {
    const prompt = new Emotions.Services.EmotionalAdvicePrompt(
      mocks.fullEntry,
      Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
      SupportedLanguages.en,
    );

    expect(prompt.generate()).toEqual([
      {
        role: "system",
        content: "You are a compassionate mental health coach providing short, practical advice.",
      },
      {
        role: "user",
        content:
          "Here is a summary of an entry from my AI journal app, it triggered an NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM alarm. Situation (achievement): I finished a project, at work. Emotion: anger, intensity 5/5. Reaction (avoidance): Got drunk, intensity 1/5. As a compassionate mental health coach, please suggest two brief coping strategies for this situation.",
      },
    ]);
  });

  test("situation + emotion (pl)", () => {
    const prompt = new Emotions.Services.EmotionalAdvicePrompt(
      mocks.partialEntry,
      Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
      SupportedLanguages.pl,
    );

    expect(prompt.generate()).toEqual([
      {
        role: "system",
        content: "You are a compassionate mental health coach providing short, practical advice.",
      },
      {
        role: "user",
        content:
          "Oto podsumowanie wpisu z mojej aplikacji dziennika AI, który wywołał alarm NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM. Sytuacja (achievement): I finished a project, w work. Emocja: anger, intensywność 5/5. Jako współczujący coach zdrowia psychicznego, proszę, zasugeruj dwie krótkie strategie radzenia sobie z tą sytuacją.",
      },
    ]);
  });

  test("situation + emotion + reaction (pl)", () => {
    const prompt = new Emotions.Services.EmotionalAdvicePrompt(
      mocks.fullEntry,
      Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
      SupportedLanguages.pl,
    );

    expect(prompt.generate()).toEqual([
      {
        role: "system",
        content: "You are a compassionate mental health coach providing short, practical advice.",
      },
      {
        role: "user",
        content:
          "Oto podsumowanie wpisu z mojej aplikacji dziennika AI, który wywołał alarm NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM. Sytuacja (achievement): I finished a project, w work. Emocja: anger, intensywność 5/5. Reakcja (avoidance): Got drunk, skuteczność 1/5. Jako współczujący coach zdrowia psychicznego, proszę, zasugeruj dwie krótkie strategie radzenia sobie z tą sytuacją.",
      },
    ]);
  });
});
