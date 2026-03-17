import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Emotions from "+emotions";
import * as Events from "+emotions/events";

export type EntryEventType =
  | Events.SituationLoggedEventType
  | Events.EmotionLoggedEventType
  | Events.ReactionLoggedEventType
  | Events.EmotionReappraisedEventType
  | Events.ReactionEvaluatedEventType
  | Events.EntryDeletedEventType;

type Dependencies = { IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

export class Entry {
  static readonly registry = new bg.EventValidatorRegistryAdapter<EntryEventType>({
    [Events.SITUATION_LOGGED_EVENT]: Events.SituationLoggedEvent,
    [Events.EMOTION_LOGGED_EVENT]: Events.EmotionLoggedEvent,
    [Events.REACTION_LOGGED_EVENT]: Events.ReactionLoggedEvent,
    [Events.EMOTION_REAPPRAISED_EVENT]: Events.EmotionReappraisedEvent,
    [Events.REACTION_EVALUATED_EVENT]: Events.ReactionEvaluatedEvent,
    [Events.ENTRY_DELETED_EVENT]: Events.EntryDeletedEvent,
  });

  readonly id: Emotions.VO.EntryIdType;
  public revision: tools.Revision = new tools.Revision(tools.Revision.INITIAL);
  private userId?: Auth.VO.UserIdType;
  private situation?: Emotions.Entities.Situation;
  private emotion?: Emotions.Entities.Emotion;
  private reaction?: Emotions.Entities.Reaction;
  private status: Emotions.VO.EntryStatusEnum = Emotions.VO.EntryStatusEnum.actionable;

  private readonly pending: Array<EntryEventType> = [];

  private constructor(
    id: Emotions.VO.EntryIdType,
    private readonly deps: Dependencies,
  ) {
    this.id = id;
  }

  static build(
    id: Emotions.VO.EntryIdType,
    events: ReadonlyArray<EntryEventType>,
    deps: Dependencies,
  ): Entry {
    const entry = new Entry(id, deps);

    events.forEach((event) => entry.apply(event));

    return entry;
  }

  static log(
    id: Emotions.VO.EntryIdType,
    situation: Emotions.Entities.Situation,
    emotion: Emotions.Entities.Emotion,
    reaction: Emotions.Entities.Reaction,
    requesterId: Auth.VO.UserIdType,
    origin: Emotions.VO.EntryOriginOption,
    deps: Dependencies,
  ) {
    const entry = new Entry(id, deps);

    const SituationLoggedEvent = bg.event(
      Emotions.Events.SituationLoggedEvent,
      Entry.getStream(id),
      {
        entryId: id,
        description: situation.description.get(),
        kind: situation.kind.get(),
        userId: requesterId,
        origin,
      },
      deps,
    );

    entry.record(SituationLoggedEvent);

    const EmotionLoggedEvent = bg.event(
      Emotions.Events.EmotionLoggedEvent,
      Entry.getStream(id),
      {
        entryId: id,
        label: emotion.label.get(),
        intensity: emotion.intensity.get(),
        userId: requesterId,
      },
      deps,
    );

    entry.record(EmotionLoggedEvent);

    const ReactionLoggedEvent = bg.event(
      Emotions.Events.ReactionLoggedEvent,
      Entry.getStream(id),
      {
        entryId: id,
        description: reaction.description.get(),
        type: reaction.type.get(),
        effectiveness: reaction.effectiveness.get(),
        userId: requesterId,
      },
      deps,
    );

    entry.record(ReactionLoggedEvent);

    return entry;
  }

  reappraiseEmotion(newEmotion: Emotions.Entities.Emotion, requesterId: Auth.VO.UserIdType) {
    Emotions.Invariants.EntryIsActionable.enforce({ status: this.status });
    Emotions.Invariants.EmotionCorrespondsToSituation.enforce({ situation: this.situation });
    Emotions.Invariants.EmotionForReappraisalExists.enforce({ emotion: this.emotion });
    Emotions.Invariants.RequesterOwnsEntry.enforce({ requesterId, ownerId: this.userId });

    const event = bg.event(
      Emotions.Events.EmotionReappraisedEvent,
      Entry.getStream(this.id),
      {
        entryId: this.id,
        newLabel: newEmotion.label.get(),
        newIntensity: newEmotion.intensity.get(),
        userId: requesterId,
      },
      this.deps,
    );

    this.record(event);
  }

  evaluateReaction(newReaction: Emotions.Entities.Reaction, requesterId: Auth.VO.UserIdType) {
    Emotions.Invariants.EntryIsActionable.enforce({ status: this.status });
    Emotions.Invariants.ReactionCorrespondsToSituationAndEmotion.enforce({
      situation: this.situation,
      emotion: this.emotion,
    });
    Emotions.Invariants.ReactionForEvaluationExists.enforce({ reaction: this.reaction });
    Emotions.Invariants.RequesterOwnsEntry.enforce({ requesterId, ownerId: this.userId });

    const event = bg.event(
      Emotions.Events.ReactionEvaluatedEvent,
      Entry.getStream(this.id),
      {
        entryId: this.id,
        description: newReaction.description.get(),
        type: newReaction.type.get(),
        effectiveness: newReaction.effectiveness.get(),
        userId: requesterId,
      },
      this.deps,
    );

    this.record(event);
  }

  delete(requesterId: Auth.VO.UserIdType) {
    Emotions.Invariants.EntryHasBenStarted.enforce({ situation: this.situation });
    Emotions.Invariants.RequesterOwnsEntry.enforce({ requesterId, ownerId: this.userId });

    const event = bg.event(
      Emotions.Events.EntryDeletedEvent,
      Entry.getStream(this.id),
      { entryId: this.id, userId: requesterId },
      this.deps,
    );

    this.record(event);
  }

  pullEvents(): ReadonlyArray<EntryEventType> {
    const events = [...this.pending];

    this.pending.length = 0;

    return events;
  }

  toSnapshot() {
    return {
      id: this.id,
      revision: this.revision,
      userId: this.userId,
      situation: this.situation,
      emotion: this.emotion,
      reaction: this.reaction,
      status: this.status,
    };
  }

  private record(event: EntryEventType): void {
    this.apply(event);
    this.pending.push(event);
  }

  private apply(event: EntryEventType): void {
    switch (event.name) {
      case Emotions.Events.SITUATION_LOGGED_EVENT: {
        this.userId = event.payload.userId;
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.situation = new Emotions.Entities.Situation(
          new Emotions.VO.SituationDescription(event.payload.description),
          new Emotions.VO.SituationKind(event.payload.kind),
        );
        break;
      }

      case Emotions.Events.EMOTION_LOGGED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.emotion = new Emotions.Entities.Emotion(
          new Emotions.VO.EmotionLabel(event.payload.label),
          new Emotions.VO.EmotionIntensity(event.payload.intensity),
        );
        break;
      }

      case Emotions.Events.REACTION_LOGGED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.reaction = new Emotions.Entities.Reaction(
          new Emotions.VO.ReactionDescription(event.payload.description),
          new Emotions.VO.ReactionType(event.payload.type),
          new Emotions.VO.ReactionEffectiveness(event.payload.effectiveness),
        );
        break;
      }

      case Emotions.Events.EMOTION_REAPPRAISED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.emotion = new Emotions.Entities.Emotion(
          new Emotions.VO.EmotionLabel(event.payload.newLabel),
          new Emotions.VO.EmotionIntensity(event.payload.newIntensity),
        );
        break;
      }

      case Emotions.Events.REACTION_EVALUATED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.reaction = new Emotions.Entities.Reaction(
          new Emotions.VO.ReactionDescription(event.payload.description),
          new Emotions.VO.ReactionType(event.payload.type),
          new Emotions.VO.ReactionEffectiveness(event.payload.effectiveness),
        );
        break;
      }

      case Emotions.Events.ENTRY_DELETED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.status = Emotions.VO.EntryStatusEnum.deleted;

        this.situation = undefined;
        this.emotion = undefined;
        this.reaction = undefined;
        break;
      }
    }
  }

  static getStream(id: Emotions.VO.EntryIdType) {
    return `entry_${id}`;
  }
}
