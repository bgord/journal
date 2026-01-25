import type { EnvironmentType } from "+infra/env";
import { createCertificateInspector } from "./certificate-inspector.adapter";
import { createClock } from "./clock.adapter";
import { CsvStringifier } from "./csv-stringifier.adapter";
import { createDiskSpaceChecker } from "./disk-space-checker.adapter";
import { createFileCleaner } from "./file-cleaner.adapter";
import { FileReaderJson } from "./file-reader-json.adapter";
import { createFileRenamer } from "./file-renamer.adapter";
import { HashFile } from "./hash-file.adapter";
import { IdProvider } from "./id-provider.adapter";
import { ImageInfo } from "./image-info.adapter";
import { createImageProcessor } from "./image-processor.adapter";
import { createLogger } from "./logger.adapter";
import { createMailer } from "./mailer.adapter";
import { NonceProvider } from "./nonce-provider.adapter";
import { createRemoteFileStorage } from "./remote-file-storage.adapter";
import { createSleeper } from "./sleeper.adapter";
import { createTemporaryFile } from "./temporary-file.adapter";
import { createTimekeeper } from "./timekeeper.adapter";
import { createTimeoutRunner } from "./timeout-runner.adapter";

export async function createSystemAdapters(Env: EnvironmentType) {
  const Clock = createClock(Env);
  const Logger = createLogger(Env, { Clock });
  const FileCleaner = createFileCleaner(Env);
  const FileRenamer = createFileRenamer(Env);
  const Mailer = await createMailer(Env, { Logger, Clock });
  const Timekeeper = createTimekeeper(Env, { Clock });

  return {
    CertificateInspector: createCertificateInspector(Env, { Clock }),
    Clock,
    DiskSpaceChecker: createDiskSpaceChecker(Env),
    IdProvider,
    NonceProvider,
    Mailer,
    FileReaderJson,
    Logger,
    Timekeeper,
    FileCleaner,
    FileRenamer,
    TemporaryFile: createTemporaryFile(Env, { FileCleaner, FileRenamer }),
    CsvStringifier,
    ImageInfo,
    HashFile,
    ImageProcessor: createImageProcessor(Env, { FileCleaner, FileRenamer, FileReaderJson }),
    Sleeper: createSleeper(Env),
    TimeoutRunner: createTimeoutRunner(Env),
    RemoteFileStorage: createRemoteFileStorage(Env, { HashFile, FileCleaner, FileRenamer, Logger, Clock }),
  };
}
