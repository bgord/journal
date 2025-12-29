import type { EnvironmentType } from "+infra/env";
import { createShieldCaptcha } from "./captcha.adapter";
import { createCertificateInspector } from "./certificate-inspector.adapter";
import { createClock } from "./clock.adapter";
import { createCommandBus } from "./command-bus";
import { CsvStringifier } from "./csv-stringifier.adapter";
import { createDiskSpaceChecker } from "./disk-space-checker.adapter";
import { createEventBus } from "./event-bus";
import { createEventHandler } from "./event-handler";
import { createEventStore } from "./event-store";
import { createFileCleaner } from "./file-cleaner.adapter";
import { createFileRenamer } from "./file-renamer.adapter";
import { HashFile } from "./hash-file.adapter";
import { IdProvider } from "./id-provider.adapter";
import { ImageInfo } from "./image-info.adapter";
import { createImageProcessor } from "./image-processor.adapter";
import { createJobHandler } from "./job-handler.adapter";
import { JsonFileReader } from "./json-file-reader.adapter";
import { createLogger } from "./logger.adapter";
import { createMailer } from "./mailer.adapter";
import { createRemoteFileStorage } from "./remote-file-storage.adapter";
import { createTemporaryFile } from "./temporary-file.adapter";
import { createTimekeeper } from "./timekeeper.adapter";

export function createSystemAdapters(Env: EnvironmentType) {
  const Clock = createClock(Env);
  const Logger = createLogger(Env);
  const EventBus = createEventBus({ Logger });
  const EventStore = createEventStore({ EventBus });
  const FileCleaner = createFileCleaner(Env);
  const FileRenamer = createFileRenamer(Env);
  const Mailer = createMailer(Env, { Logger });
  const Timekeeper = createTimekeeper(Env, { Clock });

  return {
    CertificateInspector: createCertificateInspector(Env, { Clock }),
    Clock,
    CommandBus: createCommandBus({ Logger }),
    EventBus,
    EventStore,
    DiskSpaceChecker: createDiskSpaceChecker(Env),
    IdProvider,
    Mailer,
    JsonFileReader,
    JobHandler: createJobHandler(Env, { Clock, IdProvider, Logger }),
    Logger,
    Timekeeper,
    FileCleaner,
    FileRenamer,
    TemporaryFile: createTemporaryFile(Env, { FileCleaner, FileRenamer }),
    EventHandler: createEventHandler({ Logger, Clock }),
    CsvStringifier,
    ImageInfo,
    HashFile,
    ShieldCaptcha: createShieldCaptcha(Env),
    ImageProcessor: createImageProcessor(Env, { FileCleaner, FileRenamer, JsonFileReader }),
    RemoteFileStorage: createRemoteFileStorage(Env, {
      HashFile,
      FileCleaner,
      FileRenamer,
      JsonFileReader,
      Logger,
      Clock,
    }),
  };
}
