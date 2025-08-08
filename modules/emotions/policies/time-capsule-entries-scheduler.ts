import * as Events from "+app/events";
import * as Commands from "+emotions/commands";
import * as Entities from "+emotions/entities";
import * as Repos from "+emotions/repositories";
import * as VO from "+emotions/value-objects";
import { CommandBus } from "+infra/command-bus";
import type { EventBus } from "+infra/event-bus";
import { SupportedLanguages } from "+infra/i18n";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export class TimeCapsuleEntriesScheduler {
  constructor(private readonly eventBus: typeof EventBus) {
    this.eventBus.on(Events.HOUR_HAS_PASSED_EVENT, this.onHourHasPassed.bind(this));
  }

  async onHourHasPassed() {
    const now = tools.Timestamp.parse(Date.now());
    const entries = await Repos.TimeCapsuleEntryRepository.listDueForScheduling(now);

    for (const entry of entries) {
      const command = Commands.LogEntryCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.LOG_ENTRY_COMMAND,
        createdAt: tools.Timestamp.parse(Date.now()),
        payload: {
          entryId: entry.id,
          situation: new Entities.Situation(
            new VO.SituationDescription(entry.situationDescription),
            new VO.SituationLocation(entry.situationLocation),
            new VO.SituationKind(entry.situationKind as VO.SituationKindOptions),
          ),
          emotion: new Entities.Emotion(
            new VO.EmotionLabel(entry.emotionLabel as VO.GenevaWheelEmotion),
            new VO.EmotionIntensity(entry.emotionIntensity),
          ),
          reaction: new Entities.Reaction(
            new VO.ReactionDescription(entry.reactionDescription),
            new VO.ReactionType(entry.reactionType as VO.ReactionTypeType),
            new VO.ReactionEffectiveness(entry.reactionEffectiveness),
          ),
          language: entry.language as SupportedLanguages,
          userId: entry.userId,
        },
      } satisfies Commands.LogEntryCommandType);

      await CommandBus.emit(command.name, command);
    }
  }
}
