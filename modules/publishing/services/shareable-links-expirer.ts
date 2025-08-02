import { CommandBus } from "+infra/command-bus";
import * as Commands from "+publishing/commands";
import * as Repos from "+publishing/repositories";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export class ShareableLinksExpirer {
  static cron = bg.Jobs.SCHEDULES.EVERY_HOUR;

  static label = "ShareableLinksExpirer";

  static async process() {
    try {
      const shareableLinks = await Repos.ShareableLinkRepository.listExpired();

      for (const shareableLink of shareableLinks) {
        const command = Commands.ExpireShareableLinkCommand.parse({
          id: crypto.randomUUID(),
          correlationId: bg.CorrelationStorage.get(),
          name: Commands.EXPIRE_SHAREABLE_LINK_COMMAND,
          createdAt: tools.Timestamp.parse(Date.now()),
          revision: new tools.Revision(shareableLink.revision),
          payload: { shareableLinkId: shareableLink.id },
        } satisfies Commands.ExpireShareableLinkCommandType);

        await CommandBus.emit(command.name, command);
      }
    } catch (error) {}
  }
}
