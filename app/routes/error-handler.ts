import * as bg from "@bgord/bun";
import hono from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod/v4";
import * as infra from "../../infra";

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
      infra.logger.error({
        message: "Invalid payload",
        operation: "invalid_payload",
        correlationId,
        metadata: { url, body: await bg.safeParseBody(c) },
      });

      return c.json({ message: "payload.invalid.error", _known: true }, 400);
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
