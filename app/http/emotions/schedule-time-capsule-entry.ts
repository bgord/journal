import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusLike<Emotions.Commands.ScheduleTimeCapsuleEntryCommandType>;
};

export const ScheduleTimeCapsuleEntry = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;
  const body = await c.req.json();
  const timeZoneOffset = c.get("timeZoneOffset");

  const entryId = deps.IdProvider.generate();

  const situation = new Emotions.Entities.Situation(
    new Emotions.VO.SituationDescription(body.situationDescription),
    new Emotions.VO.SituationKind(body.situationKind),
  );

  const emotion = new Emotions.Entities.Emotion(
    new Emotions.VO.EmotionLabel(body.emotionLabel),
    new Emotions.VO.EmotionIntensity(body.emotionIntensity),
  );

  const reaction = new Emotions.Entities.Reaction(
    new Emotions.VO.ReactionDescription(body.reactionDescription),
    new Emotions.VO.ReactionType(body.reactionType),
    new Emotions.VO.ReactionEffectiveness(body.reactionEffectiveness),
  );

  const now = deps.Clock.now().ms;
  const scheduledFor = tools.Day.fromIsoId(body.scheduledFor)
    .getStart()
    .add(timeZoneOffset)
    .add(tools.Duration.Hours(tools.Hour.fromValueSafe(body.scheduledForHour).get())).ms;

  const command = Emotions.Commands.ScheduleTimeCapsuleEntryCommand.parse({
    ...bg.createCommandEnvelope(deps),
    name: Emotions.Commands.SCHEDULE_TIME_CAPSULE_ENTRY_COMMAND,
    payload: { entryId, situation, emotion, reaction, userId, scheduledAt: now, scheduledFor },
  } satisfies Emotions.Commands.ScheduleTimeCapsuleEntryCommandType);

  await deps.CommandBus.emit(command.name, command);

  return new Response();
};
