import type * as AI from "+ai";
import * as Emotions from "+emotions";
import type { SupportedLanguages } from "+languages";
import type { EntrySnapshotPort } from "+emotions/ports";

const AlarmPromptFactoryError = { UnknownTrigger: "alarm.prompt.factory.unknown.trigger" };

export class AlarmPromptFactory {
  constructor(
    private readonly entrySnapshot: EntrySnapshotPort,
    private readonly language: SupportedLanguages,
  ) {}

  async create(detection: Emotions.VO.AlarmDetection): Promise<AI.Prompt | null> {
    switch (detection.trigger.type) {
      case Emotions.VO.AlarmTriggerEnum.entry: {
        const entry = await this.entrySnapshot.getById(detection.trigger.entryId);

        if (!entry) return null;

        return new Emotions.ACL.AiPrompts.EntryAlarmAdvicePromptBuilder(
          entry,
          detection.name,
          this.language,
        ).generate();
      }

      case Emotions.VO.AlarmTriggerEnum.inactivity: {
        return new Emotions.ACL.AiPrompts.InactivityAlarmAdvicePromptBuilder(
          detection.trigger,
          this.language,
        ).generate();
      }

      default:
        throw new Error(AlarmPromptFactoryError.UnknownTrigger);
    }
  }
}
