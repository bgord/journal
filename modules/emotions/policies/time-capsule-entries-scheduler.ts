import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import * as Events from "+app/events";
import { CommandBus } from "+infra/command-bus";
import type { EventBus } from "+infra/event-bus";
import { SupportedLanguages } from "+infra/i18n";

export class TimeCapsuleEntriesScheduler {
  constructor(private readonly eventBus: typeof EventBus) {
    this.eventBus.on(Events.HOUR_HAS_PASSED_EVENT, this.onHourHasPassed.bind(this));
  }

  async onHourHasPassed() {
    const now = tools.Time.Now().value;
    const entries = await Emotions.Repos.TimeCapsuleEntryRepository.listDueForPublishing(now);

    for (const entry of entries) {
      if (
        Emotions.Invariants.TimeCapsuleEntryIsPublishable.fails({
          status: entry.status,
          now,
          scheduledFor: tools.Timestamp.parse(entry.scheduledFor),
        })
      )
        continue;

      const command = Emotions.Commands.LogEntryCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Emotions.Commands.LOG_ENTRY_COMMAND,
        createdAt: tools.Time.Now().value,
        payload: {
          entryId: entry.id,
          situation: new Emotions.Entities.Situation(
            new Emotions.VO.SituationDescription(entry.situationDescription),
            new Emotions.VO.SituationLocation(entry.situationLocation),
            new Emotions.VO.SituationKind(entry.situationKind as Emotions.VO.SituationKindOptions),
          ),
          emotion: new Emotions.Entities.Emotion(
            new Emotions.VO.EmotionLabel(entry.emotionLabel as Emotions.VO.GenevaWheelEmotion),
            new Emotions.VO.EmotionIntensity(entry.emotionIntensity),
          ),
          reaction: new Emotions.Entities.Reaction(
            new Emotions.VO.ReactionDescription(entry.reactionDescription),
            new Emotions.VO.ReactionType(entry.reactionType as Emotions.VO.ReactionTypeType),
            new Emotions.VO.ReactionEffectiveness(entry.reactionEffectiveness),
          ),
          language: entry.language as SupportedLanguages,
          userId: entry.userId,
          origin: Emotions.VO.EntryOriginOption.time_capsule,
        },
      } satisfies Emotions.Commands.LogEntryCommandType);

      await CommandBus.emit(command.name, command);
    }
  }
}
