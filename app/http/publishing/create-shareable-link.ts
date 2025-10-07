import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import type * as infra from "+infra";
import * as Publishing from "+publishing";
import * as Adapters from "+infra/adapters";
import { CommandBus } from "+infra/command-bus";

const deps = { IdProvider: Adapters.IdProvider, Clock: Adapters.Clock };

export async function CreateShareableLink(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const requesterId = c.get("user").id;
  const body = await bg.safeParseBody(c);
  const timeZoneOffsetMs = c.get("timeZoneOffset").ms;

  const publicationSpecification = Publishing.VO.PublicationSpecification.parse(
    body.publicationSpecification,
  );

  const durationMs = tools.Duration.Ms(Number(body.durationMs)).ms;

  const dateRangeStart = tools.Timestamp.parse(Number(body.dateRangeStart) + timeZoneOffsetMs);
  const dateRangeEnd = tools.Timestamp.parse(Number(body.dateRangeEnd) + timeZoneOffsetMs);

  const dateRange = new tools.DateRange(dateRangeStart, dateRangeEnd);

  const shareableLinkId = deps.IdProvider.generate();

  const command = Publishing.Commands.CreateShareableLinkCommand.parse({
    ...bg.createCommandEnvelope(deps),
    name: Publishing.Commands.CREATE_SHAREABLE_LINK_COMMAND,
    payload: { shareableLinkId, requesterId, durationMs, publicationSpecification, dateRange },
  } satisfies Publishing.Commands.CreateShareableLinkCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
