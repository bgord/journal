import * as Emotions from "+emotions";
import * as infra from "+infra";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import hono from "hono";

export async function LogSituation(c: hono.Context, _next: hono.Next) {
  const body = await bg.safeParseBody(c);

  const emotionJournalEntryId = bg.NewUUID.generate();

  const situation = new Emotions.Entities.Situation(
    new Emotions.VO.SituationDescription(body.description),
    new Emotions.VO.SituationLocation(body.location),
    new Emotions.VO.SituationKind(body.kind),
  );

  const command = Emotions.Commands.LogSituationCommand.parse({
    id: bg.NewUUID.generate(),
    correlationId: bg.CorrelationStorage.get(),
    name: Emotions.Commands.LOG_SITUATION_COMMAND,
    createdAt: tools.Timestamp.parse(Date.now()),
    payload: { emotionJournalEntryId, situation },
  } satisfies Emotions.Commands.LogSituationCommandType);

  await infra.CommandBus.emit(command.name, command);

  return new Response();
}
