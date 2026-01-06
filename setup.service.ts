import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { languageDetector } from "hono/language";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { timing } from "hono/timing";

type SetupOverridesType = {
  cors?: Parameters<typeof cors>[0];
  httpLogger?: bg.HttpLoggerOptions;
  maintenanceMode?: bg.MaintenanceModeConfigType;
  BODY_LIMIT_MAX_SIZE?: tools.Size;
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
    const BODY_LIMIT_MAX_SIZE = overrides?.BODY_LIMIT_MAX_SIZE ?? tools.Size.fromKb(128);

    return [
      bg.MaintenanceMode.build(overrides?.maintenanceMode),
      secureHeaders({
        crossOriginResourcePolicy: "same-origin",
        contentSecurityPolicy: {
          defaultSrc: ["'none'"],

          baseUri: ["'none'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],

          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'"],
          fontSrc: ["'self'"],
          mediaSrc: ["'self'"],
          connectSrc: ["'self'"],
          workerSrc: ["'self'"],

          formAction: ["'self'"],
        },
      }),
      bodyLimit({ maxSize: BODY_LIMIT_MAX_SIZE.toBytes() }),
      bg.ApiVersion.build({ Clock: deps.Clock, FileReaderJson: deps.FileReaderJson }),
      cors({
        // Stryker disable all
        origin: [],
        // Stryker restore all
        // allowHeaders: ["authorization", "content-type", "x-correlation-id", "x-api-version"],
        credentials: false,
        maxAge: tools.Duration.Minutes(10).seconds,
        ...overrides?.cors,
      }),
      languageDetector({
        supportedLanguages: Object.keys(deps.I18n.supportedLanguages),
        fallbackLanguage: deps.I18n.defaultLanguage,
        // Stryker disable all
        caches: false,
        // Stryker restore all
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
