import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import type { EventBusLike } from "+app/ports";
import type { CommandBus } from "+infra/command-bus";

type AcceptedEvent = Emotions.Events.EmotionLoggedEventType | Emotions.Events.EmotionReappraisedEventType;

export class EntryAlarmDetector {
  constructor(
    EventBus: EventBusLike<AcceptedEvent>,
    private readonly commandBus: typeof CommandBus,
    EventHandler: bg.EventHandler,
  ) {
    EventBus.on(Emotions.Events.EMOTION_LOGGED_EVENT, EventHandler.handle(this.detect.bind(this)));
    EventBus.on(Emotions.Events.EMOTION_REAPPRAISED_EVENT, EventHandler.handle(this.detect.bind(this)));
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

    await this.commandBus.emit(command.name, command);
  }
}
