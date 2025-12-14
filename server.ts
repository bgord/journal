import * as bg from "@bgord/bun";
import { Hono } from "hono";
import { HTTP } from "+app";
import type * as infra from "+infra";
import * as Preferences from "+preferences";
import type { BootstrapType } from "+infra/bootstrap";
import { ResponseCache } from "+infra/response-cache";
import { SupportedLanguages } from "./modules/supported-languages";

export function createServer({ Adapters, Tools }: BootstrapType) {
  const server = new Hono<infra.Config>()
    .basePath("/api")
    .use(
      ...bg.Setup.essentials(
        { ...Adapters.System, I18n: Tools.I18nConfig },
        { httpLogger: { skip: ["/api/translations", "/api/profile-avatar/get", "/api/auth/get-session"] } },
      ),
    );

  // Healthcheck =================
  server.get(
    "/healthcheck",
    Adapters.System.ShieldRateLimit.Healthcheck.verify,
    Adapters.System.ShieldTimeout.verify,
    Adapters.System.ShieldBasicAuth.verify,
    ...bg.Healthcheck.build(Tools.prerequisites, Adapters.System),
  );
  // =============================

  // Emotions ====================
  const entry = new Hono();

  entry.use("*", Adapters.System.Auth.ShieldAuth.attach, Adapters.System.Auth.ShieldAuth.verify);
  entry.post("/log", HTTP.Emotions.LogEntry(Adapters.System));
  entry.post("/time-capsule-entry/schedule", HTTP.Emotions.ScheduleTimeCapsuleEntry(Adapters.System));
  entry.post("/:entryId/reappraise-emotion", HTTP.Emotions.ReappraiseEmotion(Adapters.System));
  entry.post("/:entryId/evaluate-reaction", HTTP.Emotions.EvaluateReaction(Adapters.System));
  entry.delete("/:entryId/delete", HTTP.Emotions.DeleteEntry(Adapters.System));
  entry.get(
    "/export-data",
    Adapters.System.ShieldRateLimit.EntryDataExport.verify,
    HTTP.Emotions.ExportData({ ...Adapters.System, ...Adapters.Emotions }),
  );
  entry.get(
    "/export-entries",
    Adapters.System.ShieldRateLimit.EntryExportEntries.verify,
    HTTP.Emotions.ExportEntries({ ...Adapters.System, ...Adapters.Emotions }),
  );
  entry.get("/list", HTTP.Emotions.ListEntries({ ...Adapters.System, ...Adapters.Emotions }));
  server.route("/entry", entry);
  // =============================

  // Shared ======================
  server.get(
    "/shared/entries/:shareableLinkId",
    HTTP.Emotions.GetSharedEntries({
      ...Adapters.System,
      ShareableLinkAccessOHQ: Adapters.Publishing.ShareableLinkAccessOHQ,
      EntriesSharing: Adapters.Emotions.EntriesSharingOHQ,
    }),
  );

  // Weekly review ===============
  const weeklyReview = new Hono();

  weeklyReview.use("*", Adapters.System.Auth.ShieldAuth.attach, Adapters.System.Auth.ShieldAuth.verify);
  weeklyReview.post(
    "/:weeklyReviewId/export/email",
    Adapters.System.ShieldRateLimit.WeeklyReviewExportEmail.verify,
    HTTP.Emotions.ExportWeeklyReviewByEmail(Adapters.System),
  );
  weeklyReview.get(
    "/:weeklyReviewId/export/download",
    Adapters.System.ShieldRateLimit.WeeklyReviewExportDownload.verify,
    HTTP.Emotions.DownloadWeeklyReview({ ...Adapters.System, ...Adapters.Emotions }),
  );
  server.route("/weekly-review", weeklyReview);
  // =============================

  // Publishing ==================
  const publishing = new Hono();

  publishing.use("*", Adapters.System.Auth.ShieldAuth.attach, Adapters.System.Auth.ShieldAuth.verify);
  publishing.get(
    "/links/list",
    HTTP.Publishing.ListShareableLinks({ ...Adapters.System, ...Adapters.Publishing }),
  );
  publishing.post(
    "/link/create",
    Adapters.System.ShieldRateLimit.PublishingLinkCreate.verify,
    HTTP.Publishing.CreateShareableLink(Adapters.System),
  );
  publishing.post("/link/:shareableLinkId/revoke", HTTP.Publishing.RevokeShareableLink(Adapters.System));
  publishing.post("/link/:shareableLinkId/hide", HTTP.Publishing.HideShareableLink());
  server.route("/publishing", publishing);
  // =============================

  //Translations =================
  server.get(
    "/translations",
    ResponseCache.handle,
    ...bg.Translations.build(SupportedLanguages, Adapters.System),
  );
  // =============================

  //Preferences =================
  server.post(
    "/preferences/user-language/update",
    Adapters.System.Auth.ShieldAuth.attach,
    Adapters.System.Auth.ShieldAuth.verify,
    HTTP.Preferences.UpdateUserLanguage(Adapters.System),
  );
  server.post(
    "/preferences/profile-avatar/update",
    Adapters.System.Auth.ShieldAuth.attach,
    Adapters.System.Auth.ShieldAuth.verify,
    ...bg.FileUploader.validate({
      mimeTypes: Preferences.VO.ProfileAvatarMimeTypes,
      maxFilesSize: Preferences.VO.ProfileAvatarMaxSize,
    }),
    HTTP.Preferences.UpdateProfileAvatar(Adapters.System),
  );
  server.get(
    "/profile-avatar/get",
    Adapters.System.Auth.ShieldAuth.attach,
    Adapters.System.Auth.ShieldAuth.verify,
    HTTP.Preferences.GetProfileAvatar(Adapters.System),
  );
  server.delete(
    "/preferences/profile-avatar",
    Adapters.System.Auth.ShieldAuth.attach,
    Adapters.System.Auth.ShieldAuth.verify,
    HTTP.Preferences.RemoveProfileAvatar(Adapters.System),
  );
  // =============================

  // AI ==========================
  server.get(
    "/ai-usage-today/get",
    Adapters.System.Auth.ShieldAuth.attach,
    Adapters.System.Auth.ShieldAuth.verify,
    HTTP.AI.GetAiUsageToday({ ...Adapters.System, ...Adapters.AI }),
  );
  // =============================

  // History =====================
  server.get(
    "/history/:subject/list",
    Adapters.System.Auth.ShieldAuth.attach,
    Adapters.System.Auth.ShieldAuth.verify,
    HTTP.History.HistoryList({ ...Adapters.System, HistoryReader: Adapters.History.HistoryReader }),
  );
  // =============================

  // Dashboard ===================
  server.get(
    "/dashboard/get",
    Adapters.System.Auth.ShieldAuth.attach,
    Adapters.System.Auth.ShieldAuth.verify,
    HTTP.GetDashboard({ ...Adapters.System, ...Adapters.Emotions }),
  );
  // =============================

  // Auth ========================
  server.on(["POST", "GET"], "/auth/*", async (c) => {
    const response = await Adapters.System.Auth.config.handler(c.req.raw);

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

  server.onError(HTTP.ErrorHandler.handle(Adapters.System));

  return server;
}
