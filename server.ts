import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { Hono } from "hono";
import { HTTP } from "+app";
import type * as infra from "+infra";
import { languages } from "+languages";
import * as Preferences from "+preferences";
import type { BootstrapType } from "+infra/bootstrap";

export function createServer({ Env, Adapters, Tools }: BootstrapType) {
  const deps = { ...Adapters.System, ...Tools };

  const HashContent = new bg.HashContentSha256Strategy();
  const CacheRepository = new bg.CacheRepositoryNodeCacheAdapter({ type: "infinite" });
  const CacheResolver = new bg.CacheResolverSimpleStrategy({ CacheRepository });

  const origin = ["http://localhost:3000", "https://journal.bgord.dev"];

  const server = new Hono<infra.Config>()
    .basePath("/api")
    .use(
      ...bg.SetupHono.essentials(
        {
          csrf: { origin },
          cors: { origin },
          httpLogger: {
            skip: [
              "/api/translations",
              "/api/profile-avatar/get",
              "/api/auth/get-session",
              "/api/publishing",
              "/api/ai-usage",
            ],
          },
          I18n: { languages, strategies: [new bg.LanguageDetectorCookieStrategy("language")] },
        },
        { ...Adapters.System, ...Tools, HashContent, CacheResolver },
      ),
    )
    .use(Tools.ShieldSecurity.handle());

  // Healthcheck =================
  server.get(
    "/healthcheck",
    Tools.ShieldRateLimit.handle(),
    Tools.ShieldTimeout.handle(),
    Tools.ShieldBasicAuth.handle(),
    ...new bg.HealthcheckHonoHandler(
      { Env: Env.type, prerequisites: Tools.Prerequisites },
      { ...Adapters.System, ...Tools, LoggerStatsProvider: Adapters.System.Logger },
    ).handle(),
  );

  server.get("/ping", ...new bg.PingHonoHandler().handle());
  // =============================

  // SSE
  server.get(
    "/sse",
    Tools.Auth.ShieldAuth.attach,
    Tools.Auth.ShieldAuth.verify,
    ...new bg.SseConnectionHonoHandler(Tools.SseRegistry, { keepalive: tools.Duration.Seconds(10) }).handle(),
  );

  // Emotions ====================
  const entry = new Hono();

  entry.use("*", Tools.Auth.ShieldAuth.attach, Tools.Auth.ShieldAuth.verify);
  entry.post("/log", Tools.ShieldCaptcha.handle(), HTTP.Emotions.LogEntry(deps));
  entry.post(
    "/time-capsule-entry/schedule",
    Tools.ShieldCaptcha.handle(),
    HTTP.Emotions.ScheduleTimeCapsuleEntry(deps),
  );
  entry.post(
    "/:entryId/reappraise-emotion",
    Tools.ShieldCaptcha.handle(),
    HTTP.Emotions.ReappraiseEmotion(deps),
  );
  entry.post(
    "/:entryId/evaluate-reaction",
    Tools.ShieldCaptcha.handle(),
    HTTP.Emotions.EvaluateReaction(deps),
  );
  entry.delete("/:entryId/delete", Tools.ShieldCaptcha.handle(), HTTP.Emotions.DeleteEntry(deps));
  entry.get(
    "/export-data",
    Tools.ShieldRateLimit.handle(),
    HTTP.Emotions.ExportData({ ...deps, ...Adapters.Emotions }),
  );
  entry.get(
    "/export-entries",
    Tools.ShieldRateLimit.handle(),
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
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    HTTP.Emotions.ExportWeeklyReviewByEmail(deps),
  );
  weeklyReview.get(
    "/:weeklyReviewId/export/download",
    Tools.ShieldRateLimit.handle(),
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
  publishing.post(
    "/link/create",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    HTTP.Publishing.CreateShareableLink(deps),
  );
  publishing.post(
    "/link/:shareableLinkId/revoke",
    Tools.ShieldCaptcha.handle(),
    HTTP.Publishing.RevokeShareableLink(deps),
  );
  publishing.post(
    "/link/:shareableLinkId/hide",
    Tools.ShieldCaptcha.handle(),
    HTTP.Publishing.HideShareableLink(),
  );
  server.route("/publishing", publishing);
  // =============================

  //Translations =================
  server.get(
    "/translations",
    Tools.CacheResponse.handle(),
    ...new bg.TranslationsHonoHandler(languages, Adapters.System).handle(),
  );
  // =============================

  //Preferences =================
  server.post(
    "/preferences/user-language/update",
    Tools.Auth.ShieldAuth.attach,
    Tools.ShieldCaptcha.handle(),
    Tools.Auth.ShieldAuth.verify,
    HTTP.Preferences.UpdateUserLanguage(deps),
  );
  server.post(
    "/preferences/profile-avatar/update",
    Tools.Auth.ShieldAuth.attach,
    Tools.ShieldCaptcha.handle(),
    Tools.Auth.ShieldAuth.verify,
    new bg.FileUploaderHonoMiddleware({
      MimeRegistry: Preferences.VO.ProfileAvatarMimeRegistry,
      maxSize: Preferences.VO.ProfileAvatarMaxSize,
    }).handle(),
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
    Tools.ShieldCaptcha.handle(),
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
