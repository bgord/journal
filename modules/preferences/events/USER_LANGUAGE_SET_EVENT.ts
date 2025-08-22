import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";

export const USER_LANGUAGE_SET_EVENT = "USER_LANGUAGE_SET_EVENT";

export const UserLanguageSetEvent = z.object({
  ...bg.EventEnvelopeSchema,
  name: z.literal(USER_LANGUAGE_SET_EVENT),
  payload: z.object({ userId: Auth.VO.UserId, language: tools.Language }),
});

export type UserLanguageSetEventType = z.infer<typeof UserLanguageSetEvent>;
