import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import * as Entities from "../entities";
import * as Events from "../events";
import * as Policies from "../policies";
import * as VO from "../value-objects";

export type JournalEntryEvent = (typeof EmotionJournalEntry)["events"][number];
type JournalEntryEventType = z.infer<JournalEntryEvent>;

export class EmotionJournalEntry {
  static events = [
    Events.SituationLoggedEvent,
    Events.EmotionLoggedEvent,
    Events.ReactionLoggedEvent,
    Events.EmotionReappraisedEvent,
    Events.ReactionEvaluatedEvent,
    Events.EmotionJournalEntryDeletedEvent,
  ];

  private readonly id: VO.EmotionJournalEntryIdType;
  private startedAt?: VO.EmotionJournalEntryStartedAtType;
  private finishedAt?: VO.EmotionJournalEntryFinishedAtType;
  private situation?: Entities.Situation;
  private emotion?: Entities.Emotion;
  private reaction?: Entities.Reaction;
  private status: VO.EmotionJournalEntryStatusEnum = VO.EmotionJournalEntryStatusEnum.actionable;

  private readonly pending: JournalEntryEventType[] = [];

  private constructor(id: VO.EmotionJournalEntryIdType) {
    this.id = id;
  }

  static create(id: VO.EmotionJournalEntryIdType): EmotionJournalEntry {
    return new EmotionJournalEntry(id);
  }

  static build(id: VO.EmotionJournalEntryIdType, events: JournalEntryEventType[]): EmotionJournalEntry {
    const entry = new EmotionJournalEntry(id);

    events.forEach((event) => entry.apply(event));

    return entry;
  }

  async logSituation(situation: Entities.Situation) {
    await Policies.OneSituationPerEntry.perform({
      situation: this.situation,
    });

    const event = Events.SituationLoggedEvent.parse({
      id: bg.NewUUID.generate(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.SITUATION_LOGGED_EVENT,
      stream: EmotionJournalEntry.getStream(this.id),
      version: 1,
      payload: {
        id: this.id,
        description: situation.description.get(),
        location: situation.location.get(),
        kind: situation.kind.get(),
      },
    } satisfies Events.SituationLoggedEventType);

    this.record(event);
  }

  async logEmotion(emotion: Entities.Emotion) {
    await Policies.EntryIsActionable.perform({
      status: this.status,
    });

    await Policies.OneEmotionPerEntry.perform({
      emotion: this.emotion,
    });

    await Policies.EmotionCorrespondsToSituation.perform({
      situation: this.situation,
    });

    const event = Events.EmotionLoggedEvent.parse({
      id: bg.NewUUID.generate(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.EMOTION_LOGGED_EVENT,
      stream: EmotionJournalEntry.getStream(this.id),
      version: 1,
      payload: {
        id: this.id,
        label: emotion.label.get(),
        intensity: emotion.intensity.get(),
      },
    } satisfies Events.EmotionLoggedEventType);

    this.record(event);
  }

  async logReaction(reaction: Entities.Reaction) {
    await Policies.EntryIsActionable.perform({
      status: this.status,
    });

    await Policies.OneReactionPerEntry.perform({
      reaction: this.reaction,
    });

    await Policies.ReactionCorrespondsToSituationAndEmotion.perform({
      situation: this.situation,
      emotion: this.emotion,
    });

    const event = Events.ReactionLoggedEvent.parse({
      id: bg.NewUUID.generate(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.REACTION_LOGGED_EVENT,
      stream: EmotionJournalEntry.getStream(this.id),
      version: 1,
      payload: {
        id: this.id,
        description: reaction.description.get(),
        type: reaction.type.get(),
        effectiveness: reaction.effectiveness.get(),
      },
    } satisfies Events.ReactionLoggedEventType);

    this.record(event);
  }

  async reappraiseEmotion(newEmotion: Entities.Emotion) {
    await Policies.EntryIsActionable.perform({
      status: this.status,
    });

    await Policies.EmotionCorrespondsToSituation.perform({
      situation: this.situation,
    });

    await Policies.EmotionForReappraisalExists.perform({
      emotion: this.emotion,
    });

    const event = Events.EmotionReappraisedEvent.parse({
      id: bg.NewUUID.generate(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.EMOTION_REAPPRAISED_EVENT,
      stream: EmotionJournalEntry.getStream(this.id),
      version: 1,
      payload: {
        id: this.id,
        newLabel: newEmotion.label.get(),
        newIntensity: newEmotion.intensity.get(),
      },
    } satisfies Events.EmotionReappraisedEventType);

    this.record(event);
  }

  async evaluateReaction(newReaction: Entities.Reaction) {
    await Policies.EntryIsActionable.perform({
      status: this.status,
    });

    await Policies.ReactionCorrespondsToSituationAndEmotion.perform({
      situation: this.situation,
      emotion: this.emotion,
    });

    await Policies.ReactionForEvaluationExists.perform({
      reaction: this.reaction,
    });

    const event = Events.ReactionEvaluatedEvent.parse({
      id: bg.NewUUID.generate(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.REACTION_EVALUATED_EVENT,
      stream: EmotionJournalEntry.getStream(this.id),
      version: 1,
      payload: {
        id: this.id,
        description: newReaction.description.get(),
        type: newReaction.type.get(),
        effectiveness: newReaction.effectiveness.get(),
      },
    } satisfies Events.ReactionEvaluatedEventType);

    this.record(event);
  }

  async delete() {
    await Policies.EntryHasBenStarted.perform({ situation: this.situation });

    const event = Events.EmotionJournalEntryDeletedEvent.parse({
      id: bg.NewUUID.generate(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.EMOTION_JOURNAL_ENTRY_DELETED_EVENT,
      stream: EmotionJournalEntry.getStream(this.id),
      version: 1,
      payload: { id: this.id },
    } satisfies Events.EmotionJournalEntryDeletedEventType);

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
      case Events.SITUATION_LOGGED_EVENT: {
        this.startedAt = event.createdAt;
        this.situation = new Entities.Situation(
          new VO.SituationDescription(event.payload.description),
          new VO.SituationLocation(event.payload.location),
          new VO.SituationKind(event.payload.kind),
        );
        break;
      }

      case Events.EMOTION_LOGGED_EVENT: {
        this.emotion = new Entities.Emotion(
          new VO.EmotionLabel(event.payload.label),
          new VO.EmotionIntensity(event.payload.intensity),
        );
        break;
      }

      case Events.REACTION_LOGGED_EVENT: {
        this.finishedAt = event.createdAt;
        this.reaction = new Entities.Reaction(
          new VO.ReactionDescription(event.payload.description),
          new VO.ReactionType(event.payload.type),
          new VO.ReactionEffectiveness(event.payload.effectiveness),
        );
        break;
      }

      case Events.EMOTION_REAPPRAISED_EVENT: {
        this.finishedAt = event.createdAt;
        this.emotion = new Entities.Emotion(
          new VO.EmotionLabel(event.payload.newLabel),
          new VO.EmotionIntensity(event.payload.newIntensity),
        );
        break;
      }

      case Events.REACTION_EVALUATED_EVENT: {
        this.finishedAt = event.createdAt;
        this.reaction = new Entities.Reaction(
          new VO.ReactionDescription(event.payload.description),
          new VO.ReactionType(event.payload.type),
          new VO.ReactionEffectiveness(event.payload.effectiveness),
        );
        break;
      }

      case Events.EMOTION_JOURNAL_ENTRY_DELETED_EVENT: {
        this.status = VO.EmotionJournalEntryStatusEnum.deleted;

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

  static getStream(id: VO.EmotionJournalEntryIdType) {
    return `emotion_journal_entry_${id}`;
  }
}
