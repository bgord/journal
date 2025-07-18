import * as Commands from "+emotions/commands";
import * as Events from "+emotions/events";
import * as Services from "+emotions/services";
import { CommandBus } from "+infra/command-bus";
import type { EventBus } from "+infra/event-bus";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export class EntryAlarmDetector {
  constructor(private readonly eventBus: typeof EventBus) {}

  register() {
    // TODO: merge into one detect method
    this.eventBus.on(Events.EMOTION_LOGGED_EVENT, this.onEmotionLoggedEvent.bind(this));
    this.eventBus.on(Events.EMOTION_REAPPRAISED_EVENT, this.onEmotionReappraisedEvent.bind(this));
  }

  async onEmotionLoggedEvent(event: Events.EmotionLoggedEventType) {
    const detection = Services.AlarmDetector.detect({
      event,
      alarms: [Services.Alarms.NegativeEmotionExtremeIntensityAlarm],
    });

    if (!detection) return;

    const command = Commands.GenerateAlarmCommand.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      name: Commands.GENERATE_ALARM_COMMAND,
      createdAt: tools.Timestamp.parse(Date.now()),
      payload: {
        alarmName: detection.name,
        trigger: detection.trigger,
        userId: event.payload.userId,
      },
    } satisfies Commands.GenerateAlarmCommandType);

    await CommandBus.emit(command.name, command);
  }

  async onEmotionReappraisedEvent(event: Events.EmotionReappraisedEventType) {
    const detection = Services.AlarmDetector.detect({
      event,
      alarms: [Services.Alarms.NegativeEmotionExtremeIntensityAlarm],
    });

    if (!detection) return;

    const command = Commands.GenerateAlarmCommand.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      name: Commands.GENERATE_ALARM_COMMAND,
      createdAt: tools.Timestamp.parse(Date.now()),
      payload: {
        alarmName: detection.name,
        trigger: detection.trigger,
        userId: event.payload.userId,
      },
    } satisfies Commands.GenerateAlarmCommandType);

    await CommandBus.emit(command.name, command);
  }
}
