import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import * as v from "valibot";
import * as Emotions from "+emotions";
import * as Preferences from "+preferences";
import * as Publishing from "+publishing";

type Dependencies = { Logger: bg.LoggerPort };

const validationErrors = [
  bg.UUIDError.Type,
  bg.History.VO.HistorySubjectError.TooLong,
  tools.DurationMsError.Invalid,
  tools.DayIsoIdError.InvalidDate,
  tools.DayIsoIdError.Type,
  tools.LanguageError.Type,
  Emotions.VO.SituationDescription.Errors.Invalid,
  Emotions.VO.SituationKind.Errors.Invalid,
  Emotions.VO.EmotionLabel.Errors.Invalid,
  Emotions.VO.EmotionIntensity.Errors.min_max,
  Emotions.VO.ReactionDescription.Errors.invalid,
  Emotions.VO.ReactionType.Errors.Invalid,
  Emotions.VO.ReactionEffectiveness.Errors.min_max,
  Publishing.VO.PublicationSpecificationErrors.Invalid,
];

const invariants = Object.values({
  ...Emotions.Invariants,
  ...Publishing.Invariants,
  ...bg.Preferences.Invariants,
  ...Preferences.Invariants,
});

// Stryker disable all
export class ErrorHandler {
  static handle: (deps: Dependencies) => hono.ErrorHandler = (deps) => async (error, c) => {
    const url = c.req.url;
    const correlationId = c.get("correlationId");

    if (error instanceof HTTPException) {
      if (error.message === bg.ShieldTimeoutStrategyError.Rejected) {
        return c.json({ message: bg.ShieldTimeoutStrategyError.Rejected, _known: true }, 408);
      }

      if (error.message === bg.ShieldAuthStrategyError.Rejected)
        return c.json({ message: bg.ShieldAuthStrategyError.Rejected, _known: true }, 403);

      if (error.message === bg.ShieldRateLimitStrategyError.Rejected) {
        return c.json({ message: bg.ShieldRateLimitStrategyError.Rejected, _known: true }, 429);
      }

      return error.getResponse();
    }

    if (error.message === bg.Preferences.CommandHandlers.HandleSetUserLanguageCommandError.Missing) {
      return c.json({ message: "unsupported.language", _known: true }, 400);
    }

    if (error.message === tools.DateRangeError.Invalid) {
      return c.json({ message: "invalid.date.range", _known: true }, 400);
    }

    if (error instanceof v.ValiError) {
      const validationError = error.issues.find((issue) => validationErrors.includes(issue.message));

      if (validationError) {
        deps.Logger.error({
          message: "Expected validation error",
          component: "http",
          operation: "validation",
          correlationId,
          metadata: { url, error: validationError },
          error,
        });

        return c.json({ message: validationError.message, _known: true }, 400);
      }

      deps.Logger.error({
        message: "Invalid payload",
        component: "http",
        operation: "invalid_payload",
        correlationId,
        metadata: { url },
        error,
      });

      return c.json({ message: "payload.invalid.error", _known: true }, 400);
    }

    const invariantError = bg.InvariantErrorHandler.detect(invariants, error);

    if (invariantError) {
      deps.Logger.error({
        message: "Domain error",
        component: "http",
        operation: invariantError.message,
        correlationId,
        error,
      });

      const [message, code] = bg.InvariantErrorHandler.respond(invariantError);

      return c.json(message, code as ContentfulStatusCode);
    }

    deps.Logger.error({
      message: "Unknown error",
      component: "http",
      operation: "unknown_error",
      correlationId,
      error,
    });

    return c.json({ message: "general.unknown" }, 500);
  };
}
// Stryker restore all
