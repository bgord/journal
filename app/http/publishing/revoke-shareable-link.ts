import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import type * as infra from "+infra";
import * as Publishing from "+publishing";
import * as Adapters from "+infra/adapters";
import { CommandBus } from "+infra/command-bus";

const deps = { IdProvider: Adapters.IdProvider, Clock: Adapters.Clock };

export async function RevokeShareableLink(c: hono.Context<infra.Config>) {
  const requesterId = c.get("user").id;
  const shareableLinkId = Publishing.VO.ShareableLinkId.parse(c.req.param("shareableLinkId"));
  const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));

  const command = Publishing.Commands.RevokeShareableLinkCommand.parse({
    ...bg.createCommandEnvelope(deps),
    name: Publishing.Commands.REVOKE_SHAREABLE_LINK_COMMAND,
    revision,
    payload: { shareableLinkId, requesterId },
  } satisfies Publishing.Commands.RevokeShareableLinkCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
