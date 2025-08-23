import type * as AI from "+ai";
import * as Emotions from "+emotions";
import type { SupportedLanguages } from "+languages";
import type { EntrySnapshotPort } from "+emotions/ports";

export class AlarmPromptFactory {
  constructor(
    private readonly entrySnapshot: EntrySnapshotPort,
    private readonly language: SupportedLanguages,
  ) {}

  async create(detection: Emotions.VO.AlarmDetection): Promise<AI.Prompt> {
    switch (detection.trigger.type) {
      case Emotions.VO.AlarmTriggerEnum.entry: {
        const entry = await this.entrySnapshot.getById(detection.trigger.entryId);

        return new Emotions.ACL.AiPrompts.EntryAlarmAdvicePromptBuilder(
          entry as Emotions.VO.EntrySnapshot,
          detection.name,
          this.language,
        ).generate();
      }

      case Emotions.VO.AlarmTriggerEnum.inactivity: {
        return new Emotions.ACL.AiPrompts.InactivityAlarmAdvicePromptBuilder(detection.trigger).generate();
      }

      default:
        throw new Error("Unknown alarm trigger type");
    }
  }
}
