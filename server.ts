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

import "+infra/register-event-handlers";
import "+infra/register-command-handlers";

const ServerDeps = {
  Logger: Adapters.Logger,
  I18n: I18nConfig,
  IdProvider: Adapters.IdProvider,
  Clock: Adapters.Clock,
};
const ShieldRateLimitDeps = { Clock: Adapters.Clock };
const HealthcheckDeps = { Clock: Adapters.Clock };

const server = new Hono<infra.HonoConfig>();

server.use(
  ...bg.Setup.essentials(ServerDeps, {
    cors: AuthShield.cors,
    secureHeaders: { crossOriginResourcePolicy: "cross-origin" },
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
  timeout(tools.Time.Seconds(15).ms, infra.requestTimeoutError),
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
server.get("/translations", ResponseCache.handle, ...bg.Translations.build());
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
    mimeTypes: Preferences.VO.ProfileAvatarMimeTypes.map((mime) => mime.raw),
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

// Auth ========================
server.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));
// =============================

server.onError(HTTP.ErrorHandler.handle);

export { server, startup };
