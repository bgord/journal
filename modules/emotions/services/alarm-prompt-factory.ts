import * as Repos from "+emotions/repositories";
import * as Services from "+emotions/services";
import * as VO from "+emotions/value-objects";
import { SupportedLanguages } from "+infra/i18n";

export class AlarmPromptFactory {
  static async create(detection: Services.Alarms.AlarmDetection): Promise<VO.Prompt> {
    switch (detection.trigger.type) {
      case VO.AlarmTriggerEnum.entry: {
        const entry = await Repos.EntryRepository.getByIdRaw(detection.trigger.entryId);
        const language = entry.language as SupportedLanguages;

        return new Services.EntryAlarmAdvicePromptBuilder(entry, detection.name, language).generate();
      }

      case VO.AlarmTriggerEnum.inactivity: {
        return new Services.InactivityAlarmAdvicePromptBuilder(detection.trigger).generate();
      }

      default:
        throw new Error("Unknown alarm trigger type");
    }
  }
}
