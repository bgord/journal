import * as Repos from "+emotions/repositories";
import * as Services from "+emotions/services";
import * as VO from "+emotions/value-objects";

export class AlarmNotificationFactory {
  static async create(detection: VO.AlarmDetection, advice: VO.Advice): Promise<VO.NotificationTemplate> {
    switch (detection.trigger.type) {
      case VO.AlarmTriggerEnum.entry: {
        const entry = await Repos.EntryRepository.getByIdRaw(detection.trigger.entryId);
        const composer = new Services.EntryAlarmAdviceNotificationComposer(entry);
        return composer.compose(advice);
      }

      case VO.AlarmTriggerEnum.inactivity: {
        const composer = new Services.InactivityAlarmAdviceNotificationComposer(detection.trigger);

        return composer.compose(advice);
      }

      default:
        throw new Error("Unknown alarm trigger type");
    }
  }
}
