import * as bg from "@bgord/bun";
import { Env } from "+infra/env";

const app = "lobbygow";

const axiom = new bg.AxiomTransport({ token: Env.AXIOM_API_TOKEN, dataset: app });

export const logger = new bg.Logger({
  app,
  environment: Env.type,
  level: Env.LOGS_LEVEL,
  transports: Env.type === bg.NodeEnvironmentEnum.production ? [axiom] : [],
});
