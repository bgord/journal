import type * as Schema from "../../../infra/schema";
import * as VO from "../value-objects";

export type EmotionalAdvicePromptType = [
  { role: "system"; content: string },
  { role: "user"; content: string },
];

export class EmotionalAdvicePrompt {
  constructor(
    private readonly entry: Schema.SelectEmotionJournalEntries,
    private readonly alarmName: VO.AlarmNameOption,
  ) {}

  generate(): EmotionalAdvicePromptType {
    const {
      situationKind,
      situationDescription,
      situationLocation,
      emotionLabel,
      emotionIntensity,
      reactionType,
      reactionDescription,
      reactionEffectiveness,
    } = this.entry;

    let content = `Here is a summary of a journal entry from my AI journal app, it triggered an ${this.alarmName} alarm. `;

    content += `Situation (${situationKind}): ${situationDescription}, at ${situationLocation}. `;
    content += `Emotion: ${emotionLabel}, intensity ${emotionIntensity}/5. `;
    if (reactionType) {
      content += `Reaction (${reactionType}): ${reactionDescription}, intensity ${reactionEffectiveness}/5. `;
    }

    content +=
      "As a compassionate mental health coach, please suggest two brief coping strategies for this situation.";

    return [
      {
        role: "system",
        content: "You are a compassionate mental health coach providing short, practical advice.",
      },
      { role: "user", content },
    ];
  }
}
