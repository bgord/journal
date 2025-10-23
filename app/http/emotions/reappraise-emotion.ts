import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import * as Adapters from "+infra/adapters";
import { CommandBus } from "+infra/command-bus";

const deps = { IdProvider: Adapters.IdProvider, Clock: Adapters.Clock };

export async function ReappraiseEmotion(c: hono.Context<infra.HonoConfig>) {
  const userId = c.get("user").id;
  const body = await bg.safeParseBody(c);
  const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));
  const entryId = Emotions.VO.EntryId.parse(c.req.param("entryId"));

  const newEmotion = new Emotions.Entities.Emotion(
    new Emotions.VO.EmotionLabel(body.label),
    new Emotions.VO.EmotionIntensity(Number(body.intensity)),
  );

  const command = Emotions.Commands.ReappraiseEmotionCommand.parse({
    ...bg.createCommandEnvelope(deps),
    name: Emotions.Commands.REAPPRAISE_EMOTION_COMMAND,
    revision,
    payload: { entryId, newEmotion, userId },
  } satisfies Emotions.Commands.ReappraiseEmotionCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
