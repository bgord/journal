import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { CommandBus } from "+infra/command-bus";
import type { EventBus } from "+infra/event-bus";

export class EntryAlarmDetector {
  constructor(private readonly eventBus: typeof EventBus) {
    this.eventBus.on(Emotions.Events.EMOTION_LOGGED_EVENT, this.detect.bind(this));
    this.eventBus.on(Emotions.Events.EMOTION_REAPPRAISED_EVENT, this.detect.bind(this));
  }

  async detect(event: Emotions.Events.EmotionLoggedEventType | Emotions.Events.EmotionReappraisedEventType) {
    const detection = Emotions.Services.EmotionAlarmDetector.detect({
      event,
      alarms: [Emotions.Services.NegativeEmotionExtremeIntensityAlarm],
    });

    if (!detection) return;

    const command = Emotions.Commands.GenerateAlarmCommand.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      name: Emotions.Commands.GENERATE_ALARM_COMMAND,
      createdAt: tools.Time.Now().value,
      payload: { detection, userId: event.payload.userId },
    } satisfies Emotions.Commands.GenerateAlarmCommandType);

    await CommandBus.emit(command.name, command);
  }
}
