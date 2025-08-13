import * as AI from "+ai";
import * as Repos from "+emotions/repositories";
import * as VO from "+emotions/value-objects";
import { SupportedLanguages } from "+infra/i18n";
import { EntryAlarmAdvicePromptBuilder } from "./entry-alarm-advice-prompt-builder";
import { InactivityAlarmAdvicePromptBuilder } from "./inactivity-alarm-advice-prompt-builder";

export class AlarmPromptFactory {
  static async create(detection: VO.AlarmDetection): Promise<AI.Prompt> {
    switch (detection.trigger.type) {
      case VO.AlarmTriggerEnum.entry: {
        const entry = await Repos.EntryRepository.getByIdRaw(detection.trigger.entryId);
        const language = entry.language as SupportedLanguages;

        return new EntryAlarmAdvicePromptBuilder(entry, detection.name, language).generate();
      }

      case VO.AlarmTriggerEnum.inactivity: {
        return new InactivityAlarmAdvicePromptBuilder(detection.trigger).generate();
      }

      default:
        throw new Error("Unknown alarm trigger type");
    }
  }
}
