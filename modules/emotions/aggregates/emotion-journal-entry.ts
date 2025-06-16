import * as Entities from "../entities";
import * as Policies from "../policies";
import * as VO from "../value-objects";

export type SituationLoggedEvent = {
  type: "situation.logged";
  id: VO.EmotionJournalEntryIdType;
  situation: {
    description: VO.SituationDescriptionType;
    location: VO.SituationLocationType;
    kind: VO.SituationKindType;
  };
};

export type EmotionLoggedEvent = {
  type: "emotion.logged";
  id: VO.EmotionJournalEntryIdType;
  emotion: {
    label: VO.EmotionLabelType;
    intensity: VO.EmotionIntensityType;
  };
};

export type ReactionLoggedEvent = {
  type: "reaction.logged";
  id: VO.EmotionJournalEntryIdType;
  reaction: {
    type: VO.ReactionTypeType;
    effectiveness: VO.ReactionEffectivenessType;
    description: VO.ReactionDescriptionType;
  };
};

type JournalEntryEventType = SituationLoggedEvent | EmotionLoggedEvent | ReactionLoggedEvent;

export class EmotionJournalEntry {
  private readonly id: VO.EmotionJournalEntryIdType;
  private situation?: Entities.Situation;
  private emotion?: Entities.Emotion;
  private reaction?: Entities.Reaction;

  private readonly pending: JournalEntryEventType[] = [];

  private constructor(id: VO.EmotionJournalEntryIdType) {
    this.id = id;
  }

  static build(id: VO.EmotionJournalEntryIdType, events: JournalEntryEventType[]): EmotionJournalEntry {
    const entry = new EmotionJournalEntry(id);

    events.forEach((event) => entry.apply(event));

    return entry;
  }

  async logSituation(situation: Entities.Situation) {
    await Policies.OneSituationPerEmotionJournalEntry.perform({
      situation: this.situation,
    });

    const SituationLoggedEvent: SituationLoggedEvent = {
      type: "situation.logged",
      id: this.id,
      situation: {
        description: situation.description.get(),
        location: situation.location.get(),
        kind: situation.kind.get(),
      },
    };

    this.record(SituationLoggedEvent);
  }

  async logEmotion(emotion: Entities.Emotion) {
    await Policies.OneEmotionPerEmotionJournalEntry.perform({
      emotion: this.emotion,
    });

    await Policies.EmotionCorrespondsToSituation.perform({
      situation: this.situation,
      emotion: this.emotion,
    });

    const EmotionLoggedEvent: EmotionLoggedEvent = {
      type: "emotion.logged",
      id: this.id,
      emotion: {
        label: emotion.label.get(),
        intensity: emotion.intensity.get(),
      },
    };

    this.record(EmotionLoggedEvent);
  }

  async logReaction(reaction: Entities.Reaction) {
    await Policies.OneReactionPerEmotionJournalEntry.perform({
      reaction: this.reaction,
    });

    await Policies.ReactionCorrespondsToSituationAndEmotion.perform({
      situation: this.situation,
      emotion: this.emotion,
    });

    const ReactionLoggedEvent: ReactionLoggedEvent = {
      type: "reaction.logged",
      id: this.id,
      reaction: {
        description: reaction.description.get(),
        type: reaction.type.get(),
        effectiveness: reaction.effectiveness.get(),
      },
    };

    this.record(ReactionLoggedEvent);
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
    switch (event.type) {
      case "situation.logged": {
        this.situation = new Entities.Situation(
          new VO.SituationDescription(event.situation.description),
          new VO.SituationLocation(event.situation.location),
          new VO.SituationKind(event.situation.kind),
        );
        break;
      }

      case "emotion.logged": {
        this.emotion = new Entities.Emotion(
          new VO.EmotionLabel(event.emotion.label),
          new VO.EmotionIntensity(event.emotion.intensity),
        );
        break;
      }

      case "reaction.logged": {
        this.reaction = new Entities.Reaction(
          new VO.ReactionDescription(event.reaction.description),
          new VO.ReactionType(event.reaction.type),
          new VO.ReactionEffectiveness(event.reaction.effectiveness),
        );
        break;
      }
    }
  }
}
