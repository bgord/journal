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
    this.eventBus.on(Events.EMOTION_LOGGED_EVENT, this.detect.bind(this));
    this.eventBus.on(Events.EMOTION_REAPPRAISED_EVENT, this.detect.bind(this));
  }

  async detect(event: Events.EmotionLoggedEventType | Events.EmotionReappraisedEventType) {
    const detection = Services.EmotionAlarmDetector.detect({
      event,
      alarms: [Services.NegativeEmotionExtremeIntensityAlarm],
    });

    if (!detection) return;

    const command = Commands.GenerateAlarmCommand.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      name: Commands.GENERATE_ALARM_COMMAND,
      createdAt: tools.Timestamp.parse(Date.now()),
      payload: { detection, userId: event.payload.userId },
    } satisfies Commands.GenerateAlarmCommandType);

    await CommandBus.emit(command.name, command);
  }
}
