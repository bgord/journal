import type * as bg from "@bgord/bun";
import type * as Emotions from "+emotions";
import { EMOTION_LOGGED_EVENT } from "../events/EMOTION_LOGGED_EVENT";
import { EMOTION_REAPPRAISED_EVENT } from "../events/EMOTION_REAPPRAISED_EVENT";
import { REACTION_EVALUATED_EVENT } from "../events/REACTION_EVALUATED_EVENT";
import { REACTION_LOGGED_EVENT } from "../events/REACTION_LOGGED_EVENT";
import { SITUATION_LOGGED_EVENT } from "../events/SITUATION_LOGGED_EVENT";

type AcceptedEvent =
  | Emotions.Events.SituationLoggedEventType
  | Emotions.Events.EmotionLoggedEventType
  | Emotions.Events.ReactionLoggedEventType
  | Emotions.Events.EmotionReappraisedEventType
  | Emotions.Events.ReactionEvaluatedEventType;

type Dependencies = {
  EventBus: bg.EventBusPort<AcceptedEvent>;
  EventHandler: bg.EventHandlerStrategy;
  HistoryWriter: bg.History.Ports.HistoryWriterPort;
  Clock: bg.ClockPort;
};

export class EntryHistoryPublisher {
  // Stryker disable all
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      SITUATION_LOGGED_EVENT,
      deps.EventHandler.handle(this.onSituationLoggedEvent.bind(this)),
    );
    deps.EventBus.on(EMOTION_LOGGED_EVENT, deps.EventHandler.handle(this.onEmotionLoggedEvent.bind(this)));
    deps.EventBus.on(REACTION_LOGGED_EVENT, deps.EventHandler.handle(this.onReactionLoggedEvent.bind(this)));
    deps.EventBus.on(
      EMOTION_REAPPRAISED_EVENT,
      deps.EventHandler.handle(this.onEmotionReappraisedEvent.bind(this)),
    );
    deps.EventBus.on(
      REACTION_EVALUATED_EVENT,
      deps.EventHandler.handle(this.onReactionEvaluatedEvent.bind(this)),
    );
  }
  // Stryker restore all

  async onSituationLoggedEvent(event: Emotions.Events.SituationLoggedEventType) {
    await this.deps.HistoryWriter.populate({
      operation: "entry.situation.logged",
      subject: event.payload.entryId,
      payload: { kind: event.payload.kind, description: event.payload.description },
      createdAt: this.deps.Clock.now().ms,
    });
  }

  async onEmotionLoggedEvent(event: Emotions.Events.EmotionLoggedEventType) {
    await this.deps.HistoryWriter.populate({
      operation: "entry.emotion.logged",
      subject: event.payload.entryId,
      payload: { label: event.payload.label, intensity: event.payload.intensity },
      createdAt: this.deps.Clock.now().ms,
    });
  }

  async onReactionLoggedEvent(event: Emotions.Events.ReactionLoggedEventType) {
    await this.deps.HistoryWriter.populate({
      operation: "entry.reaction.logged",
      subject: event.payload.entryId,
      payload: {
        description: event.payload.description,
        type: event.payload.type,
        effectiveness: event.payload.effectiveness,
      },
      createdAt: this.deps.Clock.now().ms,
    });
  }

  async onEmotionReappraisedEvent(event: Emotions.Events.EmotionReappraisedEventType) {
    await this.deps.HistoryWriter.populate({
      operation: "entry.emotion.reappraised",
      subject: event.payload.entryId,
      payload: { label: event.payload.newLabel, intensity: event.payload.newIntensity },
      createdAt: this.deps.Clock.now().ms,
    });
  }

  async onReactionEvaluatedEvent(event: Emotions.Events.ReactionEvaluatedEventType) {
    await this.deps.HistoryWriter.populate({
      operation: "entry.reaction.evaluated",
      subject: event.payload.entryId,
      payload: {
        description: event.payload.description,
        type: event.payload.type,
        effectiveness: event.payload.effectiveness,
      },
      createdAt: this.deps.Clock.now().ms,
    });
  }

  async onEntryDeletedEvent(event: Emotions.Events.EntryDeletedEventType) {
    await this.deps.HistoryWriter.clear(event.payload.entryId);
  }
}
