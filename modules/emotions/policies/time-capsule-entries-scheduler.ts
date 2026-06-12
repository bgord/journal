import * as bg from "@bgord/bun";
import type * as Emotions from "+emotions";
import { LogEntryCommand } from "../commands/LOG_ENTRY_COMMAND";
import { Emotion } from "../entities/emotion";
import { Reaction } from "../entities/reaction";
import { Situation } from "../entities/situation";
import { TimeCapsuleEntryIsPublishable } from "../invariants/time-capsule-entry-is-publishable";
import { EmotionIntensity } from "../value-objects/emotion-intensity";
import { EmotionLabel } from "../value-objects/emotion-label";
import { EntryOriginOption } from "../value-objects/entry-origin-option";
import { ReactionDescription } from "../value-objects/reaction-description";
import { ReactionEffectiveness } from "../value-objects/reaction-effectiveness";
import { ReactionType } from "../value-objects/reaction-type";
import { SituationDescription } from "../value-objects/situation-description";
import { SituationKind } from "../value-objects/situation-kind";

type AcceptedEvent = bg.System.Events.HourHasPassedEventType;
type AcceptedCommand = Emotions.Commands.LogEntryCommandType;

type Dependencies = {
  EventBus: bg.EventBusPort<AcceptedEvent>;
  EventHandler: bg.EventHandlerStrategy;
  CommandBus: bg.CommandBusPort<AcceptedCommand>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  TimeCapsuleDueEntries: Emotions.Ports.TimeCapsuleDueEntriesPort;
};

export class TimeCapsuleEntriesScheduler {
  // Stryker disable all
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      bg.System.Events.HOUR_HAS_PASSED_EVENT,
      deps.EventHandler.handle(this.onHourHasPassedEvent.bind(this)),
    );
  }
  // Stryker restore all

  async onHourHasPassedEvent(_event: bg.System.Events.HourHasPassedEventType) {
    const now = this.deps.Clock.now();

    const dueEntries = await this.deps.TimeCapsuleDueEntries.listDue(now);

    for (const entry of dueEntries) {
      const config = { status: entry.status, now, scheduledFor: entry.scheduledFor };

      if (!TimeCapsuleEntryIsPublishable.passes(config)) continue;

      const command = bg.command(
        LogEntryCommand,
        {
          payload: {
            entryId: entry.id,
            situation: new Situation(
              new SituationDescription(entry.situationDescription),
              new SituationKind(entry.situationKind),
            ),
            emotion: new Emotion(
              new EmotionLabel(entry.emotionLabel),
              new EmotionIntensity(entry.emotionIntensity),
            ),
            reaction: new Reaction(
              new ReactionDescription(entry.reactionDescription),
              new ReactionType(entry.reactionType),
              new ReactionEffectiveness(entry.reactionEffectiveness),
            ),
            userId: entry.userId,
            origin: EntryOriginOption.time_capsule,
          },
        },
        this.deps,
      );

      await this.deps.CommandBus.emit(command);
    }
  }
}
