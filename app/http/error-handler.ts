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

const http = new bg.ErrorClassifierHttpExceptionHonoStrategy([bg.HttpExceptionErrors]);

const validation = new bg.ErrorClassifierValidationStrategy([
  Emotions.VO.EmotionIntensity.Errors,
  Emotions.VO.EmotionLabel.Errors,
  Emotions.VO.ReactionDescription.Errors,
  Emotions.VO.ReactionEffectiveness.Errors,
  Emotions.VO.ReactionType.Errors,
  Emotions.VO.SituationDescription.Errors,
  Emotions.VO.SituationKind.Errors,
  Publishing.VO.PublicationSpecificationErrors,
  bg.History.VO.HistorySubjectError,
  bg.UUIDError,
  tools.DayIsoIdError,
  tools.DurationMsError,
  tools.LanguageError,
]);

const invariants = new bg.ErrorClassifierInvariantStrategy([
  Emotions.Invariants,
  Preferences.Invariants,
  Publishing.Invariants,
  bg.Preferences.Invariants,
]);

export class ErrorHandler {
  static handle: (deps: Dependencies) => hono.ErrorHandler = (deps) =>
    new bg.ErrorHonoHandler(
      [
        messages,
        http,
        new bg.ErrorClassifierWithLoggerStrategy({ operation: "validation" }, { inner: validation, ...deps }),
        new bg.ErrorClassifierWithLoggerStrategy(
          { operation: "domain_error" },
          { inner: invariants, ...deps },
        ),
      ],
      deps,
    ).handle();
}
