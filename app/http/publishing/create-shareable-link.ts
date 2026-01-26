import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import type * as infra from "+infra";
import * as Publishing from "+publishing";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusLike<Publishing.Commands.CreateShareableLinkCommandType>;
};

export const CreateShareableLink = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const requesterId = c.get("user").id;
  const body = await c.req.json();
  const timeZoneOffset = c.get("timeZoneOffset");

  const publicationSpecification = Publishing.VO.PublicationSpecification.parse(
    body.publicationSpecification,
  );

  const duration = tools.Duration.Ms(body.durationMs);

  const start = tools.Day.fromIsoId(tools.DayIsoId.parse(body.dateRangeStart)).getStart();
  const end = tools.Day.fromIsoId(tools.DayIsoId.parse(body.dateRangeEnd)).getEnd();

  const dateRange = new tools.DateRange(start.add(timeZoneOffset), end.add(timeZoneOffset));

  const shareableLinkId = deps.IdProvider.generate();

  const command = Publishing.Commands.CreateShareableLinkCommand.parse({
    ...bg.createCommandEnvelope(deps),
    name: Publishing.Commands.CREATE_SHAREABLE_LINK_COMMAND,
    payload: { shareableLinkId, requesterId, durationMs: duration.ms, publicationSpecification, dateRange },
  } satisfies Publishing.Commands.CreateShareableLinkCommandType);

  await deps.CommandBus.emit(command.name, command);

  return new Response();
};
