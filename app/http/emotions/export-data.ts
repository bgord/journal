import * as bg from "@bgord/bun";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import * as Adapters from "+infra/adapters";

const deps = { Stringifier: Adapters.CsvStringifier, Clock: Adapters.Clock };

export async function ExportData(c: hono.Context<infra.HonoConfig>) {
  const userId = c.get("user").id;

  const entries = await Adapters.Emotions.EntrySnapshot.getAllForuser(userId);
  const alarms = await Adapters.Emotions.AlarmDirectory.listForUser(userId);

  const timestamp = Adapters.Clock.nowMs();

  return new bg.FileDraftZip({
    filename: `export-${timestamp}.zip`,
    parts: [
      new Emotions.Services.EntryExportFileCsv(entries, deps),
      new Emotions.Services.AlarmExportFileCsv(alarms, deps),
    ],
  }).toResponse();
}
