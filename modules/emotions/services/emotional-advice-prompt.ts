// cspell:disable
import * as VO from "+emotions/value-objects";
import { SupportedLanguages } from "+infra/i18n";
import type * as Schema from "+infra/schema";

export type EmotionalAdvicePromptType = [
  { role: "system"; content: string },
  { role: "user"; content: string },
];

const content: Record<
  SupportedLanguages,
  (entry: Schema.SelectEntries, alarmName: VO.AlarmNameOption) => string
> = {
  [SupportedLanguages.en]: (entry: Schema.SelectEntries, alarmName: VO.AlarmNameOption) => {
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

  [SupportedLanguages.pl]: (entry: Schema.SelectEntries, alarmName: VO.AlarmNameOption) => {
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

export class EmotionalAdvicePrompt {
  constructor(
    private readonly entry: Schema.SelectEntries,
    private readonly alarmName: VO.AlarmNameOption,
    private readonly language: SupportedLanguages,
  ) {}

  generate(): EmotionalAdvicePromptType {
    return [
      {
        role: "system",
        content: "You are a compassionate mental health coach providing short, practical advice.",
      },
      { role: "user", content: content[this.language](this.entry, this.alarmName) },
    ];
  }
}
