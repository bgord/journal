import * as bg from "@bgord/bun";
import * as v from "valibot";
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
      operation: v.parse(bg.History.VO.HistoryOperation, "entry.situation.logged"),
      subject: v.parse(bg.History.VO.HistorySubject, event.payload.entryId),
      payload: v.parse(bg.History.VO.HistoryPayload, {
        kind: event.payload.kind,
        description: event.payload.description,
      }),
      createdAt: this.deps.Clock.now().ms,
    });
  }

  async onEmotionLoggedEvent(event: Emotions.Events.EmotionLoggedEventType) {
    await this.deps.HistoryWriter.populate({
      operation: v.parse(bg.History.VO.HistoryOperation, "entry.emotion.logged"),
      subject: v.parse(bg.History.VO.HistorySubject, event.payload.entryId),
      payload: v.parse(bg.History.VO.HistoryPayload, {
        label: event.payload.label,
        intensity: event.payload.intensity,
      }),
      createdAt: this.deps.Clock.now().ms,
    });
  }

  async onReactionLoggedEvent(event: Emotions.Events.ReactionLoggedEventType) {
    await this.deps.HistoryWriter.populate({
      operation: v.parse(bg.History.VO.HistoryOperation, "entry.reaction.logged"),
      subject: v.parse(bg.History.VO.HistorySubject, event.payload.entryId),
      payload: v.parse(bg.History.VO.HistoryPayload, {
        description: event.payload.description,
        type: event.payload.type,
        effectiveness: event.payload.effectiveness,
      }),
      createdAt: this.deps.Clock.now().ms,
    });
  }

  async onEmotionReappraisedEvent(event: Emotions.Events.EmotionReappraisedEventType) {
    await this.deps.HistoryWriter.populate({
      operation: v.parse(bg.History.VO.HistoryOperation, "entry.emotion.reappraised"),
      subject: v.parse(bg.History.VO.HistorySubject, event.payload.entryId),
      payload: v.parse(bg.History.VO.HistoryPayload, {
        label: event.payload.newLabel,
        intensity: event.payload.newIntensity,
      }),
      createdAt: this.deps.Clock.now().ms,
    });
  }

  async onReactionEvaluatedEvent(event: Emotions.Events.ReactionEvaluatedEventType) {
    await this.deps.HistoryWriter.populate({
      operation: v.parse(bg.History.VO.HistoryOperation, "entry.reaction.evaluated"),
      subject: v.parse(bg.History.VO.HistorySubject, event.payload.entryId),
      payload: v.parse(bg.History.VO.HistoryPayload, {
        description: event.payload.description,
        type: event.payload.type,
        effectiveness: event.payload.effectiveness,
      }),
      createdAt: this.deps.Clock.now().ms,
    });
  }

  async onEntryDeletedEvent(event: Emotions.Events.EntryDeletedEventType) {
    await this.deps.HistoryWriter.clear(v.parse(bg.History.VO.HistorySubject, event.payload.entryId));
  }
}
