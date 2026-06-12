import * as bg from "@bgord/bun";
import type * as Emotions from "+emotions";
import { GenerateAlarmCommand } from "../commands/GENERATE_ALARM_COMMAND";
import { EMOTION_LOGGED_EVENT } from "../events/EMOTION_LOGGED_EVENT";
import { EMOTION_REAPPRAISED_EVENT } from "../events/EMOTION_REAPPRAISED_EVENT";
import { EmotionAlarmDetector } from "../services/emotion-alarm-detector";
import { NegativeEmotionExtremeIntensityAlarm } from "../services/negative-emotion-extreme-intensity-alarm";

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
    deps.EventBus.on(EMOTION_LOGGED_EVENT, deps.EventHandler.handle(this.detect.bind(this)));
    deps.EventBus.on(EMOTION_REAPPRAISED_EVENT, deps.EventHandler.handle(this.detect.bind(this)));
  }
  // Stryker restore all

  async detect(event: Emotions.Events.EmotionLoggedEventType | Emotions.Events.EmotionReappraisedEventType) {
    const detection = EmotionAlarmDetector.detect({
      event,
      alarms: [NegativeEmotionExtremeIntensityAlarm],
    });

    if (!detection) return;

    const command = bg.command(
      GenerateAlarmCommand,
      { payload: { detection, userId: event.payload.userId } },
      this.deps,
    );

    await this.deps.CommandBus.emit(command);
  }
}
