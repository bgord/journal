import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import type * as infra from "+infra";
import * as Publishing from "+publishing";
import { CommandBus } from "+infra/command-bus";

export async function RevokeShareableLink(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");
  const shareableLinkId = Publishing.VO.ShareableLinkId.parse(c.req.param("shareableLinkId"));
  const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));

  const command = Publishing.Commands.RevokeShareableLinkCommand.parse({
    id: crypto.randomUUID(),
    correlationId: bg.CorrelationStorage.get(),
    name: Publishing.Commands.REVOKE_SHAREABLE_LINK_COMMAND,
    createdAt: tools.Time.Now().value,
    revision,
    payload: { shareableLinkId, requesterId: user.id },
  } satisfies Publishing.Commands.RevokeShareableLinkCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
