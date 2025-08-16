import * as AI from "+ai";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+infra/i18n";
import { EntryAlarmAdvicePromptBuilder } from "./entry-alarm-advice-prompt-builder";
import { InactivityAlarmAdvicePromptBuilder } from "./inactivity-alarm-advice-prompt-builder";

export class AlarmPromptFactory {
  static async create(detection: Emotions.VO.AlarmDetection): Promise<AI.Prompt> {
    switch (detection.trigger.type) {
      case Emotions.VO.AlarmTriggerEnum.entry: {
        const entry = await Emotions.Repos.EntryRepository.getById(detection.trigger.entryId);
        const language = entry.language as SupportedLanguages;

        return new EntryAlarmAdvicePromptBuilder(entry, detection.name, language).generate();
      }

      case Emotions.VO.AlarmTriggerEnum.inactivity: {
        return new InactivityAlarmAdvicePromptBuilder(detection.trigger).generate();
      }

      default:
        throw new Error("Unknown alarm trigger type");
    }
  }
}
