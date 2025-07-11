import * as infra from "+infra";
import { BasicAuthShield } from "+infra/basic-auth-shield";
import { Env } from "+infra/env";
import { healthcheck } from "+infra/healthcheck";
import { I18nConfig } from "+infra/i18n";
import { logger } from "+infra/logger";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { Hono } from "hono";
import { timeout } from "hono/timeout";
import * as App from "./app";
import * as Emotions from "./modules/emotions";

import "+infra/register-event-handlers";
import "+infra/register-command-handlers";

type Config = { Variables: infra.Variables; startup: tools.Stopwatch };

const server = new Hono<Config>();

server.use(...bg.Setup.essentials(logger, I18nConfig));

const startup = new tools.Stopwatch();

// Healthcheck =================
server.get(
  "/healthcheck",
  bg.rateLimitShield({
    time: tools.Time.Seconds(5),
    enabled: Env.type === bg.NodeEnvironmentEnum.production,
  }),
  timeout(tools.Time.Seconds(15).ms, infra.requestTimeoutError),
  BasicAuthShield,
  ...bg.Healthcheck.build(healthcheck),
);
// =============================

// Emotions ====================
server.get("/entry/list", Emotions.Routes.ListEntries);
server.post("/entry/log", Emotions.Routes.LogEntry);
server.post("/entry/:id/reappraise-emotion", Emotions.Routes.ReappraiseEmotion);
server.post("/entry/:id/evaluate-reaction", Emotions.Routes.EvaluateReaction);
server.delete("/entry/:id/delete", Emotions.Routes.DeleteEntry);
// =============================

//Translations =================
server.get("/translations", ...bg.Translations.build());
// =============================

server.onError(App.Routes.ErrorHandler.handle);

export { server, startup };
