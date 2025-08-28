import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import * as System from "+system";

type AcceptedEvent = System.Events.HourHasPassedEventType;
type AcceptedCommand = Emotions.Commands.LogEntryCommandType;

type Dependencies = {
  EventBus: bg.EventBusLike<AcceptedEvent>;
  EventHandler: bg.EventHandler;
  CommandBus: bg.CommandBusLike<AcceptedCommand>;
  TimeCapsuleDueEntries: Emotions.Ports.TimeCapsuleDueEntriesPort;
};

export class TimeCapsuleEntriesScheduler {
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      System.Events.HOUR_HAS_PASSED_EVENT,
      deps.EventHandler.handle(this.onHourHasPassedEvent.bind(this)),
    );
  }

  async onHourHasPassedEvent() {
    const now = tools.Time.Now().value;
    const dueEntries = await this.deps.TimeCapsuleDueEntries.listDue(now);

    for (const entry of dueEntries) {
      if (
        Emotions.Invariants.TimeCapsuleEntryIsPublishable.fails({
          status: entry.status,
          now,
          scheduledFor: tools.Timestamp.parse(entry.scheduledFor),
        })
      )
        continue;

      const command = Emotions.Commands.LogEntryCommand.parse({
        ...bg.createCommandEnvelope(),
        name: Emotions.Commands.LOG_ENTRY_COMMAND,
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
          userId: entry.userId,
          origin: Emotions.VO.EntryOriginOption.time_capsule,
        },
      } satisfies Emotions.Commands.LogEntryCommandType);

      await this.deps.CommandBus.emit(command.name, command);
    }
  }
}
