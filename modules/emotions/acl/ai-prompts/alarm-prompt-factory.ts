import type * as AI from "+ai";
import type * as Emotions from "+emotions";
import type { LanguagesType } from "+languages";
import type { EntrySnapshotPort } from "+emotions/ports";
import { AlarmTriggerEnum } from "../../value-objects/alarm-trigger";
import { EntryAlarmAdvicePromptBuilder } from "./entry-alarm-advice-prompt-builder";
import { InactivityAlarmAdvicePromptBuilder } from "./inactivity-alarm-advice-prompt-builder";

const AlarmPromptFactoryError = { UnknownTrigger: "alarm.prompt.factory.unknown.trigger" };

export class AlarmPromptFactory {
  constructor(
    private readonly entrySnapshot: EntrySnapshotPort,
    private readonly language: LanguagesType,
  ) {}

  async create(detection: Emotions.VO.AlarmDetection): Promise<AI.Prompt | null> {
    switch (detection.trigger.type) {
      case AlarmTriggerEnum.entry: {
        const entry = await this.entrySnapshot.getById(detection.trigger.entryId);

        if (!entry) return null;

        return new EntryAlarmAdvicePromptBuilder(entry, detection.name, this.language).generate();
      }

      case AlarmTriggerEnum.inactivity: {
        return new InactivityAlarmAdvicePromptBuilder(detection.trigger, this.language).generate();
      }

      default:
        throw new Error(AlarmPromptFactoryError.UnknownTrigger);
    }
  }
}
