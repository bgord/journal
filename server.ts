import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { Hono } from "hono";
import { timeout } from "hono/timeout";
import * as infra from "+infra";
import { AlarmDirectory, EntriesSharing, EntrySnapshot, WeeklyReviewExport } from "+infra/adapters/emotions";
import { AuthShield, auth } from "+infra/auth";
import { BasicAuthShield } from "+infra/basic-auth-shield";
import { Env } from "+infra/env";
import { healthcheck } from "+infra/healthcheck";
import { I18nConfig } from "+infra/i18n";
import { logger } from "+infra/logger";
import * as RateLimiters from "+infra/rate-limiters";
import { ResponseCache } from "+infra/response-cache";
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
entry.post("/log", Emotions.Routes.LogEntry);
entry.post("/time-capsule-entry/schedule", Emotions.Routes.ScheduleTimeCapsuleEntry);
entry.post("/:entryId/reappraise-emotion", Emotions.Routes.ReappraiseEmotion);
entry.post("/:entryId/evaluate-reaction", Emotions.Routes.EvaluateReaction);
entry.delete("/:entryId/delete", Emotions.Routes.DeleteEntry);
entry.get(
  "/export",
  bg.RateLimitShield({
    enabled: Env.type === bg.NodeEnvironmentEnum.production,
    subject: bg.UserSubjectResolver,
    store: RateLimiters.EntriesExportStore,
  }),
  Emotions.Routes.ExportEntries(EntrySnapshot, AlarmDirectory),
);
server.route("/entry", entry);
// =============================

// Shared ======================
server.get("/shared/entries/:shareableLinkId", Emotions.Routes.GetSharedEntries(EntriesSharing));

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
  Emotions.Routes.ExportWeeklyReviewByEmail,
);
weeklyReview.get(
  "/:weeklyReviewId/export/download",
  bg.RateLimitShield({
    enabled: Env.type === bg.NodeEnvironmentEnum.production,
    subject: bg.UserSubjectResolver,
    store: RateLimiters.WeeklyReviewExportDownloadStore,
  }),
  Emotions.Routes.DownloadWeeklyReview(WeeklyReviewExport),
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
