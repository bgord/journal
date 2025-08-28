import * as bg from "@bgord/bun";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import * as Adapters from "+infra/adapters";

export async function ExportData(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");

  const entries = await Adapters.Emotions.EntrySnapshot.getAllForuser(user.id);
  const alarms = await Adapters.Emotions.AlarmDirectory.listForUser(user.id);

  return new bg.FileDraftZip({
    filename: `export-${Date.now()}.zip`,
    parts: [
      new Emotions.Services.EntryExportFileCsv(Adapters.CsvStringifier, entries),
      new Emotions.Services.AlarmExportFileCsv(Adapters.CsvStringifier, alarms),
    ],
  }).toResponse();
}
