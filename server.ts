import * as bg from "@bgord/bun";
import { Hono } from "hono";
import { HTTP } from "+app";
import type * as infra from "+infra";
import * as Preferences from "+preferences";
import type { bootstrap } from "+infra/bootstrap";
import { ResponseCache } from "+infra/response-cache";
import { SupportedLanguages } from "./modules/supported-languages";

export function createServer(di: Awaited<ReturnType<typeof bootstrap>>) {
  const server = new Hono<infra.Config>()
    .basePath("/api")
    .use(
      ...bg.Setup.essentials(
        { ...di.Adapters.System, I18n: di.Tools.I18nConfig },
        { httpLogger: { skip: ["/api/translations", "/api/profile-avatar/get", "/api/auth/get-session"] } },
      ),
    );

  // Healthcheck =================
  server.get(
    "/healthcheck",
    di.Adapters.System.ShieldRateLimit.verify,
    di.Adapters.System.ShieldTimeout.verify,
    di.Adapters.System.ShieldBasicAuth.verify,
    ...bg.Healthcheck.build(di.Tools.prerequisites, di.Adapters.System),
  );
  // =============================

  // Emotions ====================
  const entry = new Hono();

  entry.use("*", di.Adapters.System.Auth.ShieldAuth.attach, di.Adapters.System.Auth.ShieldAuth.verify);
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

  weeklyReview.use("*", di.Adapters.System.Auth.ShieldAuth.attach, di.Adapters.System.Auth.ShieldAuth.verify);
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

  publishing.use("*", di.Adapters.System.Auth.ShieldAuth.attach, di.Adapters.System.Auth.ShieldAuth.verify);
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
    ...bg.Translations.build(SupportedLanguages, di.Adapters.System),
  );
  // =============================

  //Preferences =================
  server.post(
    "/preferences/user-language/update",
    di.Adapters.System.Auth.ShieldAuth.attach,
    di.Adapters.System.Auth.ShieldAuth.verify,
    HTTP.Preferences.UpdateUserLanguage,
  );
  server.post(
    "/preferences/profile-avatar/update",
    di.Adapters.System.Auth.ShieldAuth.attach,
    di.Adapters.System.Auth.ShieldAuth.verify,
    ...bg.FileUploader.validate({
      mimeTypes: Preferences.VO.ProfileAvatarMimeTypes,
      maxFilesSize: Preferences.VO.ProfileAvatarMaxSize,
    }),
    HTTP.Preferences.UpdateProfileAvatar,
  );
  server.get(
    "/profile-avatar/get",
    di.Adapters.System.Auth.ShieldAuth.attach,
    di.Adapters.System.Auth.ShieldAuth.verify,
    HTTP.Preferences.GetProfileAvatar,
  );
  server.delete(
    "/preferences/profile-avatar",
    di.Adapters.System.Auth.ShieldAuth.attach,
    di.Adapters.System.Auth.ShieldAuth.verify,
    HTTP.Preferences.RemoveProfileAvatar,
  );
  // =============================

  // AI ==========================
  server.get(
    "/ai-usage-today/get",
    di.Adapters.System.Auth.ShieldAuth.attach,
    di.Adapters.System.Auth.ShieldAuth.verify,
    HTTP.AI.GetAiUsageToday,
  );
  // =============================

  // History =====================
  server.get(
    "/history/:subject/list",
    di.Adapters.System.Auth.ShieldAuth.attach,
    di.Adapters.System.Auth.ShieldAuth.verify,
    HTTP.History.HistoryList,
  );
  // =============================

  // Dashboard ===================
  server.get(
    "/dashboard/get",
    di.Adapters.System.Auth.ShieldAuth.attach,
    di.Adapters.System.Auth.ShieldAuth.verify,
    HTTP.GetDashboard,
  );
  // =============================

  // Auth ========================
  server.on(["POST", "GET"], "/auth/*", async (c) => {
    const response = await di.Adapters.System.Auth.config.handler(c.req.raw);

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

  return server;
}
