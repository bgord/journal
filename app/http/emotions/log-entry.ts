import * as bg from "@bgord/bun";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import * as Adapters from "+infra/adapters";
import { CommandBus } from "+infra/command-bus";

const deps = { IdProvider: Adapters.IdProvider, Clock: Adapters.Clock };

export async function LogEntry(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");
  const body = await bg.safeParseBody(c);

  const entryId = deps.IdProvider.generate();

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

  const command = Emotions.Commands.LogEntryCommand.parse({
    ...bg.createCommandEnvelope(deps),
    name: Emotions.Commands.LOG_ENTRY_COMMAND,
    payload: {
      entryId,
      situation,
      emotion,
      reaction,
      userId: user.id,
      origin: Emotions.VO.EntryOriginOption.web,
    },
  } satisfies Emotions.Commands.LogEntryCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
