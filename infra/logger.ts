import * as bg from "@bgord/bun";
import { Env } from "./env";

export const logger = new bg.Logger({
  app: "lobbygow",
  environment: Env.type,
  level: Env.LOGS_LEVEL,
});
