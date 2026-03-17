import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as wip from "+infra/build";
import * as Commands from "+publishing/commands";
import type * as Ports from "+publishing/ports";

type AcceptedEvent = bg.System.Events.HourHasPassedEventType;

type AcceptedCommand = Commands.ExpireShareableLinkCommandType;

type Dependencies = {
  EventBus: bg.EventBusPort<AcceptedEvent>;
  EventHandler: bg.EventHandlerStrategy;
  CommandBus: bg.CommandBusPort<AcceptedCommand>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  ExpiringShareableLinks: Ports.ExpiringShareableLinksPort;
};

export class ShareableLinksExpirer {
  // Stryker disable all
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      bg.System.Events.HOUR_HAS_PASSED_EVENT,
      deps.EventHandler.handle(this.onHourHasPassedEvent.bind(this)),
    );
  }
  // Stryker restore all

  async onHourHasPassedEvent(event: bg.System.Events.HourHasPassedEventType) {
    try {
      const shareableLinks = await this.deps.ExpiringShareableLinks.listDue(event.payload.timestamp);

      for (const shareableLink of shareableLinks) {
        const command = wip.command(
          Commands.ExpireShareableLinkCommand,
          {
            revision: new tools.Revision(shareableLink.revision),
            payload: { shareableLinkId: shareableLink.id },
          },
          this.deps,
        );

        await this.deps.CommandBus.emit(command);
      }
    } catch {}
  }
}
