import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Publishing from "+publishing";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Publishing.Commands.RevokeShareableLinkCommandType>;
};

export const RevokeShareableLink = (deps: Dependencies):bg.EndpointPort => async (context) => {
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
