import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { timeout } from "hono/timeout";
import { HTTP } from "+app";
import * as infra from "+infra";
import * as Preferences from "+preferences";
import * as Adapters from "+infra/adapters";
import { AuthShield, auth } from "+infra/auth";
import { BasicAuthShield } from "+infra/basic-auth-shield";
import { Env } from "+infra/env";
import { healthcheck } from "+infra/healthcheck";
import { I18nConfig } from "+infra/i18n";
import * as RateLimiters from "+infra/rate-limiters";
import { ResponseCache } from "+infra/response-cache";
import { db } from "./infra/db";
import * as Schema from "./infra/schema";
import { SupportedLanguages } from "./modules/supported-languages";

import "+infra/register-event-handlers";
import "+infra/register-command-handlers";

const ServerDeps = {
  Logger: Adapters.Logger,
  I18n: I18nConfig,
  IdProvider: Adapters.IdProvider,
  Clock: Adapters.Clock,
  JsonFileReader: Adapters.JsonFileReader,
};
const ShieldRateLimitDeps = { Clock: Adapters.Clock };
const HealthcheckDeps = {
  Clock: Adapters.Clock,
  JsonFileReader: Adapters.JsonFileReader,
  Logger: Adapters.Logger,
};
const TranslationsDeps = { JsonFileReader: Adapters.JsonFileReader, Logger: Adapters.Logger };

const server = new Hono<infra.HonoConfig>().basePath("/api");

server.use(
  ...bg.Setup.essentials(ServerDeps, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000", "https://journal.bgord.dev"],
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["content-type", "x-requested-with", "x-correlation-id", "authorization"],
      exposeHeaders: ["Set-Cookie"],
      maxAge: 86400,
    },
    httpLogger: { skip: ["/api/translations", "/api/profile-avatar/get", "/api/auth/get-session"] },
  }),
);

const startup = new tools.Stopwatch(Adapters.Clock.nowMs());

// Healthcheck =================
server.get(
  "/healthcheck",
  bg.ShieldRateLimit(
    {
      enabled: Env.type === bg.NodeEnvironmentEnum.production,
      subject: bg.AnonSubjectResolver,
      store: RateLimiters.HealthcheckStore,
    },
    ShieldRateLimitDeps,
  ),
  timeout(tools.Duration.Seconds(15).ms, infra.requestTimeoutError),
  BasicAuthShield,
  ...bg.Healthcheck.build(healthcheck, HealthcheckDeps),
);
// =============================

// Emotions ====================
const entry = new Hono();

entry.use("*", AuthShield.attach, AuthShield.verify);
entry.post("/log", HTTP.Emotions.LogEntry);
entry.post("/time-capsule-entry/schedule", HTTP.Emotions.ScheduleTimeCapsuleEntry);
entry.post("/:entryId/reappraise-emotion", HTTP.Emotions.ReappraiseEmotion);
entry.post("/:entryId/evaluate-reaction", HTTP.Emotions.EvaluateReaction);
entry.delete("/:entryId/delete", HTTP.Emotions.DeleteEntry);
entry.get(
  "/export-data",
  bg.ShieldRateLimit(
    {
      enabled: Env.type === bg.NodeEnvironmentEnum.production,
      subject: bg.UserSubjectResolver,
      store: RateLimiters.EntriesDataStore,
    },
    ShieldRateLimitDeps,
  ),
  HTTP.Emotions.ExportData,
);
entry.get(
  "/export-entries",
  bg.ShieldRateLimit(
    {
      enabled: Env.type === bg.NodeEnvironmentEnum.production,
      subject: bg.UserSubjectResolver,
      store: RateLimiters.EntriesEntriesStore,
    },
    ShieldRateLimitDeps,
  ),
  HTTP.Emotions.ExportEntries,
);
entry.get("/list", HTTP.Emotions.ListEntries);
server.route("/entry", entry);
// =============================

// Shared ======================
server.get("/shared/entries/:shareableLinkId", HTTP.Emotions.GetSharedEntries);

// Weekly review ===============
const weeklyReview = new Hono();

weeklyReview.use("*", AuthShield.attach, AuthShield.verify);
weeklyReview.post(
  "/:weeklyReviewId/export/email",
  bg.ShieldRateLimit(
    {
      enabled: Env.type === bg.NodeEnvironmentEnum.production,
      subject: bg.UserSubjectResolver,
      store: RateLimiters.WeeklyReviewExportEmailStore,
    },
    ShieldRateLimitDeps,
  ),
  Adapters.CaptchaShield.verify,
  HTTP.Emotions.ExportWeeklyReviewByEmail,
);
weeklyReview.get(
  "/:weeklyReviewId/export/download",
  bg.ShieldRateLimit(
    {
      enabled: Env.type === bg.NodeEnvironmentEnum.production,
      subject: bg.UserSubjectResolver,
      store: RateLimiters.WeeklyReviewExportDownloadStore,
    },
    ShieldRateLimitDeps,
  ),
  HTTP.Emotions.DownloadWeeklyReview,
);
server.route("/weekly-review", weeklyReview);
// =============================

// Publishing ==================
const publishing = new Hono();

publishing.use("*", AuthShield.attach, AuthShield.verify);
publishing.post(
  "/link/create",
  bg.ShieldRateLimit(
    {
      enabled: Env.type === bg.NodeEnvironmentEnum.production,
      subject: bg.UserSubjectResolver,
      store: RateLimiters.ShareableLinkCreateStore,
    },
    ShieldRateLimitDeps,
  ),
  HTTP.Publishing.CreateShareableLink,
);
publishing.post("/link/:shareableLinkId/revoke", HTTP.Publishing.RevokeShareableLink);
server.route("/publishing", publishing);
// =============================

//Translations =================
server.get(
  "/translations",
  ResponseCache.handle,
  ...bg.Translations.build(SupportedLanguages, TranslationsDeps),
);
// =============================

//Preferences =================
server.post(
  "/preferences/user-language/update",
  AuthShield.attach,
  AuthShield.verify,
  HTTP.Preferences.UpdateUserLanguage,
);
server.post(
  "/preferences/profile-avatar/update",
  AuthShield.attach,
  AuthShield.verify,
  ...bg.FileUploader.validate({
    mimeTypes: Preferences.VO.ProfileAvatarMimeTypes.map((mime) => mime.toString()),
    maxFilesSize: Preferences.VO.ProfileAvatarMaxSize,
  }),
  HTTP.Preferences.UpdateProfileAvatar,
);
server.get("/profile-avatar/get", AuthShield.attach, AuthShield.verify, HTTP.Preferences.GetProfileAvatar);
server.delete(
  "/preferences/profile-avatar",
  AuthShield.attach,
  AuthShield.verify,
  HTTP.Preferences.RemoveProfileAvatar,
);
// =============================

// AI ==========================
server.get("/ai-usage-today/get", AuthShield.attach, AuthShield.verify, HTTP.AI.GetAiUsageToday);
// =============================

// History =====================
server.get("/history/:subject/list", AuthShield.attach, AuthShield.verify, async (c) => {
  const subject = bg.History.VO.HistorySubject.parse(c.req.param("subject"));

  const result = await db
    .select()
    .from(Schema.history)
    .where(eq(Schema.history.subject, subject))
    .orderBy(desc(Schema.history.createdAt))
    .limit(15);

  return c.json(result);
});
// =============================

// Auth ========================
server.on(["POST", "GET"], "/auth/*", async (c) => {
  const response = await auth.handler(c.req.raw);

  if (
    c.req.method === "POST" &&
    c.req.path === "/api/auth/sign-out" &&
    [200, 302].includes(response.status)
  ) {
    return c.redirect("/login");
  }

  return response;
});
// =============================

server.onError(HTTP.ErrorHandler.handle);

export { server, startup };
