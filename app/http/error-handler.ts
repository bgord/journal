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
  bg.UUIDError,
  bg.History.VO.HistorySubjectError,
  tools.DurationMsError,
  tools.DayIsoIdError,
  tools.LanguageError,
  Emotions.VO.SituationDescription.Errors,
  Emotions.VO.SituationKind.Errors,
  Emotions.VO.EmotionLabel.Errors,
  Emotions.VO.EmotionIntensity.Errors,
  Emotions.VO.ReactionDescription.Errors,
  Emotions.VO.ReactionType.Errors,
  Emotions.VO.ReactionEffectiveness.Errors,
  Publishing.VO.PublicationSpecificationErrors,
]);

const invariants = new bg.ErrorClassifierInvariantStrategy([
  Emotions.Invariants,
  Publishing.Invariants,
  bg.Preferences.Invariants,
  Preferences.Invariants,
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
