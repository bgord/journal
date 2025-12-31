import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { languageDetector } from "hono/language";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { timing } from "hono/timing";

export const BODY_LIMIT_MAX_SIZE = tools.Size.fromKb(128).toBytes();

type SetupOverridesType = {
  cors?: Parameters<typeof cors>[0];
  secureHeaders?: Parameters<typeof secureHeaders>[0];
  httpLogger?: bg.HttpLoggerOptions;
  maintenanceMode?: bg.MaintenanceModeConfigType;
};

type Dependencies = {
  Logger: bg.LoggerPort;
  IdProvider: bg.IdProviderPort;
  I18n: bg.I18nConfigType;
  Clock: bg.ClockPort;
  FileReaderJson: bg.FileReaderJsonPort;
};

export class Setup {
  static essentials(deps: Dependencies, overrides?: SetupOverridesType) {
    const corsOptions = overrides?.cors ?? { origin: "*" };

    const secureHeadersOptions = {
      contentTypeOptions: "nosniff", // Do not deduce MIME/content type
      referrerPolicy: "no-referrer", // Omit the Referer header
      crossOriginResourcePolicy: "same-origin",
      ...overrides?.secureHeaders,
    };

    return [
      bg.MaintenanceMode.build(overrides?.maintenanceMode),
      secureHeaders(secureHeadersOptions),
      bodyLimit({ maxSize: BODY_LIMIT_MAX_SIZE }),
      bg.ApiVersion.build({ Clock: deps.Clock, FileReaderJson: deps.FileReaderJson }),
      cors(corsOptions),
      languageDetector({
        supportedLanguages: Object.keys(deps.I18n.supportedLanguages),
        fallbackLanguage: deps.I18n.defaultLanguage,
        caches: false,
      }),
      requestId({
        limitLength: 36,
        headerName: "x-correlation-id",
        generator: () => deps.IdProvider.generate(),
      }),
      bg.TimeZoneOffset.attach,
      bg.Context.attach,
      bg.WeakETagExtractor.attach,
      bg.ETagExtractor.attach,
      bg.HttpLogger.build(deps, overrides?.httpLogger),
      timing(),
      bg.CorrelationStorage.handle(),
    ];
  }
}
