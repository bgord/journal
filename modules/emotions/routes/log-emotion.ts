import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as infra from "+infra";
import hono from "hono";
import * as Emotions from "../";

export async function LogEmotion(c: hono.Context, _next: hono.Next) {
  const body = await bg.safeParseBody(c);

  const emotionJournalEntryId = Emotions.VO.EmotionJournalEntryId.parse(c.req.param("id"));

  const emotion = new Emotions.Entities.Emotion(
    new Emotions.VO.EmotionLabel(body.label),
    new Emotions.VO.EmotionIntensity(body.intensity),
  );

  const command = Emotions.Commands.LogEmotionCommand.parse({
    id: bg.NewUUID.generate(),
    correlationId: bg.CorrelationStorage.get(),
    name: Emotions.Commands.LOG_EMOTION_COMMAND,
    createdAt: tools.Timestamp.parse(Date.now()),
    payload: { emotionJournalEntryId, emotion },
  } satisfies Emotions.Commands.LogEmotionCommandType);

  await infra.CommandBus.emit(command.name, command);

  return new Response();
}
