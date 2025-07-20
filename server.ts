import * as infra from "+infra";
import { AuthShield, auth } from "+infra/auth";
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

const server = new Hono<infra.HonoConfig>();

server.use(...bg.Setup.essentials(logger, I18nConfig, { cors: AuthShield.cors }));

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
const entry = new Hono();

entry.use("*", AuthShield.attach, AuthShield.verify);
entry.post("/log", Emotions.Routes.LogEntry);
entry.post("/:entryId/reappraise-emotion", Emotions.Routes.ReappraiseEmotion);
entry.post("/:entryId/evaluate-reaction", Emotions.Routes.EvaluateReaction);
entry.delete("/:entryId/delete", Emotions.Routes.DeleteEntry);
server.route("/entry", entry);
// =============================

// Alarms ====================
const alarms = new Hono();

alarms.use("*", AuthShield.attach, AuthShield.verify);
alarms.get("/list", Emotions.Routes.DashboardStats);
server.route("/dashboard", alarms);
// =============================

//Translations =================
server.get("/translations", ...bg.Translations.build());
// =============================

// Auth ========================
server.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));
// =============================

server.onError(App.Routes.ErrorHandler.handle);

export { server, startup };
