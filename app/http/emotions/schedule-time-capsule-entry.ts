import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import * as Adapters from "+infra/adapters";
import { CommandBus } from "+infra/command-bus";

const deps = { IdProvider: Adapters.IdProvider, Clock: Adapters.Clock };

export async function ScheduleTimeCapsuleEntry(c: hono.Context<infra.HonoConfig>) {
  const userId = c.get("user").id;
  const body = await bg.safeParseBody(c);
  const timeZoneOffsetMs = c.get("timeZoneOffset").ms;

  const entryId = deps.IdProvider.generate();

  const situation = new Emotions.Entities.Situation(
    new Emotions.VO.SituationDescription(body.situationDescription),
    new Emotions.VO.SituationKind(body.situationKind),
  );

  const emotion = new Emotions.Entities.Emotion(
    new Emotions.VO.EmotionLabel(body.emotionLabel),
    new Emotions.VO.EmotionIntensity(Number(body.emotionIntensity)),
  );

  const reaction = new Emotions.Entities.Reaction(
    new Emotions.VO.ReactionDescription(body.reactionDescription),
    new Emotions.VO.ReactionType(body.reactionType),
    new Emotions.VO.ReactionEffectiveness(Number(body.reactionEffectiveness)),
  );

  const now = deps.Clock.nowMs();
  const scheduledFor = tools.Timestamp.parse(Number(body.scheduledFor) + timeZoneOffsetMs);

  const command = Emotions.Commands.ScheduleTimeCapsuleEntryCommand.parse({
    ...bg.createCommandEnvelope(deps),
    name: Emotions.Commands.SCHEDULE_TIME_CAPSULE_ENTRY_COMMAND,
    payload: { entryId, situation, emotion, reaction, userId, scheduledAt: now, scheduledFor },
  } satisfies Emotions.Commands.ScheduleTimeCapsuleEntryCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
