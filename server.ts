import * as bg from "@bgord/bun";
import { Hono } from "hono";
import { HTTP } from "+app";
import type * as infra from "+infra";
import * as Preferences from "+preferences";
import type { BootstrapType } from "+infra/bootstrap";
import { SupportedLanguages } from "./modules/supported-languages";

export function createServer({ Env, Adapters, Tools }: BootstrapType) {
  const deps = { ...Adapters.System, ...Tools };

  const HashContent = new bg.HashContentSha256BunStrategy();
  const CacheRepository = new bg.CacheRepositoryNodeCacheAdapter({ type: "infinite" });
  const CacheResolver = new bg.CacheResolverSimpleStrategy({ CacheRepository });

  const origin = ["http://localhost:3000", "https://journal.bgord.dev"];

  const server = new Hono<infra.Config>()
    .basePath("/api")
    .use(
      ...bg.Setup.essentials(
        {
          csrf: { origin },
          cors: { origin },
          httpLogger: { skip: ["/api/translations", "/api/profile-avatar/get", "/api/auth/get-session"] },
        },
        { ...Adapters.System, ...Tools, HashContent, CacheResolver },
      ),
    )
    .use(Tools.ShieldSecurity.verify);

  // Healthcheck =================
  server.get(
    "/healthcheck",
    Tools.ShieldRateLimit.verify,
    Tools.ShieldTimeout.verify,
    Tools.ShieldBasicAuth.verify,
    ...bg.Healthcheck.build(Env.type, Tools.Prerequisites, { ...Adapters.System, ...Tools }),
  );
  // =============================

  // Emotions ====================
  const entry = new Hono();

  entry.use("*", Tools.Auth.ShieldAuth.attach, Tools.Auth.ShieldAuth.verify);
  entry.post("/log", HTTP.Emotions.LogEntry(deps));
  entry.post("/time-capsule-entry/schedule", HTTP.Emotions.ScheduleTimeCapsuleEntry(deps));
  entry.post("/:entryId/reappraise-emotion", HTTP.Emotions.ReappraiseEmotion(deps));
  entry.post("/:entryId/evaluate-reaction", HTTP.Emotions.EvaluateReaction(deps));
  entry.delete("/:entryId/delete", HTTP.Emotions.DeleteEntry(deps));
  entry.get(
    "/export-data",
    Tools.ShieldRateLimit.verify,
    HTTP.Emotions.ExportData({ ...deps, ...Adapters.Emotions }),
  );
  entry.get(
    "/export-entries",
    Tools.ShieldRateLimit.verify,
    HTTP.Emotions.ExportEntries({ ...deps, ...Adapters.Emotions }),
  );
  entry.get("/list", HTTP.Emotions.ListEntries({ ...deps, ...Adapters.Emotions }));
  server.route("/entry", entry);
  // =============================

  // Shared ======================
  server.get(
    "/shared/entries/:shareableLinkId",
    HTTP.Emotions.GetSharedEntries({
      ...deps,
      ShareableLinkAccessOHQ: Adapters.Publishing.ShareableLinkAccessOHQ,
      EntriesSharing: Adapters.Emotions.EntriesSharingOHQ,
    }),
  );

  // Weekly review ===============
  const weeklyReview = new Hono();

  weeklyReview.use("*", Tools.Auth.ShieldAuth.attach, Tools.Auth.ShieldAuth.verify);
  weeklyReview.post(
    "/:weeklyReviewId/export/email",
    Tools.ShieldRateLimit.verify,
    HTTP.Emotions.ExportWeeklyReviewByEmail(deps),
  );
  weeklyReview.get(
    "/:weeklyReviewId/export/download",
    Tools.ShieldRateLimit.verify,
    HTTP.Emotions.DownloadWeeklyReview({ ...Adapters.System, ...Adapters.Emotions }),
  );
  server.route("/weekly-review", weeklyReview);
  // =============================

  // Publishing ==================
  const publishing = new Hono();

  publishing.use("*", Tools.Auth.ShieldAuth.attach, Tools.Auth.ShieldAuth.verify);
  publishing.get(
    "/links/list",
    HTTP.Publishing.ListShareableLinks({ ...Adapters.System, ...Adapters.Publishing }),
  );
  publishing.post("/link/create", Tools.ShieldRateLimit.verify, HTTP.Publishing.CreateShareableLink(deps));
  publishing.post("/link/:shareableLinkId/revoke", HTTP.Publishing.RevokeShareableLink(deps));
  publishing.post("/link/:shareableLinkId/hide", HTTP.Publishing.HideShareableLink());
  server.route("/publishing", publishing);
  // =============================

  //Translations =================
  server.get(
    "/translations",
    Tools.CacheResponse.handle,
    ...bg.Translations.build(SupportedLanguages, Adapters.System),
  );
  // =============================

  //Preferences =================
  server.post(
    "/preferences/user-language/update",
    Tools.Auth.ShieldAuth.attach,
    Tools.Auth.ShieldAuth.verify,
    HTTP.Preferences.UpdateUserLanguage(deps),
  );
  server.post(
    "/preferences/profile-avatar/update",
    Tools.Auth.ShieldAuth.attach,
    Tools.Auth.ShieldAuth.verify,
    ...bg.FileUploader.validate({
      mimeTypes: Preferences.VO.ProfileAvatarMimeTypes,
      maxFilesSize: Preferences.VO.ProfileAvatarMaxSize,
    }),
    HTTP.Preferences.UpdateProfileAvatar(deps),
  );
  server.get(
    "/profile-avatar/get",
    Tools.Auth.ShieldAuth.attach,
    Tools.Auth.ShieldAuth.verify,
    HTTP.Preferences.GetProfileAvatar(Adapters.System),
  );
  server.delete(
    "/preferences/profile-avatar",
    Tools.Auth.ShieldAuth.attach,
    Tools.Auth.ShieldAuth.verify,
    HTTP.Preferences.RemoveProfileAvatar(deps),
  );
  // =============================

  // AI ==========================
  server.get(
    "/ai-usage-today/get",
    Tools.Auth.ShieldAuth.attach,
    Tools.Auth.ShieldAuth.verify,
    HTTP.AI.GetAiUsageToday({ ...Adapters.System, ...Adapters.AI }),
  );
  // =============================

  // History =====================
  server.get(
    "/history/:subject/list",
    Tools.Auth.ShieldAuth.attach,
    Tools.Auth.ShieldAuth.verify,
    HTTP.History.HistoryList({ ...Adapters.System, HistoryReader: Adapters.History.HistoryReader }),
  );
  // =============================

  // Dashboard ===================
  server.get(
    "/dashboard/get",
    Tools.Auth.ShieldAuth.attach,
    Tools.Auth.ShieldAuth.verify,
    HTTP.GetDashboard({ ...Adapters.System, ...Adapters.Emotions }),
  );
  // =============================

  // Auth ========================
  server.on(["POST", "GET"], "/auth/*", async (c) => {
    const response = await Tools.Auth.config.handler(c.req.raw);

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
