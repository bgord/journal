import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as System from "+system";
import * as Commands from "+publishing/commands";
import type * as Ports from "+publishing/ports";

type AcceptedEvent = System.Events.HourHasPassedEventType;

type AcceptedCommand = Commands.ExpireShareableLinkCommandType;

export class ShareableLinksExpirer {
  constructor(
    EventBus: bg.EventBusLike<AcceptedEvent>,
    EventHandler: bg.EventHandler,
    private readonly CommandBus: bg.CommandBusLike<AcceptedCommand>,
    private readonly expiringShareableLinks: Ports.ExpiringShareableLinksPort,
  ) {
    EventBus.on(
      System.Events.HOUR_HAS_PASSED_EVENT,
      EventHandler.handle(this.onHourHasPassedEvent.bind(this)),
    );
  }

  async onHourHasPassedEvent(event: System.Events.HourHasPassedEventType) {
    try {
      const shareableLinks = await this.expiringShareableLinks.listDue(event.payload.timestamp);

      for (const shareableLink of shareableLinks) {
        const command = Commands.ExpireShareableLinkCommand.parse({
          ...bg.createCommandEnvelope(),
          name: Commands.EXPIRE_SHAREABLE_LINK_COMMAND,
          revision: new tools.Revision(shareableLink.revision),
          payload: { shareableLinkId: shareableLink.id },
        } satisfies Commands.ExpireShareableLinkCommandType);

        await this.CommandBus.emit(command.name, command);
      }
    } catch {}
  }
}
