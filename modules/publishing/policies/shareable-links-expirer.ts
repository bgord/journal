import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Commands from "+publishing/commands";
import type * as Ports from "+publishing/ports";

type AcceptedEvent = bg.System.Events.HourHasPassedEventType;

type AcceptedCommand = Commands.ExpireShareableLinkCommandType;

type Dependencies = {
  EventBus: bg.EventBusLike<AcceptedEvent>;
  EventHandler: bg.EventHandlerStrategy;
  CommandBus: bg.CommandBusLike<AcceptedCommand>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  ExpiringShareableLinks: Ports.ExpiringShareableLinksPort;
};

export class ShareableLinksExpirer {
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      bg.System.Events.HOUR_HAS_PASSED_EVENT,
      deps.EventHandler.handle(this.onHourHasPassedEvent.bind(this)),
    );
  }

  async onHourHasPassedEvent(event: bg.System.Events.HourHasPassedEventType) {
    try {
      const shareableLinks = await this.deps.ExpiringShareableLinks.listDue(event.payload.timestamp);

      for (const shareableLink of shareableLinks) {
        const command = Commands.ExpireShareableLinkCommand.parse({
          ...bg.createCommandEnvelope(this.deps),
          name: Commands.EXPIRE_SHAREABLE_LINK_COMMAND,
          revision: new tools.Revision(shareableLink.revision),
          payload: { shareableLinkId: shareableLink.id },
        } satisfies Commands.ExpireShareableLinkCommandType);

        await this.deps.CommandBus.emit(command.name, command);
      }
    } catch {}
  }
}
