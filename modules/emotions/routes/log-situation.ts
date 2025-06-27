import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import hono from "hono";
import * as infra from "../../../infra";
import * as Emotions from "../";

export async function LogSituation(c: hono.Context, _next: hono.Next) {
  const body = await bg.safeParseBody(c);

  const situation = new Emotions.Entities.Situation(
    new Emotions.VO.SituationDescription(body.description),
    new Emotions.VO.SituationLocation(body.location),
    new Emotions.VO.SituationKind(body.kind),
  );

  const id = bg.NewUUID.generate();

  infra.logger.info({
    message: "Log situation payload",
    operation: "read",
    metadata: { situation, id },
  });

  const command = Emotions.Commands.LogSituationCommand.parse({
    id: bg.NewUUID.generate(),
    name: Emotions.Commands.LOG_SITUATION_COMMAND,
    createdAt: tools.Timestamp.parse(Date.now()),
    payload: { id, situation },
  } satisfies Emotions.Commands.LogSituationCommandType);

  await infra.CommandBus.emit(command.name, command);

  return new Response();
}
