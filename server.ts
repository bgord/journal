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
    di.Adapters.System.ShieldRateLimit.Healthcheck.verify,
    di.Adapters.System.ShieldTimeout.verify,
    di.Adapters.System.ShieldBasicAuth.verify,
    ...bg.Healthcheck.build(di.Tools.prerequisites, di.Adapters.System),
  );
  // =============================

  // Emotions ====================
  const entry = new Hono();

  entry.use("*", di.Adapters.System.Auth.ShieldAuth.attach, di.Adapters.System.Auth.ShieldAuth.verify);
  entry.post("/log", HTTP.Emotions.LogEntry(di.Adapters.System));
  entry.post("/time-capsule-entry/schedule", HTTP.Emotions.ScheduleTimeCapsuleEntry(di.Adapters.System));
  entry.post("/:entryId/reappraise-emotion", HTTP.Emotions.ReappraiseEmotion(di.Adapters.System));
  entry.post("/:entryId/evaluate-reaction", HTTP.Emotions.EvaluateReaction(di.Adapters.System));
  entry.delete("/:entryId/delete", HTTP.Emotions.DeleteEntry(di.Adapters.System));
  entry.get(
    "/export-data",
    di.Adapters.System.ShieldRateLimit.EntryDataExport.verify,
    HTTP.Emotions.ExportData({
      ...di.Adapters.System,
      EntrySnapshot: di.Adapters.Emotions.EntrySnapshot,
      AlarmDirectory: di.Adapters.Emotions.AlarmDirectory,
    }),
  );
  entry.get(
    "/export-entries",
    di.Adapters.System.ShieldRateLimit.EntryExportEntries.verify,
    HTTP.Emotions.ExportEntries({
      ...di.Adapters.System,
      PdfGenerator: di.Adapters.Emotions.PdfGenerator,
      EntrySnapshot: di.Adapters.Emotions.EntrySnapshot,
    }),
  );
  entry.get(
    "/list",
    HTTP.Emotions.ListEntries({ ...di.Adapters.System, EntrySnapshot: di.Adapters.Emotions.EntrySnapshot }),
  );
  server.route("/entry", entry);
  // =============================

  // Shared ======================
  server.get(
    "/shared/entries/:shareableLinkId",
    HTTP.Emotions.GetSharedEntries({
      ...di.Adapters.System,
      ShareableLinkAccessOHQ: di.Adapters.Publishing.ShareableLinkAccessOHQ,
      EntriesSharing: di.Adapters.Emotions.EntriesSharingOHQ,
    }),
  );

  // Weekly review ===============
  const weeklyReview = new Hono();

  weeklyReview.use("*", di.Adapters.System.Auth.ShieldAuth.attach, di.Adapters.System.Auth.ShieldAuth.verify);
  weeklyReview.post(
    "/:weeklyReviewId/export/email",
    di.Adapters.System.ShieldRateLimit.WeeklyReviewExportEmail.verify,
    HTTP.Emotions.ExportWeeklyReviewByEmail(di.Adapters.System),
  );
  weeklyReview.get(
    "/:weeklyReviewId/export/download",
    di.Adapters.System.ShieldRateLimit.WeeklyReviewExportDownload.verify,
    HTTP.Emotions.DownloadWeeklyReview({
      ...di.Adapters.System,
      WeeklyReviewExportQuery: di.Adapters.Emotions.WeeklyReviewExportQuery,
      PdfGenerator: di.Adapters.Emotions.PdfGenerator,
    }),
  );
  server.route("/weekly-review", weeklyReview);
  // =============================

  // Publishing ==================
  const publishing = new Hono();

  publishing.use("*", di.Adapters.System.Auth.ShieldAuth.attach, di.Adapters.System.Auth.ShieldAuth.verify);
  publishing.get(
    "/links/list",
    HTTP.Publishing.ListShareableLinks({
      ...di.Adapters.System,
      ShareableLinkSnapshot: di.Adapters.Publishing.ShareableLinkSnapshot,
    }),
  );
  publishing.post(
    "/link/create",
    di.Adapters.System.ShieldRateLimit.PublishingLinkCreate.verify,
    HTTP.Publishing.CreateShareableLink(di.Adapters.System),
  );
  publishing.post("/link/:shareableLinkId/revoke", HTTP.Publishing.RevokeShareableLink(di.Adapters.System));
  publishing.post("/link/:shareableLinkId/hide", HTTP.Publishing.HideShareableLink());
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
    HTTP.Preferences.UpdateUserLanguage(di.Adapters.System),
  );
  server.post(
    "/preferences/profile-avatar/update",
    di.Adapters.System.Auth.ShieldAuth.attach,
    di.Adapters.System.Auth.ShieldAuth.verify,
    ...bg.FileUploader.validate({
      mimeTypes: Preferences.VO.ProfileAvatarMimeTypes,
      maxFilesSize: Preferences.VO.ProfileAvatarMaxSize,
    }),
    HTTP.Preferences.UpdateProfileAvatar(di.Adapters.System),
  );
  server.get(
    "/profile-avatar/get",
    di.Adapters.System.Auth.ShieldAuth.attach,
    di.Adapters.System.Auth.ShieldAuth.verify,
    HTTP.Preferences.GetProfileAvatar(di.Adapters.System),
  );
  server.delete(
    "/preferences/profile-avatar",
    di.Adapters.System.Auth.ShieldAuth.attach,
    di.Adapters.System.Auth.ShieldAuth.verify,
    HTTP.Preferences.RemoveProfileAvatar(di.Adapters.System),
  );
  // =============================

  // AI ==========================
  server.get(
    "/ai-usage-today/get",
    di.Adapters.System.Auth.ShieldAuth.attach,
    di.Adapters.System.Auth.ShieldAuth.verify,
    HTTP.AI.GetAiUsageToday({ ...di.Adapters.System, RuleInspector: di.Adapters.AI.RuleInspector }),
  );
  // =============================

  // History =====================
  server.get(
    "/history/:subject/list",
    di.Adapters.System.Auth.ShieldAuth.attach,
    di.Adapters.System.Auth.ShieldAuth.verify,
    HTTP.History.HistoryList({ ...di.Adapters.System, HistoryReader: di.Adapters.History.HistoryReader }),
  );
  // =============================

  // Dashboard ===================
  server.get(
    "/dashboard/get",
    di.Adapters.System.Auth.ShieldAuth.attach,
    di.Adapters.System.Auth.ShieldAuth.verify,
    HTTP.GetDashboard({
      ...di.Adapters.System,
      WeeklyReviewExport: di.Adapters.Emotions.WeeklyReviewExportQuery,
    }),
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

  server.onError(HTTP.ErrorHandler.handle(di.Adapters.System));

  return server;
}
