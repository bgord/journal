import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as v from "valibot";
import type * as infra from "+infra";
import * as Publishing from "+publishing";
import * as wip from "+infra/build";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Publishing.Commands.CreateShareableLinkCommandType>;
};

export const CreateShareableLink = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const requesterId = c.get("user").id;
  const body = await c.req.json();
  const timeZoneOffset = c.get("timeZoneOffset");

  const publicationSpecification = v.parse(
    Publishing.VO.PublicationSpecification,
    body.publicationSpecification,
  );

  const duration = tools.Duration.Ms(body.durationMs);

  const start = tools.Day.fromIsoId(v.parse(tools.DayIsoId, body.dateRangeStart)).getStart();
  const end = tools.Day.fromIsoId(v.parse(tools.DayIsoId, body.dateRangeEnd)).getEnd();

  const dateRange = new tools.DateRange(start.add(timeZoneOffset), end.add(timeZoneOffset));

  const shareableLinkId = deps.IdProvider.generate();

  const command = wip.command(
    Publishing.Commands.CreateShareableLinkCommand,
    {
      payload: { shareableLinkId, requesterId, durationMs: duration.ms, publicationSpecification, dateRange },
    },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
