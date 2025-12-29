import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";

type Dependencies = {
  CsvStringifier: bg.CsvStringifierPort;
  Clock: bg.ClockPort;
  EntrySnapshot: Emotions.Ports.EntrySnapshotPort;
  AlarmDirectory: Emotions.Ports.AlarmDirectoryPort;
};

export const ExportData = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;

  const entries = await deps.EntrySnapshot.getAllForuser(userId);
  const alarms = await deps.AlarmDirectory.listForUser(userId);

  const timestamp = deps.Clock.now().ms;

  return new bg.FileDraftZip(tools.Basename.parse(`export-${timestamp}`), [
    new Emotions.Services.EntryExportFileCsv(entries, deps),
    new Emotions.Services.AlarmExportFileCsv(alarms, deps),
  ]).toResponse();
};
