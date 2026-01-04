import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";

type AcceptedEvent = Emotions.Events.EmotionLoggedEventType | Emotions.Events.EmotionReappraisedEventType;
type AcceptedCommand = Emotions.Commands.GenerateAlarmCommandType;

type Dependencies = {
  EventBus: bg.EventBusLike<AcceptedEvent>;
  EventHandler: bg.EventHandlerStrategy;
  CommandBus: bg.CommandBusLike<AcceptedCommand>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
};

export class EntryAlarmDetector {
  // Stryker disable all
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(Emotions.Events.EMOTION_LOGGED_EVENT, deps.EventHandler.handle(this.detect.bind(this)));
    deps.EventBus.on(
      Emotions.Events.EMOTION_REAPPRAISED_EVENT,
      deps.EventHandler.handle(this.detect.bind(this)),
    );
  }
  // Stryker restore all

  async detect(event: Emotions.Events.EmotionLoggedEventType | Emotions.Events.EmotionReappraisedEventType) {
    const detection = Emotions.Services.EmotionAlarmDetector.detect({
      event,
      alarms: [Emotions.Services.NegativeEmotionExtremeIntensityAlarm],
    });

    if (!detection) return;

    const command = Emotions.Commands.GenerateAlarmCommand.parse({
      ...bg.createCommandEnvelope(this.deps),
      name: Emotions.Commands.GENERATE_ALARM_COMMAND,
      payload: { detection, userId: event.payload.userId },
    } satisfies Emotions.Commands.GenerateAlarmCommandType);

    await this.deps.CommandBus.emit(command.name, command);
  }
}
