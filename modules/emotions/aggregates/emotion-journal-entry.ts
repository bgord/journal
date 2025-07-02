import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import * as Emotions from "+emotions";

export type JournalEntryEvent = (typeof EmotionJournalEntry)["events"][number];
type JournalEntryEventType = z.infer<JournalEntryEvent>;

export class EmotionJournalEntry {
  static events = [
    Emotions.Events.SituationLoggedEvent,
    Emotions.Events.EmotionLoggedEvent,
    Emotions.Events.ReactionLoggedEvent,
    Emotions.Events.EmotionReappraisedEvent,
    Emotions.Events.ReactionEvaluatedEvent,
    Emotions.Events.EmotionJournalEntryDeletedEvent,
  ];

  private readonly id: Emotions.VO.EmotionJournalEntryIdType;
  private startedAt?: Emotions.VO.EmotionJournalEntryStartedAtType;
  private finishedAt?: Emotions.VO.EmotionJournalEntryFinishedAtType;
  private situation?: Emotions.Entities.Situation;
  private emotion?: Emotions.Entities.Emotion;
  private reaction?: Emotions.Entities.Reaction;
  private status: Emotions.VO.EmotionJournalEntryStatusEnum =
    Emotions.VO.EmotionJournalEntryStatusEnum.actionable;

  private readonly pending: JournalEntryEventType[] = [];

  private constructor(id: Emotions.VO.EmotionJournalEntryIdType) {
    this.id = id;
  }

  static create(id: Emotions.VO.EmotionJournalEntryIdType): EmotionJournalEntry {
    return new EmotionJournalEntry(id);
  }

  static build(
    id: Emotions.VO.EmotionJournalEntryIdType,
    events: JournalEntryEventType[],
  ): EmotionJournalEntry {
    const entry = new EmotionJournalEntry(id);

    events.forEach((event) => entry.apply(event));

    return entry;
  }

  async logSituation(situation: Emotions.Entities.Situation) {
    await Emotions.Policies.OneSituationPerEntry.perform({
      situation: this.situation,
    });

    const event = Emotions.Events.SituationLoggedEvent.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Emotions.Events.SITUATION_LOGGED_EVENT,
      stream: EmotionJournalEntry.getStream(this.id),
      version: 1,
      payload: {
        emotionJournalEntryId: this.id,
        description: situation.description.get(),
        location: situation.location.get(),
        kind: situation.kind.get(),
      },
    } satisfies Emotions.Events.SituationLoggedEventType);

    this.record(event);
  }

  async logEmotion(emotion: Emotions.Entities.Emotion) {
    await Emotions.Policies.EntryIsActionable.perform({
      status: this.status,
    });

    await Emotions.Policies.OneEmotionPerEntry.perform({
      emotion: this.emotion,
    });

    await Emotions.Policies.EmotionCorrespondsToSituation.perform({
      situation: this.situation,
    });

    const event = Emotions.Events.EmotionLoggedEvent.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Emotions.Events.EMOTION_LOGGED_EVENT,
      stream: EmotionJournalEntry.getStream(this.id),
      version: 1,
      payload: {
        emotionJournalEntryId: this.id,
        label: emotion.label.get(),
        intensity: emotion.intensity.get(),
      },
    } satisfies Emotions.Events.EmotionLoggedEventType);

    this.record(event);
  }

  async logReaction(reaction: Emotions.Entities.Reaction) {
    await Emotions.Policies.EntryIsActionable.perform({
      status: this.status,
    });

    await Emotions.Policies.OneReactionPerEntry.perform({
      reaction: this.reaction,
    });

    await Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.perform({
      situation: this.situation,
      emotion: this.emotion,
    });

    const event = Emotions.Events.ReactionLoggedEvent.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Emotions.Events.REACTION_LOGGED_EVENT,
      stream: EmotionJournalEntry.getStream(this.id),
      version: 1,
      payload: {
        emotionJournalEntryId: this.id,
        description: reaction.description.get(),
        type: reaction.type.get(),
        effectiveness: reaction.effectiveness.get(),
      },
    } satisfies Emotions.Events.ReactionLoggedEventType);

    this.record(event);
  }

  async reappraiseEmotion(newEmotion: Emotions.Entities.Emotion) {
    await Emotions.Policies.EntryIsActionable.perform({
      status: this.status,
    });

    await Emotions.Policies.EmotionCorrespondsToSituation.perform({
      situation: this.situation,
    });

    await Emotions.Policies.EmotionForReappraisalExists.perform({
      emotion: this.emotion,
    });

    const event = Emotions.Events.EmotionReappraisedEvent.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Emotions.Events.EMOTION_REAPPRAISED_EVENT,
      stream: EmotionJournalEntry.getStream(this.id),
      version: 1,
      payload: {
        emotionJournalEntryId: this.id,
        newLabel: newEmotion.label.get(),
        newIntensity: newEmotion.intensity.get(),
      },
    } satisfies Emotions.Events.EmotionReappraisedEventType);

    this.record(event);
  }

  async evaluateReaction(newReaction: Emotions.Entities.Reaction) {
    await Emotions.Policies.EntryIsActionable.perform({
      status: this.status,
    });

    await Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.perform({
      situation: this.situation,
      emotion: this.emotion,
    });

    await Emotions.Policies.ReactionForEvaluationExists.perform({
      reaction: this.reaction,
    });

    const event = Emotions.Events.ReactionEvaluatedEvent.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Emotions.Events.REACTION_EVALUATED_EVENT,
      stream: EmotionJournalEntry.getStream(this.id),
      version: 1,
      payload: {
        emotionJournalEntryId: this.id,
        description: newReaction.description.get(),
        type: newReaction.type.get(),
        effectiveness: newReaction.effectiveness.get(),
      },
    } satisfies Emotions.Events.ReactionEvaluatedEventType);

    this.record(event);
  }

  async delete() {
    await Emotions.Policies.EntryHasBenStarted.perform({ situation: this.situation });

    const event = Emotions.Events.EmotionJournalEntryDeletedEvent.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Emotions.Events.EMOTION_JOURNAL_ENTRY_DELETED_EVENT,
      stream: EmotionJournalEntry.getStream(this.id),
      version: 1,
      payload: { emotionJournalEntryId: this.id },
    } satisfies Emotions.Events.EmotionJournalEntryDeletedEventType);

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

  pullEvents(): JournalEntryEventType[] {
    const events = [...this.pending];

    this.pending.length = 0;

    return events;
  }

  private record(event: JournalEntryEventType): void {
    this.apply(event);
    this.pending.push(event);
  }

  private apply(event: JournalEntryEventType): void {
    switch (event.name) {
      case Emotions.Events.SITUATION_LOGGED_EVENT: {
        this.startedAt = event.createdAt;
        this.situation = new Emotions.Entities.Situation(
          new Emotions.VO.SituationDescription(event.payload.description),
          new Emotions.VO.SituationLocation(event.payload.location),
          new Emotions.VO.SituationKind(event.payload.kind),
        );
        break;
      }

      case Emotions.Events.EMOTION_LOGGED_EVENT: {
        this.emotion = new Emotions.Entities.Emotion(
          new Emotions.VO.EmotionLabel(event.payload.label),
          new Emotions.VO.EmotionIntensity(event.payload.intensity),
        );
        break;
      }

      case Emotions.Events.REACTION_LOGGED_EVENT: {
        this.finishedAt = event.createdAt;
        this.reaction = new Emotions.Entities.Reaction(
          new Emotions.VO.ReactionDescription(event.payload.description),
          new Emotions.VO.ReactionType(event.payload.type),
          new Emotions.VO.ReactionEffectiveness(event.payload.effectiveness),
        );
        break;
      }

      case Emotions.Events.EMOTION_REAPPRAISED_EVENT: {
        this.finishedAt = event.createdAt;
        this.emotion = new Emotions.Entities.Emotion(
          new Emotions.VO.EmotionLabel(event.payload.newLabel),
          new Emotions.VO.EmotionIntensity(event.payload.newIntensity),
        );
        break;
      }

      case Emotions.Events.REACTION_EVALUATED_EVENT: {
        this.finishedAt = event.createdAt;
        this.reaction = new Emotions.Entities.Reaction(
          new Emotions.VO.ReactionDescription(event.payload.description),
          new Emotions.VO.ReactionType(event.payload.type),
          new Emotions.VO.ReactionEffectiveness(event.payload.effectiveness),
        );
        break;
      }

      case Emotions.Events.EMOTION_JOURNAL_ENTRY_DELETED_EVENT: {
        this.status = Emotions.VO.EmotionJournalEntryStatusEnum.deleted;

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

  static getStream(id: Emotions.VO.EmotionJournalEntryIdType) {
    return `emotion_journal_entry_${id}`;
  }
}
