import * as Repos from "+emotions/repositories";
import * as Services from "+emotions/services";
import * as VO from "+emotions/value-objects";

// TODO tests
export class AlarmNotificationFactory {
  static async create(
    detection: Services.Alarms.AlarmDetection,
    advice: VO.Advice,
  ): Promise<Services.NotificationTemplate> {
    if (detection.trigger.type === VO.AlarmTriggerEnum.entry) {
      const entry = await Repos.EntryRepository.getByIdRaw(detection.trigger.entryId);

      const composer = new Services.EntryAlarmAdviceNotificationComposer(entry);

      return composer.compose(advice);
    }

    throw new Error("Unknown alarm trigger type");
  }
}
