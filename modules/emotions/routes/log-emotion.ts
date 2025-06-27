import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import hono from "hono";
import * as infra from "../../../infra";
import * as Emotions from "../";

export async function LogEmotion(c: hono.Context, _next: hono.Next) {
  const body = await bg.safeParseBody(c);

  const id = Emotions.VO.EmotionJournalEntryId.parse(c.req.param("id"));

  const emotion = new Emotions.Entities.Emotion(
    new Emotions.VO.EmotionLabel(body.label),
    new Emotions.VO.EmotionIntensity(body.intensity),
  );

  infra.logger.info({
    message: "Log emotion payload",
    operation: "read",
    metadata: { emotion, id },
  });

  const command = Emotions.Commands.LogEmotionCommand.parse({
    id: bg.NewUUID.generate(),
    name: Emotions.Commands.LOG_EMOTION_COMMAND,
    createdAt: tools.Timestamp.parse(Date.now()),
    payload: { id, emotion },
  } satisfies Emotions.Commands.LogEmotionCommandType);

  await infra.CommandBus.emit(command.name, command);

  return new Response();
}
