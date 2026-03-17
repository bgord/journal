import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as v from "valibot";
import * as Emotions from "+emotions";
import type * as infra from "+infra";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Emotions.Commands.ReappraiseEmotionCommandType>;
};

export const ReappraiseEmotion = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;
  const body = await c.req.json();
  const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));
  const entryId = v.parse(Emotions.VO.EntryId, c.req.param("entryId"));

  const newEmotion = new Emotions.Entities.Emotion(
    new Emotions.VO.EmotionLabel(body.label),
    new Emotions.VO.EmotionIntensity(body.intensity),
  );

  const command = v.parse(Emotions.Commands.ReappraiseEmotionCommand, {
    ...bg.createCommandEnvelope(deps),
    name: Emotions.Commands.REAPPRAISE_EMOTION_COMMAND,
    revision,
    payload: { entryId, newEmotion, userId },
  } satisfies Emotions.Commands.ReappraiseEmotionCommandType);

  await deps.CommandBus.emit(command);

  return new Response();
};
