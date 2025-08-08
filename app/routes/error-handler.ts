import * as Emotions from "+emotions";
import { logger } from "+infra/logger";
import * as Publishing from "+publishing";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import hono from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod/v4";

const validationErrors = [
  Emotions.VO.SituationDescription.Errors.invalid,
  Emotions.VO.SituationLocation.Errors.invalid,
  Emotions.VO.SituationKind.Errors.invalid,
  Emotions.VO.EmotionLabel.Errors.invalid,
  Emotions.VO.EmotionIntensity.Errors.min_max,
  Emotions.VO.ReactionDescription.Errors.invalid,
  Emotions.VO.ReactionType.Errors.invalid,
  Emotions.VO.ReactionEffectiveness.Errors.min_max,
  Publishing.VO.PublicationSpecificationErrors.invalid,
];

const invariants = Object.values({ ...Emotions.Invariants, ...Publishing.Invariants });

export class ErrorHandler {
  static handle: hono.ErrorHandler = async (error, c) => {
    const url = c.req.url;
    const correlationId = c.get("requestId") as bg.CorrelationIdType;

    if (error instanceof HTTPException) {
      if (error.message === "request_timeout_error") {
        return c.json({ message: "request_timeout_error", _known: true }, 408);
      }

      if (error.message === bg.AccessDeniedApiKeyError.message) {
        return c.json(
          { message: bg.AccessDeniedApiKeyError.message, _known: true },
          bg.AccessDeniedApiKeyError.status,
        );
      }

      if (error.message === bg.AccessDeniedAuthShieldError.message) {
        return c.json({ message: bg.AccessDeniedAuthShieldError.message, _known: true }, 403);
      }

      if (error.message === bg.TooManyRequestsError.message) {
        return c.json(
          { message: bg.TooManyRequestsError.message, _known: true },
          bg.TooManyRequestsError.status,
        );
      }

      return error.getResponse();
    }

    if (error instanceof tools.RevisionMismatchError) {
      return c.json({ message: "revision.mismatch", _known: true }, 412);
    }

    if (error instanceof z.ZodError) {
      const validationError = error.issues.find((issue) => validationErrors.includes(issue.message));

      if (validationError) {
        logger.error({
          message: "Expected validation error",
          operation: "validation",
          correlationId,
          metadata: {
            url,
            body: await bg.safeParseBody(c),
            error: validationError,
          },
        });

        return c.json({ message: validationError.message, _known: true }, 400);
      }

      logger.error({
        message: "Invalid payload",
        operation: "invalid_payload",
        correlationId,
        metadata: { url, body: await bg.safeParseBody(c) },
      });

      return c.json({ message: "payload.invalid.error", _known: true }, 400);
    }

    const invariantErrorHandler = new bg.PolicyErrorHandler(invariants).detect(error);

    if (invariantErrorHandler.error) {
      logger.error({
        message: "Domain error",
        operation: invariantErrorHandler.error.message,
        correlationId,
      });

      return c.json(...bg.PolicyErrorHandler.respond(invariantErrorHandler.error));
    }

    logger.error({
      message: "Unknown error",
      operation: "unknown_error",
      correlationId,
      metadata: logger.formatError(error),
    });

    return c.json({ message: "general.unknown" }, 500);
  };
}
