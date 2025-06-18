import * as bg from "@bgord/bun";
import hono from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod/v4";
import * as infra from "../../infra";
import * as Emotions from "../../modules/emotions";

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
      const expectedValidationErrors = [
        Emotions.VO.SituationDescription.Errors.invalid,
        Emotions.VO.SituationLocation.Errors.invalid,
        Emotions.VO.SituationKind.Errors.invalid,
        Emotions.VO.EmotionLabel.Errors.invalid,
        Emotions.VO.EmotionIntensity.Errors.min_max,
        Emotions.VO.ReactionDescription.Errors.invalid,
        Emotions.VO.ReactionType.Errors.invalid,
        Emotions.VO.ReactionEffectiveness.Errors.min_max,
      ];

      const validationError = error.issues.find((issue) => expectedValidationErrors.includes(issue.message));

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

    // TODO unify policy errors
    if (error instanceof Emotions.Policies.EmotionCorrespondsToSituation.error) {
      infra.logger.error({
        message: "EmotionCorrespondsToSituation",
        operation: Emotions.Policies.EmotionCorrespondsToSituation.message,
        correlationId,
      });

      return c.json(
        {
          message: Emotions.Policies.EmotionCorrespondsToSituation.message,
          _known: true,
        },
        400,
      );
    }

    if (error instanceof Emotions.Policies.OneEmotionPerEntry.error) {
      infra.logger.error({
        message: "OneEmotionPerEntry",
        operation: Emotions.Policies.OneEmotionPerEntry.message,
        correlationId,
      });

      return c.json(
        {
          message: Emotions.Policies.OneEmotionPerEntry.message,
          _known: true,
        },
        400,
      );
    }

    if (error instanceof Emotions.Policies.OneReactionPerEntry.error) {
      infra.logger.error({
        message: "OneReactionPerEmotionJournalEntry",
        operation: Emotions.Policies.OneReactionPerEntry.message,
        correlationId,
      });

      return c.json(
        {
          message: Emotions.Policies.OneReactionPerEntry.message,
          _known: true,
        },
        400,
      );
    }

    if (error instanceof Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.error) {
      infra.logger.error({
        message: "ReactionCorrespondsToSituationAndEmotion",
        operation: Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.message,
        correlationId,
      });

      return c.json(
        {
          message: Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.message,
          _known: true,
        },
        400,
      );
    }

    if (error instanceof Emotions.Policies.EmotionForReappraisalExists.error) {
      infra.logger.error({
        message: "EmotionForReappraisalExists",
        operation: Emotions.Policies.EmotionForReappraisalExists.message,
        correlationId,
      });

      return c.json(
        {
          message: Emotions.Policies.EmotionForReappraisalExists.message,
          _known: true,
        },
        400,
      );
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
