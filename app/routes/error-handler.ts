import * as bg from "@bgord/bun";
import hono from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod/v4";
import * as infra from "../../infra";
import * as Emotions from "../../modules/emotions";

// TODO: try extracting the logic for errors
const validationErrors = [
  Emotions.VO.SituationDescription.Errors.invalid,
  Emotions.VO.SituationLocation.Errors.invalid,
  Emotions.VO.SituationKind.Errors.invalid,
  Emotions.VO.EmotionLabel.Errors.invalid,
  Emotions.VO.EmotionIntensity.Errors.min_max,
  Emotions.VO.ReactionDescription.Errors.invalid,
  Emotions.VO.ReactionType.Errors.invalid,
  Emotions.VO.ReactionEffectiveness.Errors.min_max,
];

const policies = [
  Emotions.Policies.EmotionCorrespondsToSituation,
  Emotions.Policies.OneEmotionPerEntry,
  Emotions.Policies.OneReactionPerEntry,
  Emotions.Policies.ReactionCorrespondsToSituationAndEmotion,
  Emotions.Policies.EmotionForReappraisalExists,
  Emotions.Policies.ReactionForEvaluationExists,
  Emotions.Policies.EntryHasBenStarted,
];

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

      if (error.message === bg.TooManyRequestsError.message) {
        return c.json(
          { message: bg.TooManyRequestsError.message, _known: true },
          bg.TooManyRequestsError.status,
        );
      }

      return error.getResponse();
    }

    if (error instanceof z.ZodError) {
      const validationError = error.issues.find((issue) => validationErrors.includes(issue.message));

      if (validationError) {
        infra.logger.error({
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

      infra.logger.error({
        message: "Invalid payload",
        operation: "invalid_payload",
        correlationId,
        metadata: { url, body: await bg.safeParseBody(c) },
      });

      return c.json({ message: "payload.invalid.error", _known: true }, 400);
    }

    const policyError = policies.find((policy) => error instanceof policy.error);

    if (policyError) {
      infra.logger.error({
        message: "Domain error",
        operation: policyError.message,
        correlationId,
      });

      return c.json({ message: policyError.message, _known: true }, policyError.code);
    }

    infra.logger.error({
      message: "Unknown error",
      operation: "unknown_error",
      correlationId,
      metadata: infra.logger.formatError(error),
    });

    return c.json({ message: "general.unknown" }, 500);
  };
}
