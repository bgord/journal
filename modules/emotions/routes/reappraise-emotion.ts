import * as Emotions from "+emotions";
import { CommandBus } from "+infra/command-bus";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import hono from "hono";

export async function ReappraiseEmotion(c: hono.Context, _next: hono.Next) {
  const body = await bg.safeParseBody(c);

  const emotionJournalEntryId = Emotions.VO.EntryId.parse(c.req.param("id"));

  const newEmotion = new Emotions.Entities.Emotion(
    new Emotions.VO.EmotionLabel(body.label),
    new Emotions.VO.EmotionIntensity(body.intensity),
  );

  const command = Emotions.Commands.ReappraiseEmotionCommand.parse({
    id: bg.NewUUID.generate(),
    correlationId: bg.CorrelationStorage.get(),
    name: Emotions.Commands.REAPPRAISE_EMOTION_COMMAND,
    createdAt: tools.Timestamp.parse(Date.now()),
    payload: { emotionJournalEntryId, newEmotion },
  } satisfies Emotions.Commands.ReappraiseEmotionCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
