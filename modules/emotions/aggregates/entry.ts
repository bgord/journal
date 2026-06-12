import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Entities from "+emotions/entities";
import * as Events from "+emotions/events";
import * as Invariants from "+emotions/invariants";
import * as VO from "+emotions/value-objects";

export type EntryEventType =
  | Events.SituationLoggedEventType
  | Events.EmotionLoggedEventType
  | Events.ReactionLoggedEventType
  | Events.EmotionReappraisedEventType
  | Events.ReactionEvaluatedEventType
  | Events.EntryDeletedEventType;

type Dependencies = { IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

export class Entry {
  // Stryker disable all
  static readonly registry = new bg.EventValidatorRegistryAdapter<EntryEventType>({
    [Events.SITUATION_LOGGED_EVENT]: Events.SituationLoggedEvent,
    [Events.EMOTION_LOGGED_EVENT]: Events.EmotionLoggedEvent,
    [Events.REACTION_LOGGED_EVENT]: Events.ReactionLoggedEvent,
    [Events.EMOTION_REAPPRAISED_EVENT]: Events.EmotionReappraisedEvent,
    [Events.REACTION_EVALUATED_EVENT]: Events.ReactionEvaluatedEvent,
    [Events.ENTRY_DELETED_EVENT]: Events.EntryDeletedEvent,
  });
  // Stryker restore all

  readonly id: VO.EntryIdType;
  public revision: tools.Revision = new tools.Revision(tools.Revision.INITIAL);
  private userId?: Auth.VO.UserIdType;
  private situation?: Entities.Situation;
  private emotion?: Entities.Emotion;
  private reaction?: Entities.Reaction;
  private status: VO.EntryStatusEnum = VO.EntryStatusEnum.actionable;

  private readonly pending: Array<EntryEventType> = [];

  private constructor(
    id: VO.EntryIdType,
    private readonly deps: Dependencies,
  ) {
    this.id = id;
  }

  static build(id: VO.EntryIdType, events: ReadonlyArray<EntryEventType>, deps: Dependencies): Entry {
    const entry = new Entry(id, deps);

    events.forEach((event) => entry.apply(event));

    return entry;
  }

  static log(
    id: VO.EntryIdType,
    situation: Entities.Situation,
    emotion: Entities.Emotion,
    reaction: Entities.Reaction,
    requesterId: Auth.VO.UserIdType,
    origin: VO.EntryOriginOption,
    deps: Dependencies,
  ) {
    const entry = new Entry(id, deps);

    const SituationLoggedEvent = bg.event(
      Events.SituationLoggedEvent,
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
      Events.EmotionLoggedEvent,
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
      Events.ReactionLoggedEvent,
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

  reappraiseEmotion(newEmotion: Entities.Emotion, requesterId: Auth.VO.UserIdType) {
    Invariants.EntryIsActionable.enforce({ status: this.status });
    Invariants.EmotionCorrespondsToSituation.enforce({ situation: this.situation });
    Invariants.EmotionForReappraisalExists.enforce({ emotion: this.emotion });
    Invariants.RequesterOwnsEntry.enforce({ requesterId, ownerId: this.userId });

    const event = bg.event(
      Events.EmotionReappraisedEvent,
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

  evaluateReaction(newReaction: Entities.Reaction, requesterId: Auth.VO.UserIdType) {
    Invariants.EntryIsActionable.enforce({ status: this.status });
    Invariants.ReactionCorrespondsToSituationAndEmotion.enforce({
      situation: this.situation,
      emotion: this.emotion,
    });
    Invariants.ReactionForEvaluationExists.enforce({ reaction: this.reaction });
    Invariants.RequesterOwnsEntry.enforce({ requesterId, ownerId: this.userId });

    const event = bg.event(
      Events.ReactionEvaluatedEvent,
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
    Invariants.EntryHasBenStarted.enforce({ situation: this.situation });
    Invariants.RequesterOwnsEntry.enforce({ requesterId, ownerId: this.userId });

    const event = bg.event(
      Events.EntryDeletedEvent,
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
      case Events.SITUATION_LOGGED_EVENT: {
        this.userId = event.payload.userId;
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.situation = new Entities.Situation(
          new VO.SituationDescription(event.payload.description),
          new VO.SituationKind(event.payload.kind),
        );
        break;
      }

      case Events.EMOTION_LOGGED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.emotion = new Entities.Emotion(
          new VO.EmotionLabel(event.payload.label),
          new VO.EmotionIntensity(event.payload.intensity),
        );
        break;
      }

      case Events.REACTION_LOGGED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.reaction = new Entities.Reaction(
          new VO.ReactionDescription(event.payload.description),
          new VO.ReactionType(event.payload.type),
          new VO.ReactionEffectiveness(event.payload.effectiveness),
        );
        break;
      }

      case Events.EMOTION_REAPPRAISED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.emotion = new Entities.Emotion(
          new VO.EmotionLabel(event.payload.newLabel),
          new VO.EmotionIntensity(event.payload.newIntensity),
        );
        break;
      }

      case Events.REACTION_EVALUATED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.reaction = new Entities.Reaction(
          new VO.ReactionDescription(event.payload.description),
          new VO.ReactionType(event.payload.type),
          new VO.ReactionEffectiveness(event.payload.effectiveness),
        );
        break;
      }

      case Events.ENTRY_DELETED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.status = VO.EntryStatusEnum.deleted;

        this.situation = undefined;
        this.emotion = undefined;
        this.reaction = undefined;
        break;
      }
    }
  }

  static getStream(id: VO.EntryIdType) {
    return `entry_${id}`;
  }
}
