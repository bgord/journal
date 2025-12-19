import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as System from "+system";
import * as Commands from "+publishing/commands";
import type * as Ports from "+publishing/ports";

type AcceptedEvent = System.Events.HourHasPassedEventType;

type AcceptedCommand = Commands.ExpireShareableLinkCommandType;

type Dependencies = {
  EventBus: bg.EventBusLike<AcceptedEvent>;
  EventHandler: bg.EventHandlerPort;
  CommandBus: bg.CommandBusLike<AcceptedCommand>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  ExpiringShareableLinks: Ports.ExpiringShareableLinksPort;
};

export class ShareableLinksExpirer {
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      System.Events.HOUR_HAS_PASSED_EVENT,
      deps.EventHandler.handle(this.onHourHasPassedEvent.bind(this)),
    );
  }

  async onHourHasPassedEvent(event: System.Events.HourHasPassedEventType) {
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
