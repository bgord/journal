import * as Emotions from "+emotions";
import type * as infra from "+infra";
import { CommandBus } from "+infra/command-bus";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import hono from "hono";

export async function ScheduleTimeCapsuleEntry(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");
  const body = await bg.safeParseBody(c);
  const language = c.get("language");
  const timeZoneOffsetMs = c.get("timeZoneOffset").miliseconds;

  const entryId = crypto.randomUUID();

  const situation = new Emotions.Entities.Situation(
    new Emotions.VO.SituationDescription(body.situationDescription),
    new Emotions.VO.SituationLocation(body.situationLocation),
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

  const now = tools.Time.Now().value;
  const scheduledFor = tools.Timestamp.parse(Number(body.scheduledFor) + timeZoneOffsetMs);

  const command = Emotions.Commands.ScheduleTimeCapsuleEntryCommand.parse({
    id: crypto.randomUUID(),
    correlationId: bg.CorrelationStorage.get(),
    name: Emotions.Commands.SCHEDULE_TIME_CAPSULE_ENTRY_COMMAND,
    createdAt: now,
    payload: {
      entryId,
      situation,
      emotion,
      reaction,
      language,
      userId: user.id,
      scheduledAt: now,
      scheduledFor,
    },
  } satisfies Emotions.Commands.ScheduleTimeCapsuleEntryCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
