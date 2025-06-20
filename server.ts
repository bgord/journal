import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { Hono } from "hono";
import { timeout } from "hono/timeout";
import * as App from "./app";
import * as infra from "./infra";

import * as Emotions from "./modules/emotions";

type Env = { Variables: infra.Variables; startup: tools.Stopwatch };

const server = new Hono<Env>();

server.use(...bg.Setup.essentials(infra.logger, infra.I18nConfig));

const startup = new tools.Stopwatch();

// Healthcheck =================
server.get(
  "/healthcheck",
  bg.rateLimitShield({
    time: tools.Time.Seconds(5),
    enabled: infra.Env.type === bg.NodeEnvironmentEnum.production,
  }),
  timeout(tools.Time.Seconds(15).ms, infra.requestTimeoutError),
  infra.BasicAuthShield,
  ...bg.Healthcheck.build(infra.healthcheck),
);
// =============================

// Emotions =================
server.post("/emotions/log-situation", Emotions.Routes.LogSituation);
server.post("/emotions/:id/log-emotion", Emotions.Routes.LogEmotion);
server.post("/emotions/:id/log-reaction", Emotions.Routes.LogReaction);
server.post("/emotions/:id/reappraise-emotion", Emotions.Routes.ReappraiseEmotion);
server.post("/emotions/:id/evaluate-reaction", Emotions.Routes.EvaluateReaction);
server.delete("/emotions/:id/delete", Emotions.Routes.DeleteJournalEntry);
// =============================

server.onError(App.Routes.ErrorHandler.handle);

export { server, startup };
