import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as v from "valibot";
import type * as infra from "+infra";
import * as Publishing from "+publishing";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Publishing.Commands.CreateShareableLinkCommandType>;
};

export const CreateShareableLink = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const context = new bg.RequestContextHonoAdapter(c);
  const body = await context.request.json();

  const requesterId = context.identity.userId() as bg.UUIDType;
  const timeZoneOffset = context.middleware.timeZoneOffset();
  const publicationSpecification = v.parse(
    Publishing.VO.PublicationSpecification,
    body["publicationSpecification"],
  );
  const duration = tools.Duration.Ms(v.parse(tools.DurationMs, body["durationMs"]));
  const start = tools.Day.fromIsoId(v.parse(tools.DayIsoId, body["dateRangeStart"])).getStart();
  const end = tools.Day.fromIsoId(v.parse(tools.DayIsoId, body["dateRangeEnd"])).getEnd();

  const dateRange = new tools.DateRange(start.add(timeZoneOffset), end.add(timeZoneOffset));

  const shareableLinkId = v.parse(Publishing.VO.ShareableLinkId, deps.IdProvider.generate());

  const command = bg.command(
    Publishing.Commands.CreateShareableLinkCommand,
    {
      payload: { shareableLinkId, requesterId, durationMs: duration.ms, publicationSpecification, dateRange },
    },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
