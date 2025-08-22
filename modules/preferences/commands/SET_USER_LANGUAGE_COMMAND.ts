import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";

export const SET_USER_LANGUAGE_COMMAND = "SET_USER_LANGUAGE_COMMAND";

export const SetUserLanguageCommand = z.object({
  ...bg.CommandEnvelopeSchema,
  name: z.literal(SET_USER_LANGUAGE_COMMAND),
  payload: z.object({ language: tools.Language, userId: Auth.VO.UserId }),
});

export type SetUserLanguageCommandType = z.infer<typeof SetUserLanguageCommand>;
