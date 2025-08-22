import * as bg from "@bgord/bun";
import { z } from "zod/v4";
import * as Auth from "+auth";
import { SupportedLanguages } from "+languages";

export const USER_LANGUAGE_SET_EVENT = "USER_LANGUAGE_SET_EVENT";

export const UserLanguageSetEvent = z.object({
  ...bg.EventEnvelopeSchema,
  name: z.literal(USER_LANGUAGE_SET_EVENT),
  payload: z.object({ userId: Auth.VO.UserId, language: z.enum(SupportedLanguages) }),
});

export type UserLanguageSetEventType = z.infer<typeof UserLanguageSetEvent>;
