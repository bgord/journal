import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import * as Entities from "../entities";
import * as Policies from "../policies";
import * as VO from "../value-objects";

export const SITUATION_LOGGED_EVENT = "SITUATION_LOGGED_EVENT";
export const SituationLoggedEvent = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(SITUATION_LOGGED_EVENT),
  version: z.literal(1),
  payload: z.object({
    id: VO.EmotionJournalEntryId,
    description: VO.SituationDescriptionSchema,
    location: VO.SituationLocationSchema,
    kind: VO.SituationKindSchema,
  }),
});
export type SituationLoggedEventType = z.infer<typeof SituationLoggedEvent>;

export const EMOTION_LOGGED_EVENT = "EMOTION_LOGGED_EVENT";
export const EmotionLoggedEvent = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(EMOTION_LOGGED_EVENT),
  version: z.literal(1),
  payload: z.object({
    id: VO.EmotionJournalEntryId,
    label: VO.EmotionLabelSchema,
    intensity: VO.EmotionIntensitySchema,
  }),
});
export type EmotionLoggedEventType = z.infer<typeof EmotionLoggedEvent>;

export const REACTION_LOGGED_EVENT = "REACTION_LOGGED_EVENT";
export const ReactionLoggedEvent = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(REACTION_LOGGED_EVENT),
  version: z.literal(1),
  payload: z.object({
    id: VO.EmotionJournalEntryId,
    type: VO.ReactionTypeSchema,
    effectiveness: VO.ReactionEffectivenessSchema,
    description: VO.ReactionDescriptionSchema,
  }),
});
export type ReactionLoggedEventType = z.infer<typeof ReactionLoggedEvent>;

export const EMOTION_REAPPRAISED_EVENT = "EMOTION_REAPPRAISED_EVENT";
export const EmotionReappraisedEvent = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(EMOTION_REAPPRAISED_EVENT),
  version: z.literal(1),
  payload: z.object({
    id: VO.EmotionJournalEntryId,
    newLabel: VO.EmotionLabelSchema,
    newIntensity: VO.EmotionIntensitySchema,
  }),
});
export type EmotionReappraisedEventType = z.infer<typeof EmotionReappraisedEvent>;

export const REACTION_EVALUATED_EVENT = "REACTION_EVALUATED_EVENT";
export const ReactionEvaluatedEvent = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(REACTION_EVALUATED_EVENT),
  version: z.literal(1),
  payload: z.object({
    id: VO.EmotionJournalEntryId,
    type: VO.ReactionTypeSchema,
    effectiveness: VO.ReactionEffectivenessSchema,
    description: VO.ReactionDescriptionSchema,
  }),
});
export type ReactionEvaluatedEventType = z.infer<typeof ReactionEvaluatedEvent>;

export type JournalEntryEventType =
  | SituationLoggedEventType
  | EmotionLoggedEventType
  | ReactionLoggedEventType
  | EmotionReappraisedEventType
  | ReactionEvaluatedEventType;

export class EmotionJournalEntry {
  private readonly id: VO.EmotionJournalEntryIdType;
  private startedAt?: VO.EmotionJournalEntryStartedAtType;
  private finishedAt?: VO.EmotionJournalEntryFinishedAtType;
  private situation?: Entities.Situation;
  private emotion?: Entities.Emotion;
  private reaction?: Entities.Reaction;

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

    const event = SituationLoggedEvent.parse({
      id: bg.NewUUID.generate(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: SITUATION_LOGGED_EVENT,
      stream: EmotionJournalEntry.getStream(this.id),
      version: 1,
      payload: {
        id: this.id,
        description: situation.description.get(),
        location: situation.location.get(),
        kind: situation.kind.get(),
      },
    } satisfies SituationLoggedEventType);

    this.record(event);
  }

  async logEmotion(emotion: Entities.Emotion) {
    await Policies.OneEmotionPerEntry.perform({
      emotion: this.emotion,
    });

    await Policies.EmotionCorrespondsToSituation.perform({
      situation: this.situation,
    });

    const event = EmotionLoggedEvent.parse({
      id: bg.NewUUID.generate(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: EMOTION_LOGGED_EVENT,
      stream: EmotionJournalEntry.getStream(this.id),
      version: 1,
      payload: {
        id: this.id,
        label: emotion.label.get(),
        intensity: emotion.intensity.get(),
      },
    } satisfies EmotionLoggedEventType);

    this.record(event);
  }

  async logReaction(reaction: Entities.Reaction) {
    await Policies.OneReactionPerEntry.perform({
      reaction: this.reaction,
    });

    await Policies.ReactionCorrespondsToSituationAndEmotion.perform({
      situation: this.situation,
      emotion: this.emotion,
    });

    const event = ReactionLoggedEvent.parse({
      id: bg.NewUUID.generate(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: REACTION_LOGGED_EVENT,
      stream: EmotionJournalEntry.getStream(this.id),
      version: 1,
      payload: {
        id: this.id,
        description: reaction.description.get(),
        type: reaction.type.get(),
        effectiveness: reaction.effectiveness.get(),
      },
    } satisfies ReactionLoggedEventType);

    this.record(event);
  }

  async reappraiseEmotion(newEmotion: Entities.Emotion) {
    await Policies.EmotionCorrespondsToSituation.perform({
      situation: this.situation,
    });

    await Policies.EmotionForReappraisalExists.perform({
      emotion: this.emotion,
    });

    const event = EmotionReappraisedEvent.parse({
      id: bg.NewUUID.generate(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: EMOTION_REAPPRAISED_EVENT,
      stream: EmotionJournalEntry.getStream(this.id),
      version: 1,
      payload: {
        id: this.id,
        newLabel: newEmotion.label.get(),
        newIntensity: newEmotion.intensity.get(),
      },
    } satisfies EmotionReappraisedEventType);

    this.record(event);
  }

  async evaluateReaction(newReaction: Entities.Reaction) {
    await Policies.ReactionCorrespondsToSituationAndEmotion.perform({
      situation: this.situation,
      emotion: this.emotion,
    });

    await Policies.ReactionForEvaluationExists.perform({
      reaction: this.reaction,
    });

    const event = ReactionEvaluatedEvent.parse({
      id: bg.NewUUID.generate(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: REACTION_EVALUATED_EVENT,
      stream: EmotionJournalEntry.getStream(this.id),
      version: 1,
      payload: {
        id: this.id,
        description: newReaction.description.get(),
        type: newReaction.type.get(),
        effectiveness: newReaction.effectiveness.get(),
      },
    } satisfies ReactionEvaluatedEventType);

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
      case SITUATION_LOGGED_EVENT: {
        this.startedAt = event.createdAt;
        this.situation = new Entities.Situation(
          new VO.SituationDescription(event.payload.description),
          new VO.SituationLocation(event.payload.location),
          new VO.SituationKind(event.payload.kind),
        );
        break;
      }

      case EMOTION_LOGGED_EVENT: {
        this.emotion = new Entities.Emotion(
          new VO.EmotionLabel(event.payload.label),
          new VO.EmotionIntensity(event.payload.intensity),
        );
        break;
      }

      case REACTION_LOGGED_EVENT: {
        this.finishedAt = event.createdAt;
        this.reaction = new Entities.Reaction(
          new VO.ReactionDescription(event.payload.description),
          new VO.ReactionType(event.payload.type),
          new VO.ReactionEffectiveness(event.payload.effectiveness),
        );
        break;
      }

      case EMOTION_REAPPRAISED_EVENT: {
        this.finishedAt = event.createdAt;
        this.emotion = new Entities.Emotion(
          new VO.EmotionLabel(event.payload.newLabel),
          new VO.EmotionIntensity(event.payload.newIntensity),
        );
        break;
      }

      case REACTION_EVALUATED_EVENT: {
        this.finishedAt = event.createdAt;
        this.reaction = new Entities.Reaction(
          new VO.ReactionDescription(event.payload.description),
          new VO.ReactionType(event.payload.type),
          new VO.ReactionEffectiveness(event.payload.effectiveness),
        );
        break;
      }
    }
  }

  static getStream(id: VO.EmotionJournalEntryIdType) {
    return `emotion_journal_entry_${id}`;
  }
}
