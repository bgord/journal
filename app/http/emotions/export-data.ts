import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import * as Adapters from "+infra/adapters";

const deps = {
  Stringifier: Adapters.CsvStringifier,
  Clock: Adapters.Clock,
  EntrySnapshot: Adapters.Emotions.EntrySnapshot,
  AlarmDirectory: Adapters.Emotions.AlarmDirectory,
};

export async function ExportData(c: hono.Context<infra.HonoConfig>) {
  const userId = c.get("user").id;

  const entries = await deps.EntrySnapshot.getAllForuser(userId);
  const alarms = await deps.AlarmDirectory.listForUser(userId);

  const timestamp = Adapters.Clock.nowMs();

  return new bg.FileDraftZip(tools.Basename.parse(`export-${timestamp}`), [
    new Emotions.Services.EntryExportFileCsv(entries, deps),
    new Emotions.Services.AlarmExportFileCsv(alarms, deps),
  ]).toResponse();
}
