import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { Hono } from "hono";
import { timeout } from "hono/timeout";
import * as App from "+app";
import * as infra from "+infra";
import { AuthShield, auth } from "+infra/auth";
import { BasicAuthShield } from "+infra/basic-auth-shield";
import { CaptchaShield } from "+infra/captcha";
import { Env } from "+infra/env";
import { healthcheck } from "+infra/healthcheck";
import { I18nConfig } from "+infra/i18n";
import { logger } from "+infra/logger";
import * as RateLimiters from "+infra/rate-limiters";
import { ResponseCache } from "+infra/response-cache";

import "+infra/register-event-handlers";
import "+infra/register-command-handlers";

const server = new Hono<infra.HonoConfig>();

server.use(...bg.Setup.essentials(logger, I18nConfig, { cors: AuthShield.cors }));

const startup = new tools.Stopwatch();

// Healthcheck =================
server.get(
  "/healthcheck",
  bg.RateLimitShield({
    enabled: Env.type === bg.NodeEnvironmentEnum.production,
    subject: bg.AnonSubjectResolver,
    store: RateLimiters.HealthcheckStore,
  }),
  timeout(tools.Time.Seconds(15).ms, infra.requestTimeoutError),
  BasicAuthShield,
  ...bg.Healthcheck.build(healthcheck),
);
// =============================

// Emotions ====================
const entry = new Hono();

entry.use("*", AuthShield.attach, AuthShield.verify);
entry.post("/log", App.HTTP.Emotions.LogEntry);
entry.post("/time-capsule-entry/schedule", App.HTTP.Emotions.ScheduleTimeCapsuleEntry);
entry.post("/:entryId/reappraise-emotion", App.HTTP.Emotions.ReappraiseEmotion);
entry.post("/:entryId/evaluate-reaction", App.HTTP.Emotions.EvaluateReaction);
entry.delete("/:entryId/delete", App.HTTP.Emotions.DeleteEntry);
entry.get(
  "/export-data",
  bg.RateLimitShield({
    enabled: Env.type === bg.NodeEnvironmentEnum.production,
    subject: bg.UserSubjectResolver,
    store: RateLimiters.EntriesDataStore,
  }),
  App.HTTP.Emotions.ExportData,
);
server.route("/entry", entry);
// =============================

// Shared ======================
server.get("/shared/entries/:shareableLinkId", App.HTTP.Emotions.GetSharedEntries);

// Weekly review ===============
const weeklyReview = new Hono();

weeklyReview.use("*", AuthShield.attach, AuthShield.verify);
weeklyReview.post(
  "/:weeklyReviewId/export/email",
  bg.RateLimitShield({
    enabled: Env.type === bg.NodeEnvironmentEnum.production,
    subject: bg.UserSubjectResolver,
    store: RateLimiters.WeeklyReviewExportEmailStore,
  }),
  CaptchaShield.verify,
  App.HTTP.Emotions.ExportWeeklyReviewByEmail,
);
weeklyReview.get(
  "/:weeklyReviewId/export/download",
  bg.RateLimitShield({
    enabled: Env.type === bg.NodeEnvironmentEnum.production,
    subject: bg.UserSubjectResolver,
    store: RateLimiters.WeeklyReviewExportDownloadStore,
  }),
  App.HTTP.Emotions.DownloadWeeklyReview,
);
server.route("/weekly-review", weeklyReview);
// =============================

// Publishing ==================
const publishing = new Hono();

publishing.use("*", AuthShield.attach, AuthShield.verify);
publishing.post(
  "/link/create",
  bg.RateLimitShield({
    enabled: Env.type === bg.NodeEnvironmentEnum.production,
    subject: bg.UserSubjectResolver,
    store: RateLimiters.ShareableLinkCreateStore,
  }),
  App.HTTP.Publishing.CreateShareableLink,
);
publishing.post("/link/:shareableLinkId/revoke", App.HTTP.Publishing.RevokeShareableLink);
server.route("/publishing", publishing);
// =============================

//Translations =================
server.get("/translations", ResponseCache.handle, ...bg.Translations.build());
// =============================

// Auth ========================
server.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));
// =============================

server.onError(App.HTTP.ErrorHandler.handle);

export { server, startup };
