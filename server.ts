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
import { I18nConfig } from "+infra/i18n";
import { prerequisites } from "+infra/prerequisites";
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
const server = new Hono<infra.Config>().basePath("/api");

server.use(
  ...bg.Setup.essentials(Deps, {
    httpLogger: { skip: ["/api/translations", "/api/profile-avatar/get", "/api/auth/get-session"] },
  }),
);

const startup = new tools.Stopwatch(Adapters.Clock.now());

// Healthcheck =================
server.get(
  "/healthcheck",
  new bg.ShieldRateLimitAdapter(
    { enabled: production, subject: bg.AnonSubjectResolver, store: RateLimiters.HealthcheckStore },
    Deps,
  ).verify,
  timeout(tools.Duration.Seconds(15).ms, infra.requestTimeoutError),
  BasicAuthShield,
  ...bg.Healthcheck.build(prerequisites, Deps),
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
  new bg.ShieldRateLimitAdapter(
    { enabled: production, subject: bg.UserSubjectResolver, store: RateLimiters.EntriesDataStore },
    Deps,
  ).verify,
  HTTP.Emotions.ExportData,
);
entry.get(
  "/export-entries",
  new bg.ShieldRateLimitAdapter(
    { enabled: production, subject: bg.UserSubjectResolver, store: RateLimiters.EntriesEntriesStore },
    Deps,
  ).verify,
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
  new bg.ShieldRateLimitAdapter(
    {
      enabled: production,
      subject: bg.UserSubjectResolver,
      store: RateLimiters.WeeklyReviewExportEmailStore,
    },
    Deps,
  ).verify,
  HTTP.Emotions.ExportWeeklyReviewByEmail,
);
weeklyReview.get(
  "/:weeklyReviewId/export/download",
  new bg.ShieldRateLimitAdapter(
    {
      enabled: production,
      subject: bg.UserSubjectResolver,
      store: RateLimiters.WeeklyReviewExportDownloadStore,
    },
    Deps,
  ).verify,
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
  new bg.ShieldRateLimitAdapter(
    { enabled: production, subject: bg.UserSubjectResolver, store: RateLimiters.ShareableLinkCreateStore },
    Deps,
  ).verify,
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
    mimeTypes: Preferences.VO.ProfileAvatarMimeTypes,
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
  const response = await auth.handler(c.req.raw);

  if (
    c.req.method === "POST" &&
    c.req.path === "/api/auth/sign-out" &&
    [200, 302].includes(response.status)
  ) {
    return c.redirect("/public/login.html");
  }

  return response;
});
// =============================

server.onError(HTTP.ErrorHandler.handle);

export { server, startup };
