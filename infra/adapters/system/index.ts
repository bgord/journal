import type { EnvironmentType } from "+infra/env";
import { createShieldCaptcha } from "./captcha.adapter";
import { createCertificateInspector } from "./certificate-inspector.adapter";
import { createClock } from "./clock.adapter";
import { createCommandBus } from "./command-bus";
import { createCsvStringifier } from "./csv-stringifier.adapter";
import { createDiskSpaceChecker } from "./disk-space-checker.adapter";
import { createEventBus } from "./event-bus";
import { createEventHandler } from "./event-handler";
import { createEventStore } from "./event-store";
import { createFileCleaner } from "./file-cleaner.adapter";
import { createFileHash } from "./file-hash.adapter";
import { createFileRenamer } from "./file-renamer.adapter";
import { createIdProvider } from "./id-provider.adapter";
import { createImageInfo } from "./image-info.adapter";
import { createImageProcessor } from "./image-processor.adapter";
import { createJsonFileReader } from "./json-file-reader.adapter";
import { createLogger } from "./logger.adapter";
import { createMailer } from "./mailer.adapter";
import { createRemoteFileStorage } from "./remote-file-storage.adapter";
import { createShieldAuth } from "./shield-auth.adapter";
import { createShieldBasicAuth } from "./shield-basic-auth.adapter";
import { createShieldRateLimit } from "./shield-rate-limit.adapter";
import { createShieldTimeout } from "./shield-timeout.adapter";
import { createTemporaryFile } from "./temporary-file.adapter";
import { createTimekeeper } from "./timekeeper.adapter";

export function createSystemAdapters(Env: EnvironmentType) {
  const Clock = createClock(Env);
  const Logger = createLogger(Env);
  const EventBus = createEventBus({ Logger });
  const EventStore = createEventStore({ EventBus });
  const FileCleaner = createFileCleaner(Env);
  const FileHash = createFileHash();
  const FileRenamer = createFileRenamer(Env);
  const IdProvider = createIdProvider();
  const JsonFileReader = createJsonFileReader();
  const Mailer = createMailer(Env, { Logger });
  const Timekeeper = createTimekeeper(Env, { Clock });

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
    ShieldTimeout: createShieldTimeout(),
    ShieldRateLimit: createShieldRateLimit(Env, { Clock }),
    FileCleaner,
    FileRenamer,
    TemporaryFile: createTemporaryFile(Env, { FileCleaner, FileRenamer }),
    EventHandler: createEventHandler({ Logger }),
    CsvStringifier: createCsvStringifier(),
    ImageInfo: createImageInfo(),
    FileHash,
    ShieldCaptcha: createShieldCaptcha(Env),
    ImageProcessor: createImageProcessor(Env, { FileCleaner, FileRenamer, JsonFileReader }),
    RemoteFileStorage: createRemoteFileStorage(Env, {
      FileHash,
      FileCleaner,
      FileRenamer,
      JsonFileReader,
      Logger,
      Clock,
    }),
  };
}
