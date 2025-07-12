import * as Emotions from "+emotions";
import { CommandBus } from "+infra/command-bus";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import hono from "hono";

export async function LogEntry(c: hono.Context, _next: hono.Next) {
  const body = await bg.safeParseBody(c);

  const entryId = bg.NewUUID.generate();

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
    id: bg.NewUUID.generate(),
    correlationId: bg.CorrelationStorage.get(),
    name: Emotions.Commands.LOG_ENTRY_COMMAND,
    createdAt: tools.Timestamp.parse(Date.now()),
    payload: { entryId, situation, emotion, reaction },
  } satisfies Emotions.Commands.LogEntryCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
