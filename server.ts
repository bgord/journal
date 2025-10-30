import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
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
import { SupportedLanguages } from "./modules/supported-languages";

import "+infra/register-event-handlers";
import "+infra/register-command-handlers";

const Deps = {
  Logger: Adapters.Logger,
  I18n: I18nConfig,
  IdProvider: Adapters.IdProvider,
  Clock: Adapters.Clock,
  JsonFileReader: Adapters.JsonFileReader,
};
const TranslationsDeps = { JsonFileReader: Adapters.JsonFileReader, Logger: Adapters.Logger };

const production = Env.type === bg.NodeEnvironmentEnum.production;
const server = new Hono<infra.HonoConfig>().basePath("/api");

server.use(
  ...bg.Setup.essentials(Deps, {
    cors: {
      origin: ["http://localhost:3000", "https://journal.bgord.dev", "http://journal.bgord.dev"],
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["content-type", "x-requested-with", "x-correlation-id", "authorization"],
      exposeHeaders: ["Set-Cookie"],
      maxAge: 86400,
    },
    // httpLogger: { skip: ["/api/translations", "/api/profile-avatar/get", "/api/auth/get-session"] },
  }),
);

const startup = new tools.Stopwatch(Adapters.Clock.nowMs());

// Healthcheck =================
server.get(
  "/healthcheck",
  bg.ShieldRateLimit(
    { enabled: production, subject: bg.AnonSubjectResolver, store: RateLimiters.HealthcheckStore },
    Deps,
  ),
  timeout(tools.Duration.Seconds(15).ms, infra.requestTimeoutError),
  BasicAuthShield,
  ...bg.Healthcheck.build(healthcheck, Deps),
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
    { enabled: production, subject: bg.UserSubjectResolver, store: RateLimiters.EntriesDataStore },
    Deps,
  ),
  HTTP.Emotions.ExportData,
);
entry.get(
  "/export-entries",
  bg.ShieldRateLimit(
    { enabled: production, subject: bg.UserSubjectResolver, store: RateLimiters.EntriesEntriesStore },
    Deps,
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
      enabled: production,
      subject: bg.UserSubjectResolver,
      store: RateLimiters.WeeklyReviewExportEmailStore,
    },
    Deps,
  ),
  HTTP.Emotions.ExportWeeklyReviewByEmail,
);
weeklyReview.get(
  "/:weeklyReviewId/export/download",
  bg.ShieldRateLimit(
    {
      enabled: production,
      subject: bg.UserSubjectResolver,
      store: RateLimiters.WeeklyReviewExportDownloadStore,
    },
    Deps,
  ),
  HTTP.Emotions.DownloadWeeklyReview,
);
server.route("/weekly-review", weeklyReview);
// =============================

// Publishing ==================
const publishing = new Hono();

publishing.use("*", AuthShield.attach, AuthShield.verify);
publishing.get("/links/list", HTTP.Publishing.ListShareableLinks);
publishing.post(
  "/link/create",
  bg.ShieldRateLimit(
    { enabled: production, subject: bg.UserSubjectResolver, store: RateLimiters.ShareableLinkCreateStore },
    Deps,
  ),
  HTTP.Publishing.CreateShareableLink,
);
publishing.post("/link/:shareableLinkId/revoke", HTTP.Publishing.RevokeShareableLink);
publishing.post("/link/:shareableLinkId/hide", HTTP.Publishing.HideShareableLink);
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
server.get("/history/:subject/list", AuthShield.attach, AuthShield.verify, HTTP.History.HistoryList);
// =============================

// Dashboard ===================
server.get("/dashboard/get", AuthShield.attach, AuthShield.verify, HTTP.GetDashboard);
// =============================

// Auth ========================
server.on(["POST", "GET"], "/auth/*", async (c) => {
  function redirectPreservingCookies(target: string, status = 302) {
    const headers = new Headers(response.headers);
    headers.set("Location", target);
    return new Response(null, { status, headers });
  }
  const response = await auth.handler(c.req.raw);

  if (
    c.req.method === "POST" &&
    c.req.path === "/api/auth/sign-in/email" &&
    [200, 204, 302].includes(response.status)
  ) {
    return redirectPreservingCookies("/?filter=today&query=");
  }

  if (
    c.req.method === "POST" &&
    c.req.path === "/api/auth/sign-out" &&
    [200, 302].includes(response.status)
  ) {
    return redirectPreservingCookies("/public/login.html");
  }

  return response;
});
// =============================

server.onError(HTTP.ErrorHandler.handle);

export { server, startup };
