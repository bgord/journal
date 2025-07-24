import * as Emotions from "+emotions";
import type * as infra from "+infra";
import { CommandBus } from "+infra/command-bus";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import hono from "hono";

export async function ReappraiseEmotion(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");
  const body = await bg.safeParseBody(c);
  const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));
  const entryId = Emotions.VO.EntryId.parse(c.req.param("entryId"));

  const newEmotion = new Emotions.Entities.Emotion(
    new Emotions.VO.EmotionLabel(body.label),
    new Emotions.VO.EmotionIntensity(Number(body.intensity)),
  );

  const command = Emotions.Commands.ReappraiseEmotionCommand.parse({
    id: crypto.randomUUID(),
    correlationId: bg.CorrelationStorage.get(),
    name: Emotions.Commands.REAPPRAISE_EMOTION_COMMAND,
    createdAt: tools.Timestamp.parse(Date.now()),
    revision,
    payload: { entryId, newEmotion, userId: user.id },
  } satisfies Emotions.Commands.ReappraiseEmotionCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
