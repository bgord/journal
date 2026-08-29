// cspell:ignore Stringifier
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Emotions from "+emotions";

type Dependencies = {
  CsvStringifier: bg.CsvStringifierPort;
  Clock: bg.ClockPort;
  EntrySnapshot: Emotions.Ports.EntrySnapshotPort;
  AlarmDirectory: Emotions.Ports.AlarmDirectoryPort;
};

export const ExportData =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.userId() as bg.UUIDType;

    const entries = await deps.EntrySnapshot.getAllForUser(userId);
    const alarms = await deps.AlarmDirectory.listForUser(userId);

    const timestamp = deps.Clock.now().ms;

    const zip = new bg.FileDraftTarGz(v.parse(tools.Basename, `export-${timestamp}`), [
      new Emotions.Services.EntryExportFileCsv(entries, deps),
      new Emotions.Services.AlarmExportFileCsv(alarms, deps),
    ]);

    return zip.toResponse();
  };
