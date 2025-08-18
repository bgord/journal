import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Events from "+app/events";
import type * as Buses from "+app/ports";
import * as Commands from "+publishing/commands";
import type * as Ports from "+publishing/ports";

type AcceptedEvent = Events.HourHasPassedEventType;

type AcceptedCommand = Commands.ExpireShareableLinkCommandType;

export class ShareableLinksExpirer {
  constructor(
    EventBus: Buses.EventBusLike<AcceptedEvent>,
    EventHandler: bg.EventHandler,
    private readonly CommandBus: Buses.CommandBusLike<AcceptedCommand>,
    private readonly expiringShareableLinks: Ports.ExpiringShareableLinksPort,
  ) {
    EventBus.on(Events.HOUR_HAS_PASSED_EVENT, EventHandler.handle(this.onHourHasPassed.bind(this)));
  }

  async onHourHasPassed(event: Events.HourHasPassedEventType) {
    try {
      const shareableLinks = await this.expiringShareableLinks.listDue(event.payload.timestamp);

      for (const shareableLink of shareableLinks) {
        const command = Commands.ExpireShareableLinkCommand.parse({
          id: crypto.randomUUID(),
          correlationId: bg.CorrelationStorage.get(),
          name: Commands.EXPIRE_SHAREABLE_LINK_COMMAND,
          createdAt: tools.Time.Now().value,
          revision: new tools.Revision(shareableLink.revision),
          payload: { shareableLinkId: shareableLink.id },
        } satisfies Commands.ExpireShareableLinkCommandType);

        await this.CommandBus.emit(command.name, command);
      }
    } catch {}
  }
}
