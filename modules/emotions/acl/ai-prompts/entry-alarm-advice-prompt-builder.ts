// cspell:disable
import * as AI from "+ai";
import type * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";

const content: Record<
  SupportedLanguages,
  (entry: Emotions.VO.EntrySnapshot, alarmName: Emotions.VO.AlarmNameOption) => string
> = {
  [SupportedLanguages.en]: (entry: Emotions.VO.EntrySnapshot, alarmName: Emotions.VO.AlarmNameOption) => {
    let content = `Here is a summary of an entry from my AI journal app, it triggered an ${alarmName} alarm. `;

    content += `Situation (${entry.situationKind}): ${entry.situationDescription}, at ${entry.situationLocation}. `;
    content += `Emotion: ${entry.emotionLabel}, intensity ${entry.emotionIntensity}/5. `;
    if (entry.reactionType) {
      content += `Reaction (${entry.reactionType}): ${entry.reactionDescription}, intensity ${entry.reactionEffectiveness}/5. `;
    }

    content +=
      "As a compassionate mental health coach, please suggest two brief coping strategies for this situation.";

    return content;
  },

  [SupportedLanguages.pl]: (entry: Emotions.VO.EntrySnapshot, alarmName: Emotions.VO.AlarmNameOption) => {
    let content = `Oto podsumowanie wpisu z mojej aplikacji dziennika AI, który wywołał alarm ${alarmName}. `;

    content += `Sytuacja (${entry.situationKind}): ${entry.situationDescription}, w ${entry.situationLocation}. `;
    content += `Emocja: ${entry.emotionLabel}, intensywność ${entry.emotionIntensity}/5. `;
    if (entry.reactionType) {
      content += `Reakcja (${entry.reactionType}): ${entry.reactionDescription}, skuteczność ${entry.reactionEffectiveness}/5. `;
    }

    content +=
      "Jako współczujący coach zdrowia psychicznego, proszę, zasugeruj dwie krótkie strategie radzenia sobie z tą sytuacją.";

    return content;
  },
};

export class EntryAlarmAdvicePromptBuilder {
  constructor(
    private readonly entry: Emotions.VO.EntrySnapshot,
    private readonly alarmName: Emotions.VO.AlarmNameOption,
    private readonly language: SupportedLanguages,
  ) {}

  generate(): AI.Prompt {
    return new AI.Prompt(content[this.language](this.entry, this.alarmName));
  }
}
