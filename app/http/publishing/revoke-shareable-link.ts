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
  CommandBus: bg.CommandBusPort<Publishing.Commands.RevokeShareableLinkCommandType>;
};

export const RevokeShareableLink = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const requesterId = c.get("user").id;
  const shareableLinkId = v.parse(Publishing.VO.ShareableLinkId, c.req.param("shareableLinkId"));
  const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));

  const command = wip.command(
    Publishing.Commands.RevokeShareableLinkCommand,
    { revision, payload: { shareableLinkId, requesterId } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
