import * as Emotions from "+emotions";
import { CommandBus } from "+infra/command-bus";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import hono from "hono";

export async function LogEntry(c: hono.Context, _next: hono.Next) {
  const body = await bg.safeParseBody(c);

  const emotionJournalEntryId = bg.NewUUID.generate();

  const situation = new Emotions.Entities.Situation(
    new Emotions.VO.SituationDescription(body.situation?.description),
    new Emotions.VO.SituationLocation(body.situation?.location),
    new Emotions.VO.SituationKind(body.situation?.kind),
  );

  const emotion = new Emotions.Entities.Emotion(
    new Emotions.VO.EmotionLabel(body.emotion?.label),
    new Emotions.VO.EmotionIntensity(Number(body.emotion?.intensity)),
  );

  const reaction = new Emotions.Entities.Reaction(
    new Emotions.VO.ReactionDescription(body.reaction?.description),
    new Emotions.VO.ReactionType(body.reaction?.type),
    new Emotions.VO.ReactionEffectiveness(Number(body.reaction?.effectiveness)),
  );

  const command = Emotions.Commands.LogEntryCommand.parse({
    id: bg.NewUUID.generate(),
    correlationId: bg.CorrelationStorage.get(),
    name: Emotions.Commands.LOG_ENTRY_COMMAND,
    createdAt: tools.Timestamp.parse(Date.now()),
    payload: { emotionJournalEntryId, situation, emotion, reaction },
  } satisfies Emotions.Commands.LogEntryCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
