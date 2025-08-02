import type * as infra from "+infra";
import { CommandBus } from "+infra/command-bus";
import * as Publishing from "+publishing";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import hono from "hono";

export async function CreateShareableLink(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");
  const body = await bg.safeParseBody(c);
  const timeZoneOffsetMs = c.get("timeZoneOffset").miliseconds;

  const publicationSpecification = Publishing.VO.PublicationSpecification.parse(
    body.publicationSpecification,
  );

  const durationMs = tools.Timestamp.parse(Number(body.durationMs));
  const duration = tools.Time.Ms(durationMs);

  const dateRangeStart = tools.Timestamp.parse(Number(body.dateRangeStart) + timeZoneOffsetMs);
  const dateRangeEnd = tools.Timestamp.parse(Number(body.dateRangeEnd) + timeZoneOffsetMs);

  const dateRange = new tools.DateRange(dateRangeStart, dateRangeEnd);

  const shareableLinkId = crypto.randomUUID();

  const command = Publishing.Commands.CreateShareableLinkCommand.parse({
    id: crypto.randomUUID(),
    correlationId: bg.CorrelationStorage.get(),
    name: Publishing.Commands.CREATE_SHAREABLE_LINK_COMMAND,
    createdAt: tools.Timestamp.parse(Date.now()),
    payload: {
      shareableLinkId,
      requesterId: user.id,
      duration,
      publicationSpecification,
      dateRange,
    },
  } satisfies Publishing.Commands.CreateShareableLinkCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
