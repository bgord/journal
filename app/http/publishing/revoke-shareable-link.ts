import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import type * as infra from "+infra";
import * as Publishing from "+publishing";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusLike<Publishing.Commands.RevokeShareableLinkCommandType>;
};

export const RevokeShareableLink = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const requesterId = c.get("user").id;
  const shareableLinkId = Publishing.VO.ShareableLinkId.parse(c.req.param("shareableLinkId"));
  const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));

  const command = Publishing.Commands.RevokeShareableLinkCommand.parse({
    ...bg.createCommandEnvelope(deps),
    name: Publishing.Commands.REVOKE_SHAREABLE_LINK_COMMAND,
    revision,
    payload: { shareableLinkId, requesterId },
  } satisfies Publishing.Commands.RevokeShareableLinkCommandType);

  await deps.CommandBus.emit(command.name, command);

  return new Response();
};
