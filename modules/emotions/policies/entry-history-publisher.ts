import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import type { EventBus } from "+infra/event-bus";

export class EntryHistoryPublisher {
  constructor(
    private readonly eventBus: typeof EventBus,
    private readonly historyWriter: bg.History.Services.HistoryWriterPort,
  ) {
    this.eventBus.on(Emotions.Events.SITUATION_LOGGED_EVENT, this.onSituationLoggedEvent.bind(this));
    this.eventBus.on(Emotions.Events.EMOTION_LOGGED_EVENT, this.onEmotionLoggedEvent.bind(this));
    this.eventBus.on(Emotions.Events.REACTION_LOGGED_EVENT, this.onReactionLoggedEvent.bind(this));
    this.eventBus.on(Emotions.Events.EMOTION_REAPPRAISED_EVENT, this.onEmotionReappraisedEvent.bind(this));
    this.eventBus.on(Emotions.Events.REACTION_EVALUATED_EVENT, this.onReactionEvaluatedEvent.bind(this));
  }

  async onSituationLoggedEvent(event: Emotions.Events.SituationLoggedEventType) {
    await this.historyWriter.populate({
      operation: "entry.situation.logged",
      subject: event.payload.entryId,
      payload: {
        kind: event.payload.kind,
        description: event.payload.description,
        location: event.payload.location,
      },
    });
  }

  async onEmotionLoggedEvent(event: Emotions.Events.EmotionLoggedEventType) {
    await this.historyWriter.populate({
      operation: "entry.emotion.logged",
      subject: event.payload.entryId,
      payload: {
        label: event.payload.label,
        intensity: event.payload.intensity as number,
      },
    });
  }

  async onReactionLoggedEvent(event: Emotions.Events.ReactionLoggedEventType) {
    await this.historyWriter.populate({
      operation: "entry.reaction.logged",
      subject: event.payload.entryId,
      payload: {
        description: event.payload.description,
        type: event.payload.type,
        effectiveness: event.payload.effectiveness,
      },
    });
  }

  async onEmotionReappraisedEvent(event: Emotions.Events.EmotionReappraisedEventType) {
    await this.historyWriter.populate({
      operation: "entry.emotion.reappraised",
      subject: event.payload.entryId,
      payload: {
        label: event.payload.newLabel,
        intensity: event.payload.newIntensity as number,
      },
    });
  }

  async onReactionEvaluatedEvent(event: Emotions.Events.ReactionEvaluatedEventType) {
    await this.historyWriter.populate({
      operation: "entry.reaction.evaluated",
      subject: event.payload.entryId,
      payload: {
        description: event.payload.description,
        type: event.payload.type,
        effectiveness: event.payload.effectiveness,
      },
    });
  }

  async onEntryDeletedEvent(event: Emotions.Events.EntryDeletedEventType) {
    await this.historyWriter.clear(event.payload.entryId);
  }
}
