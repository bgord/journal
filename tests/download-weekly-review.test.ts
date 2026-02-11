import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/weekly-review/${mocks.weeklyReviewId}/export/download`;

describe(`GET ${url}`, async () => {
  const di = await bootstrap();
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.ShieldAuthError.message, _known: true });
  });

  test("validation - incorrect id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      "/api/weekly-review/id/export/download",
      { method: "GET" },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - WeeklyReviewExists - no weekly review", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Emotions.WeeklyReviewExportQuery, "getFull").mockResolvedValue(undefined));

    const response = await server.request(url, { method: "GET" }, mocks.ip);

    await testcases.assertInvariantError(response, 404, "weekly.review.exists.error");
  });

  test("validation - WeeklyReviewExists - repo failure", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Emotions.WeeklyReviewExportQuery, "getFull").mockImplementation(
        mocks.throwIntentionalErrorAsync,
      ),
    );

    const response = await server.request(url, { method: "GET" }, mocks.ip);

    expect(response.status).toEqual(500);
  });

  test("validation - WeeklyReviewIsCompleted", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Emotions.WeeklyReviewExportQuery, "getFull").mockResolvedValue(
        // @ts-expect-error
        mocks.weeklyReviewSkipped,
      ),
    );

    const response = await server.request(url, { method: "GET" }, mocks.ip);

    await testcases.assertInvariantError(response, 400, "weekly.review.is.completed.error");
  });

  test("validation - RequesterOwnsWeeklyReview", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth));
    spies.use(
      spyOn(di.Adapters.Emotions.WeeklyReviewExportQuery, "getFull").mockResolvedValue(
        mocks.weeklyReviewFull,
      ),
    );

    const response = await server.request(url, { method: "GET" }, mocks.ip);

    await testcases.assertInvariantError(response, 403, "requester.owns.weekly.review.error");
  });

  test("validation - not found", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Emotions.WeeklyReviewExportQuery, "getFull").mockResolvedValue(undefined));

    const response = await server.request(
      url,
      { method: "GET", headers: mocks.correlationIdHeaders },
      mocks.ip,
    );

    expect(response.status).toEqual(404);
  });

  test("happy path", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.weeklyReviewExportId]);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Emotions.WeeklyReviewExportQuery, "getFull").mockResolvedValue(
        mocks.weeklyReviewFull,
      ),
    );
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate()));

    const response = await server.request(
      url,
      { method: "GET", headers: mocks.correlationIdHeaders },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(response.headers.get("Content-Type")).toEqual("application/pdf");
    expect(response.headers.get("Content-Disposition")).toEqual(
      `attachment; filename="weekly-review-export-${mocks.week.toIsoId()}.pdf"`,
    );

    expect(await response.arrayBuffer()).toEqual(mocks.PDF);
  });
});
