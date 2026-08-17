import * as bg from "@bgord/bun";
import type hono from "hono";
import * as v from "valibot";
import type * as infra from "+infra";
import * as Publishing from "+publishing";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Publishing.Commands.RevokeShareableLinkCommandType>;
};

export const RevokeShareableLink = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const context = new bg.RequestContextHonoAdapter(c);
  const params = context.request.params();

  const requesterId = context.identity.authenticatedUserId();
  const shareableLinkId = v.parse(Publishing.VO.ShareableLinkId, params["shareableLinkId"]);

  const command = bg.command(
    Publishing.Commands.RevokeShareableLinkCommand,
    { revision: context.middleware.revision.fromWeakETag(), payload: { shareableLinkId, requesterId } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
