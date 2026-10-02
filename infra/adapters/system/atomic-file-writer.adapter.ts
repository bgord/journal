import * as bg from "@bgord/bun";

type Dependencies = {
  FileCleaner: bg.FileCleanerPort;
  FileRenamer: bg.FileRenamerPort;
  FileWriter: bg.FileWriterPort;
  NonceProvider: bg.NonceProviderPort;
};

export function createAtomicFileWriter(deps: Dependencies): bg.AtomicFileWriterPort {
  return new bg.AtomicFileWriterAdapter(deps);
}
