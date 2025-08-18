import * as AI from "+ai";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import { EntrySnapshotPort } from "+emotions/ports";

export class AlarmPromptFactory {
  constructor(private readonly entrySnapshot: EntrySnapshotPort) {}

  async create(detection: Emotions.VO.AlarmDetection): Promise<AI.Prompt> {
    switch (detection.trigger.type) {
      case Emotions.VO.AlarmTriggerEnum.entry: {
        const entry = await this.entrySnapshot.getById(detection.trigger.entryId);
        const language = entry?.language as SupportedLanguages;

        return new Emotions.ACL.AiPrompts.EntryAlarmAdvicePromptBuilder(
          entry as Emotions.VO.EntrySnapshot,
          detection.name,
          language,
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
