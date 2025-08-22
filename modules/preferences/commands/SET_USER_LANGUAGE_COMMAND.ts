import * as bg from "@bgord/bun";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+preferences/value-objects";

export const SET_USER_LANGUAGE_COMMAND = "SET_USER_LANGUAGE_COMMAND";

export const SetUserLanguageCommand = z.object({
  ...bg.CommandEnvelopeSchema,
  name: z.literal(SET_USER_LANGUAGE_COMMAND),
  payload: z.object({ language: z.instanceof(VO.LanguageTag), userId: Auth.VO.UserId }),
});

export type SetUserLanguageCommandType = z.infer<typeof SetUserLanguageCommand>;
