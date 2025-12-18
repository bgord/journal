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
import { HashContent } from "./hash-content.adapter";
import { createHashFile } from "./hash-file.adapter";
import { IdProvider } from "./id-provider.adapter";
import { ImageInfo } from "./image-info.adapter";
import { createImageProcessor } from "./image-processor.adapter";
import { JsonFileReader } from "./json-file-reader.adapter";
import { createLogger } from "./logger.adapter";
import { createMailer } from "./mailer.adapter";
import { createRemoteFileStorage } from "./remote-file-storage.adapter";
import { createShieldAuth } from "./shield-auth.adapter";
import { createShieldBasicAuth } from "./shield-basic-auth.adapter";
import { createShieldRateLimit } from "./shield-rate-limit.adapter";
import { ShieldTimeout } from "./shield-timeout.adapter";
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
  const HashFile = createHashFile({ HashContent });

  return {
    Auth: createShieldAuth(Env, { Logger, Clock, IdProvider, EventStore, Mailer }),
    ShieldBasicAuth: createShieldBasicAuth(Env),
    CertificateInspector: createCertificateInspector(Env, { Clock }),
    Clock,
    CommandBus: createCommandBus({ Logger }),
    EventBus,
    EventStore,
    DiskSpaceChecker: createDiskSpaceChecker(Env),
    IdProvider,
    Mailer,
    JsonFileReader,
    Logger,
    Timekeeper,
    ShieldTimeout,
    ShieldRateLimit: createShieldRateLimit(Env, { Clock, HashContent }),
    FileCleaner,
    FileRenamer,
    TemporaryFile: createTemporaryFile(Env, { FileCleaner, FileRenamer }),
    EventHandler: createEventHandler({ Logger }),
    CsvStringifier,
    ImageInfo,
    HashFile,
    HashContent,
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
