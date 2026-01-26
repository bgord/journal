import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod/v4";
import * as Emotions from "+emotions";
import * as Preferences from "+preferences";
import * as Publishing from "+publishing";

type Dependencies = { Logger: bg.LoggerPort };

const validationErrors = [
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

export class ErrorHandler {
  static handle: (deps: Dependencies) => hono.ErrorHandler = (deps) => async (error, c) => {
    const url = c.req.url;
    const correlationId = c.get("requestId");

    if (error instanceof HTTPException) {
      if (error.message === "request_timeout_error") {
        return c.json({ message: "request_timeout_error", _known: true }, 408);
      }

      if (error.message === bg.ShieldApiKeyError.message) {
        return c.json({ message: bg.ShieldApiKeyError.message, _known: true }, bg.ShieldApiKeyError.status);
      }

      if (error.message === bg.ShieldAuthError.message) {
        return c.json({ message: bg.ShieldAuthError.message, _known: true }, 403);
      }

      if (error.message === bg.ShieldRateLimitError.message) {
        return c.json(
          { message: bg.ShieldRateLimitError.message, _known: true },
          bg.ShieldRateLimitError.status,
        );
      }

      return error.getResponse();
    }

    if (error.message === tools.MimeValueError.Invalid) {
      return c.json({ message: "invalid.mime", _known: true }, 400);
    }

    if (error.message === tools.RevisionError.Mismatch) {
      return c.json({ message: "revision.mismatch", _known: true }, 412);
    }

    if (error.message === bg.Preferences.VO.SupportedLanguagesSetError.Missing) {
      return c.json({ message: "unsupported.language", _known: true }, 400);
    }

    if (error.message === tools.DateRangeError.Invalid) {
      return c.json({ message: "invalid.date.range", _known: true }, 400);
    }

    if (error instanceof z.ZodError) {
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

      return c.json(...bg.InvariantErrorHandler.respond(invariantError));
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
