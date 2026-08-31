import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Emotions from "+emotions";
import * as Preferences from "+preferences";
import * as Publishing from "+publishing";

type Dependencies = { Logger: bg.LoggerPort };

const messages = new bg.ErrorClassifierMessageMapStrategy({
  [bg.Preferences.CommandHandlers.HandleSetUserLanguageCommandError.Missing]: {
    message: "unsupported.language",
    status: 400,
  },
  [tools.DateRangeError.Invalid]: { message: "invalid.date.range", status: 400 },
  [tools.RevisionError.Mismatch]: { message: "revision.mismatch", status: 412 },
});

const http = new bg.ErrorClassifierHttpExceptionHonoStrategy({
  known: [
    bg.ShieldAuthStrategyError.Rejected,
    bg.ShieldTimeoutStrategyError.Rejected,
    bg.ShieldRateLimitStrategyError.Rejected,
    bg.ShieldCsrfStrategyError.Rejected,
    bg.ShieldBasicAuthStrategyError.Rejected,
    bg.FileUploaderError.MissingFile,
    bg.FileUploaderError.EmptyFile,
    bg.FileUploaderError.InvalidMime,
    bg.FileUploaderError.SizeLimit,
  ],
});

const validation = new bg.ErrorClassifierValidationStrategy({
  validationErrors: [
    bg.UUIDError.Type,
    bg.History.VO.HistorySubjectError.TooLong,
    tools.DurationMsError.Invalid,
    tools.DayIsoIdError.Invalid,
    tools.DayIsoIdError.Type,
    tools.LanguageError.Type,
    Emotions.VO.SituationDescription.Errors.Invalid,
    Emotions.VO.SituationKind.Errors.Invalid,
    Emotions.VO.EmotionLabel.Errors.Invalid,
    Emotions.VO.EmotionIntensity.Errors.MinMax,
    Emotions.VO.ReactionDescription.Errors.Invalid,
    Emotions.VO.ReactionType.Errors.Invalid,
    Emotions.VO.ReactionEffectiveness.Errors.MinMax,
    Publishing.VO.PublicationSpecificationErrors.Invalid,
  ],
});

const invariants = new bg.ErrorClassifierInvariantStrategy({
  invariants: Object.values({
    ...Emotions.Invariants,
    ...Publishing.Invariants,
    ...bg.Preferences.Invariants,
    ...Preferences.Invariants,
  }),
});

const unknown = new bg.ErrorClassifierUnknownStrategy();

export class ErrorHandler {
  static handle: (deps: Dependencies) => hono.ErrorHandler = (deps) =>
    new bg.ErrorHonoHandler({
      classifiers: [
        messages,
        http,
        new bg.ErrorClassifierWithLoggerStrategy({ operation: "validation" }, { inner: validation, ...deps }),
        new bg.ErrorClassifierWithLoggerStrategy(
          { operation: "domain_error" },
          { inner: invariants, ...deps },
        ),
      ],
      fallback: new bg.ErrorClassifierWithLoggerStrategy(
        { operation: "unknown_error" },
        { inner: unknown, ...deps },
      ),
    }).handle();
}
