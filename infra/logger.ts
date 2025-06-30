// cspell:disable-next-line
import { WinstonTransport as AxiomTransport } from "@axiomhq/winston";
import * as bg from "@bgord/bun";
import { Env } from "./env";

const axiom = new AxiomTransport({ token: Env.AXIOM_API_TOKEN, dataset: Env.AXIOM_DATASET_NAME });

export const logger = new bg.Logger({
  app: "lobbygow",
  environment: Env.type,
  level: Env.LOGS_LEVEL,
  transports: Env.type === bg.NodeEnvironmentEnum.production ? [axiom] : [],
});
