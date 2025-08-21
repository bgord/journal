import * as bg from "@bgord/bun";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import { AlarmDirectory, EntrySnapshot } from "+infra/adapters/emotions";

export async function ExportData(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");

  const entries = await EntrySnapshot.getAllForuser(user.id);
  const alarms = await AlarmDirectory.listForUser(user.id);

  return new bg.ZipDraft({
    filename: `export-${Date.now()}.zip`,
    parts: [new Emotions.Services.EntryExportFileCsv(entries), new Emotions.Services.AlarmExportFile(alarms)],
  }).toResponse();
}
