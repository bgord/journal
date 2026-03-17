import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";

type AcceptedEvent = Emotions.Events.EmotionLoggedEventType | Emotions.Events.EmotionReappraisedEventType;
type AcceptedCommand = Emotions.Commands.GenerateAlarmCommandType;

type Dependencies = {
  EventBus: bg.EventBusPort<AcceptedEvent>;
  EventHandler: bg.EventHandlerStrategy;
  CommandBus: bg.CommandBusPort<AcceptedCommand>;
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

    const command = bg.command(
      Emotions.Commands.GenerateAlarmCommand,
      { payload: { detection, userId: event.payload.userId } },
      this.deps,
    );

    await this.deps.CommandBus.emit(command);
  }
}
