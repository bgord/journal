import type * as bg from "@bgord/bun";
import * as Emotions from "+emotions";

type AcceptedEvent =
  | Emotions.Events.SituationLoggedEventType
  | Emotions.Events.EmotionLoggedEventType
  | Emotions.Events.ReactionLoggedEventType
  | Emotions.Events.EmotionReappraisedEventType
  | Emotions.Events.ReactionEvaluatedEventType;

type Dependencies = {
  EventBus: bg.EventBusLike<AcceptedEvent>;
  EventHandler: bg.EventHandler;
  HistoryWriter: bg.History.Ports.HistoryWriterPort;
  Clock: bg.ClockPort;
};

export class EntryHistoryPublisher {
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      Emotions.Events.SITUATION_LOGGED_EVENT,
      deps.EventHandler.handle(this.onSituationLoggedEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.EMOTION_LOGGED_EVENT,
      deps.EventHandler.handle(this.onEmotionLoggedEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.REACTION_LOGGED_EVENT,
      deps.EventHandler.handle(this.onReactionLoggedEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.EMOTION_REAPPRAISED_EVENT,
      deps.EventHandler.handle(this.onEmotionReappraisedEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.REACTION_EVALUATED_EVENT,
      deps.EventHandler.handle(this.onReactionEvaluatedEvent.bind(this)),
    );
  }

  async onSituationLoggedEvent(event: Emotions.Events.SituationLoggedEventType) {
    await this.deps.HistoryWriter.populate({
      operation: "entry.situation.logged",
      subject: event.payload.entryId,
      payload: { kind: event.payload.kind, description: event.payload.description },
      createdAt: this.deps.Clock.nowMs(),
    });
  }

  async onEmotionLoggedEvent(event: Emotions.Events.EmotionLoggedEventType) {
    await this.deps.HistoryWriter.populate({
      operation: "entry.emotion.logged",
      subject: event.payload.entryId,
      payload: { label: event.payload.label, intensity: event.payload.intensity },
      createdAt: this.deps.Clock.nowMs(),
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
      createdAt: this.deps.Clock.nowMs(),
    });
  }

  async onEmotionReappraisedEvent(event: Emotions.Events.EmotionReappraisedEventType) {
    await this.deps.HistoryWriter.populate({
      operation: "entry.emotion.reappraised",
      subject: event.payload.entryId,
      payload: { label: event.payload.newLabel, intensity: event.payload.newIntensity },
      createdAt: this.deps.Clock.nowMs(),
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
      createdAt: this.deps.Clock.nowMs(),
    });
  }

  async onEntryDeletedEvent(event: Emotions.Events.EntryDeletedEventType) {
    await this.deps.HistoryWriter.clear(event.payload.entryId);
  }
}
