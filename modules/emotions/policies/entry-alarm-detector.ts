import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";

type AcceptedEvent = Emotions.Events.EmotionLoggedEventType | Emotions.Events.EmotionReappraisedEventType;
type AcceptedCommand = Emotions.Commands.GenerateAlarmCommandType;

export class EntryAlarmDetector {
  constructor(
    EventBus: bg.EventBusLike<AcceptedEvent>,
    EventHandler: bg.EventHandler,
    private readonly CommandBus: bg.CommandBusLike<AcceptedCommand>,
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
      ...bg.createCommandEnvelope(),
      name: Emotions.Commands.GENERATE_ALARM_COMMAND,
      payload: { detection, userId: event.payload.userId },
    } satisfies Emotions.Commands.GenerateAlarmCommandType);

    await this.CommandBus.emit(command.name, command);
  }
}
