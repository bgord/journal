import type * as Aggregates from "../aggregates";
import * as VO from "../value-objects";

export type EmotionalAdvicePromptType = [
  { role: "system"; content: string },
  { role: "user"; content: string },
];

export class EmotionalAdvicePrompt {
  constructor(
    private readonly summary: Aggregates.EmotionJournalEntrySummary,
    private readonly alarmName: VO.AlarmNameOption,
  ) {}

  generate(): EmotionalAdvicePromptType {
    const { situation, emotion, reaction } = this.summary;

    let content = `Here is a summary of a journal entry from my AI journal app, it triggered an ${this.alarmName} alarm. `;

    content += `Situation (${situation?.kind}): ${situation?.description}, at ${situation?.location}. `;
    content += `Emotion: ${emotion?.label}, intensity ${emotion?.intensity}/5. `;
    if (reaction) {
      content += `Reaction (${reaction.type}): ${reaction.description}, intensity ${reaction.effectiveness}/5. `;
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
