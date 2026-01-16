import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as z from "zod/v4";
import type * as Auth from "+auth";
import * as Emotions from "+emotions";

export type EntryEvent = (typeof Entry)["events"][number];
type EntryEventType = z.infer<EntryEvent>;

type Dependencies = { IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

export class Entry {
  // Stryker disable all
  static readonly events = [
    Emotions.Events.SituationLoggedEvent,
    Emotions.Events.EmotionLoggedEvent,
    Emotions.Events.ReactionLoggedEvent,
    Emotions.Events.EmotionReappraisedEvent,
    Emotions.Events.ReactionEvaluatedEvent,
    Emotions.Events.EntryDeletedEvent,
  ];
  // Stryker restore all

  readonly id: Emotions.VO.EntryIdType;
  public revision: tools.Revision = new tools.Revision(tools.Revision.INITIAL);
  private userId?: Auth.VO.UserIdType;
  private situation?: Emotions.Entities.Situation;
  private emotion?: Emotions.Entities.Emotion;
  private reaction?: Emotions.Entities.Reaction;
  private status: Emotions.VO.EntryStatusEnum = Emotions.VO.EntryStatusEnum.actionable;

  private readonly pending: EntryEventType[] = [];

  private constructor(
    id: Emotions.VO.EntryIdType,
    private readonly deps: Dependencies,
  ) {
    this.id = id;
  }

  static build(id: Emotions.VO.EntryIdType, events: EntryEventType[], deps: Dependencies): Entry {
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

    const SituationLoggedEvent = Emotions.Events.SituationLoggedEvent.parse({
      ...bg.createEventEnvelope(Entry.getStream(id), deps),
      name: Emotions.Events.SITUATION_LOGGED_EVENT,
      payload: {
        entryId: id,
        description: situation.description.get(),
        kind: situation.kind.get(),
        userId: requesterId,
        origin,
      },
    } satisfies Emotions.Events.SituationLoggedEventType);

    entry.record(SituationLoggedEvent);

    const EmotionLoggedEvent = Emotions.Events.EmotionLoggedEvent.parse({
      ...bg.createEventEnvelope(Entry.getStream(id), deps),
      name: Emotions.Events.EMOTION_LOGGED_EVENT,
      payload: {
        entryId: id,
        label: emotion.label.get(),
        intensity: emotion.intensity.get(),
        userId: requesterId,
      },
    } satisfies Emotions.Events.EmotionLoggedEventType);

    entry.record(EmotionLoggedEvent);

    const ReactionLoggedEvent = Emotions.Events.ReactionLoggedEvent.parse({
      ...bg.createEventEnvelope(Entry.getStream(id), deps),
      name: Emotions.Events.REACTION_LOGGED_EVENT,
      payload: {
        entryId: id,
        description: reaction.description.get(),
        type: reaction.type.get(),
        effectiveness: reaction.effectiveness.get(),
        userId: requesterId,
      },
    } satisfies Emotions.Events.ReactionLoggedEventType);

    entry.record(ReactionLoggedEvent);

    return entry;
  }

  reappraiseEmotion(newEmotion: Emotions.Entities.Emotion, requesterId: Auth.VO.UserIdType) {
    Emotions.Invariants.EntryIsActionable.enforce({ status: this.status });
    Emotions.Invariants.EmotionCorrespondsToSituation.enforce({ situation: this.situation });
    Emotions.Invariants.EmotionForReappraisalExists.enforce({ emotion: this.emotion });
    Emotions.Invariants.RequesterOwnsEntry.enforce({ requesterId, ownerId: this.userId });

    const event = Emotions.Events.EmotionReappraisedEvent.parse({
      ...bg.createEventEnvelope(Entry.getStream(this.id), this.deps),
      name: Emotions.Events.EMOTION_REAPPRAISED_EVENT,
      payload: {
        entryId: this.id,
        newLabel: newEmotion.label.get(),
        newIntensity: newEmotion.intensity.get(),
        userId: requesterId,
      },
    } satisfies Emotions.Events.EmotionReappraisedEventType);

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

    const event = Emotions.Events.ReactionEvaluatedEvent.parse({
      ...bg.createEventEnvelope(Entry.getStream(this.id), this.deps),
      name: Emotions.Events.REACTION_EVALUATED_EVENT,
      payload: {
        entryId: this.id,
        description: newReaction.description.get(),
        type: newReaction.type.get(),
        effectiveness: newReaction.effectiveness.get(),
        userId: requesterId,
      },
    } satisfies Emotions.Events.ReactionEvaluatedEventType);

    this.record(event);
  }

  delete(requesterId: Auth.VO.UserIdType) {
    Emotions.Invariants.EntryHasBenStarted.enforce({ situation: this.situation });
    Emotions.Invariants.RequesterOwnsEntry.enforce({ requesterId, ownerId: this.userId });

    const event = Emotions.Events.EntryDeletedEvent.parse({
      ...bg.createEventEnvelope(Entry.getStream(this.id), this.deps),
      name: Emotions.Events.ENTRY_DELETED_EVENT,
      payload: { entryId: this.id, userId: requesterId },
    } satisfies Emotions.Events.EntryDeletedEventType);

    this.record(event);
  }

  pullEvents(): EntryEventType[] {
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
