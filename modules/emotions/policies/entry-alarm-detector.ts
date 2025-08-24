import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";

type AcceptedEvent = Emotions.Events.EmotionLoggedEventType | Emotions.Events.EmotionReappraisedEventType;
type AcceptedCommand = Emotions.Commands.GenerateAlarmCommandType;

type Dependencies = {
  EventBus: bg.EventBusLike<AcceptedEvent>;
  EventHandler: bg.EventHandler;
  CommandBus: bg.CommandBusLike<AcceptedCommand>;
};

export class EntryAlarmDetector {
  constructor(private readonly DI: Dependencies) {
    DI.EventBus.on(Emotions.Events.EMOTION_LOGGED_EVENT, DI.EventHandler.handle(this.detect.bind(this)));
    DI.EventBus.on(Emotions.Events.EMOTION_REAPPRAISED_EVENT, DI.EventHandler.handle(this.detect.bind(this)));
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

    await this.DI.CommandBus.emit(command.name, command);
  }
}
