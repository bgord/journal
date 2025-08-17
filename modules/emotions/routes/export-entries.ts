import * as bg from "@bgord/bun";
import hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";

export const ExportEntries = (EntrySnapshot: Emotions.Ports.EntrySnapshotPort) =>
  async function (c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
    const user = c.get("user");

    const entries = await EntrySnapshot.getAllForuser(user.id);
    const alarms = await Emotions.Repos.AlarmRepository.listForUser(user.id);

    return new bg.ZipDraft({
      filename: `export-${Date.now()}.zip`,
      parts: [new Emotions.Services.EntryExportFile(entries), new Emotions.Services.AlarmExportFile(alarms)],
    }).toResponse();
  };
