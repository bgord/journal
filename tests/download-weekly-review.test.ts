import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/weekly-review/${mocks.weeklyReviewId}/export/download`;

describe(`GET ${url}`, async () => {
  const di = await bootstrap(mocks.Env);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("validation - incorrect id", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

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
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(di.Adapters.Emotions.WeeklyReviewExport, "getFull").mockResolvedValue(undefined);

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    await testcases.assertInvariantError(response, Emotions.Invariants.WeeklyReviewExists);
  });

  test("validation - WeeklyReviewExists - repo failure", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(di.Adapters.Emotions.WeeklyReviewExport, "getFull").mockRejectedValue(new Error("Failure"));

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    expect(response.status).toEqual(500);
  });

  test("validation - WeeklyReviewIsCompleted", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(di.Adapters.Emotions.WeeklyReviewExport, "getFull").mockResolvedValue(
      // @ts-expect-error
      mocks.weeklyReviewSkipped,
    );

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    await testcases.assertInvariantError(response, Emotions.Invariants.WeeklyReviewIsCompleted);
  });

  test("validation - RequesterOwnsWeeklyReview", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    spyOn(di.Adapters.Emotions.WeeklyReviewExport, "getFull").mockResolvedValue(mocks.weeklyReviewFull);

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    await testcases.assertInvariantError(response, Emotions.Invariants.RequesterOwnsWeeklyReview);
  });

  test("happy path", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.weeklyReviewExportId]);
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(di.Adapters.Emotions.WeeklyReviewExport, "getFull").mockResolvedValue(mocks.weeklyReviewFull);
    spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate() as any);

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

    const file = Buffer.from(await response.arrayBuffer());
    expect(file).toEqual(mocks.PDF);
  });
});
