import type * as Auth from "+auth";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+infra/i18n";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export type EntryEvent = (typeof Entry)["events"][number];
type EntryEventType = z.infer<EntryEvent>;

// TODO: Tighten-up types
export class Entry {
  static events = [
    Emotions.Events.SituationLoggedEvent,
    Emotions.Events.EmotionLoggedEvent,
    Emotions.Events.ReactionLoggedEvent,
    Emotions.Events.EmotionReappraisedEvent,
    Emotions.Events.ReactionEvaluatedEvent,
    Emotions.Events.EntryDeletedEvent,
  ];

  private readonly id: Emotions.VO.EntryIdType;
  public revision: tools.Revision = new tools.Revision(tools.Revision.initial);
  private userId?: Auth.VO.UserIdType;
  private startedAt?: Emotions.VO.EntryStartedAtType;
  private finishedAt?: Emotions.VO.EntryFinishedAtType;
  private situation?: Emotions.Entities.Situation;
  private emotion?: Emotions.Entities.Emotion;
  private reaction?: Emotions.Entities.Reaction;
  private status: Emotions.VO.EntryStatusEnum = Emotions.VO.EntryStatusEnum.actionable;

  private readonly pending: EntryEventType[] = [];

  private constructor(id: Emotions.VO.EntryIdType) {
    this.id = id;
  }

  static create(id: Emotions.VO.EntryIdType): Entry {
    return new Entry(id);
  }

  static build(id: Emotions.VO.EntryIdType, events: EntryEventType[]): Entry {
    const entry = new Entry(id);

    events.forEach((event) => entry.apply(event));

    return entry;
  }

  async log(
    situation: Emotions.Entities.Situation,
    emotion: Emotions.Entities.Emotion,
    reaction: Emotions.Entities.Reaction,
    language: SupportedLanguages,
    requesterId: Auth.VO.UserIdType,
  ) {
    await Emotions.Policies.OneSituationPerEntry.perform({ situation: this.situation });

    const SituationLoggedEvent = Emotions.Events.SituationLoggedEvent.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Emotions.Events.SITUATION_LOGGED_EVENT,
      stream: Entry.getStream(this.id),
      version: 1,
      payload: {
        entryId: this.id,
        description: situation.description.get(),
        location: situation.location.get(),
        kind: situation.kind.get(),
        language,
        userId: requesterId,
      },
    } satisfies Emotions.Events.SituationLoggedEventType);

    this.record(SituationLoggedEvent);

    const EmotionLoggedEvent = Emotions.Events.EmotionLoggedEvent.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Emotions.Events.EMOTION_LOGGED_EVENT,
      stream: Entry.getStream(this.id),
      version: 1,
      payload: {
        entryId: this.id,
        label: emotion.label.get(),
        intensity: emotion.intensity.get(),
        userId: requesterId,
      },
    } satisfies Emotions.Events.EmotionLoggedEventType);

    this.record(EmotionLoggedEvent);

    const ReactionLoggedEvent = Emotions.Events.ReactionLoggedEvent.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Emotions.Events.REACTION_LOGGED_EVENT,
      stream: Entry.getStream(this.id),
      version: 1,
      payload: {
        entryId: this.id,
        description: reaction.description.get(),
        type: reaction.type.get(),
        effectiveness: reaction.effectiveness.get(),
        userId: requesterId,
      },
    } satisfies Emotions.Events.ReactionLoggedEventType);

    this.record(ReactionLoggedEvent);
  }

  async reappraiseEmotion(newEmotion: Emotions.Entities.Emotion, requesterId: Auth.VO.UserIdType) {
    await Emotions.Policies.EntryIsActionable.perform({ status: this.status });
    await Emotions.Policies.EmotionCorrespondsToSituation.perform({ situation: this.situation });
    await Emotions.Policies.EmotionForReappraisalExists.perform({ emotion: this.emotion });
    await Emotions.Policies.RequesterOwnsEntry.perform({ requesterId, ownerId: this.userId });

    const event = Emotions.Events.EmotionReappraisedEvent.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Emotions.Events.EMOTION_REAPPRAISED_EVENT,
      stream: Entry.getStream(this.id),
      version: 1,
      payload: {
        entryId: this.id,
        newLabel: newEmotion.label.get(),
        newIntensity: newEmotion.intensity.get(),
        userId: requesterId,
      },
    } satisfies Emotions.Events.EmotionReappraisedEventType);

    this.record(event);
  }

  async evaluateReaction(newReaction: Emotions.Entities.Reaction, requesterId: Auth.VO.UserIdType) {
    await Emotions.Policies.EntryIsActionable.perform({ status: this.status });
    await Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.perform({
      situation: this.situation,
      emotion: this.emotion,
    });
    await Emotions.Policies.ReactionForEvaluationExists.perform({ reaction: this.reaction });
    await Emotions.Policies.RequesterOwnsEntry.perform({ requesterId, ownerId: this.userId });

    const event = Emotions.Events.ReactionEvaluatedEvent.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Emotions.Events.REACTION_EVALUATED_EVENT,
      stream: Entry.getStream(this.id),
      version: 1,
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

  async delete(requesterId: Auth.VO.UserIdType) {
    await Emotions.Policies.EntryHasBenStarted.perform({ situation: this.situation });
    await Emotions.Policies.RequesterOwnsEntry.perform({ requesterId, ownerId: this.userId });

    const event = Emotions.Events.EntryDeletedEvent.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Emotions.Events.ENTRY_DELETED_EVENT,
      stream: Entry.getStream(this.id),
      version: 1,
      payload: { entryId: this.id, userId: requesterId },
    } satisfies Emotions.Events.EntryDeletedEventType);

    this.record(event);
  }

  summarize() {
    return {
      id: this.id,
      startedAt: this.startedAt,
      finishedAt: this.finishedAt,
      situation: this.situation,
      emotion: this.emotion,
      reaction: this.reaction,
      status: this.status,
    };
  }

  pullEvents(): EntryEventType[] {
    const events = [...this.pending];

    this.pending.length = 0;

    return events;
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
        this.startedAt = event.createdAt;
        this.situation = new Emotions.Entities.Situation(
          new Emotions.VO.SituationDescription(event.payload.description),
          new Emotions.VO.SituationLocation(event.payload.location),
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
        this.finishedAt = event.createdAt;
        this.reaction = new Emotions.Entities.Reaction(
          new Emotions.VO.ReactionDescription(event.payload.description),
          new Emotions.VO.ReactionType(event.payload.type),
          new Emotions.VO.ReactionEffectiveness(event.payload.effectiveness),
        );
        break;
      }

      case Emotions.Events.EMOTION_REAPPRAISED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.finishedAt = event.createdAt;
        this.emotion = new Emotions.Entities.Emotion(
          new Emotions.VO.EmotionLabel(event.payload.newLabel),
          new Emotions.VO.EmotionIntensity(event.payload.newIntensity),
        );
        break;
      }

      case Emotions.Events.REACTION_EVALUATED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.finishedAt = event.createdAt;
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

        this.finishedAt = event.createdAt;
        this.situation = undefined;
        this.emotion = undefined;
        this.reaction = undefined;
        this.startedAt = undefined;
        this.finishedAt = undefined;
        break;
      }
    }
  }

  static getStream(id: Emotions.VO.EntryIdType) {
    return `entry_${id}`;
  }
}
