import * as Entities from "../entities";
import * as VO from "../value-objects";

export type SituationLoggedEvent = {
  type: "situation.logged";
  situation: {
    id: VO.EmotionJournalEntryIdType;
    description: VO.SituationDescriptionType;
    location: VO.SituationLocationType;
    kind: VO.SituationKindType;
  };
};

type JournalEntryEventType = SituationLoggedEvent;

export class EmotionJournalEntry {
  private readonly id: VO.EmotionJournalEntryIdType;
  private situation?: Entities.Situation;

  private readonly pending: JournalEntryEventType[] = [];

  private constructor(id: VO.EmotionJournalEntryIdType) {
    this.id = id;
  }

  static build(id: VO.EmotionJournalEntryIdType, events: JournalEntryEventType[]): EmotionJournalEntry {
    const entry = new EmotionJournalEntry(id);

    events.forEach((event) => entry.apply(event));

    return entry;
  }

  logSituation(situation: Entities.Situation) {
    if (this.situation) {
      throw new Error("Situation already logged for this entry.");
    }

    const SituationLoggedEvent: SituationLoggedEvent = {
      type: "situation.logged",
      situation: {
        id: this.id,
        description: situation.description.get(),
        location: situation.location.get(),
        kind: situation.kind.get(),
      },
    };

    this.record(SituationLoggedEvent);
  }

  pullEvents(): JournalEntryEventType[] {
    const events = [...this.pending];

    this.pending.length = 0;

    return events;
  }

  private record(event: JournalEntryEventType): void {
    this.pending.push(event);
    this.apply(event);
  }

  private apply(event: JournalEntryEventType): void {
    switch (event.type) {
      case "situation.logged": {
        this.situation = new Entities.Situation(
          new VO.SituationDescription(event.situation.description),
          new VO.SituationLocation(event.situation.location),
          new VO.SituationKind(event.situation.kind),
        );
      }
    }
  }
}
