import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import type * as Buses from "+app/ports";

type AcceptedEvent = Emotions.Events.EmotionLoggedEventType | Emotions.Events.EmotionReappraisedEventType;
type AcceptedCommand = Emotions.Commands.GenerateAlarmCommandType;

export class EntryAlarmDetector {
  constructor(
    EventBus: Buses.EventBusLike<AcceptedEvent>,
    EventHandler: bg.EventHandler,
    private readonly CommandBus: Buses.CommandBusLike<AcceptedCommand>,
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

    await this.CommandBus.emit(command.name, command);
  }
}
