import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { auth } from "../infra/auth";
import * as Emotions from "../modules/emotions";
import { server } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/weekly-review/${mocks.weeklyReviewId}/export/download`;

describe(`GET ${url}`, () => {
  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toBe(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("validation - incorrect id", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request("/weekly-review/id/export/download", { method: "GET" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - WeeklyReviewExists - no weekly review", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Emotions.Repos.WeeklyReviewRepository, "getById").mockResolvedValue(undefined);
    spyOn(Emotions.Repos.EntryRepository, "findInWeekForUser").mockResolvedValue([]);
    spyOn(Emotions.Repos.PatternsRepository, "findInWeekForUser").mockResolvedValue([]);
    spyOn(Emotions.Repos.AlarmRepository, "findInWeekForUser").mockResolvedValue([]);

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    await testcases.assertPolicyError(response, Emotions.Policies.WeeklyReviewExists);
  });

  test("validation - WeeklyReviewExists - repo failure", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Emotions.Repos.WeeklyReviewRepository, "getById").mockImplementation(() => {
      throw new Error("Failure");
    });
    spyOn(Emotions.Repos.EntryRepository, "findInWeekForUser").mockResolvedValue([]);
    spyOn(Emotions.Repos.PatternsRepository, "findInWeekForUser").mockResolvedValue([]);
    spyOn(Emotions.Repos.AlarmRepository, "findInWeekForUser").mockResolvedValue([]);
    const response = await server.request(url, { method: "GET" }, mocks.ip);

    expect(response.status).toBe(500);
  });

  test("validation - WeeklyReviewIsCompleted", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Emotions.Repos.WeeklyReviewRepository, "getById").mockResolvedValue(mocks.weeklyReviewSkipped);
    spyOn(Emotions.Repos.EntryRepository, "findInWeekForUser").mockResolvedValue([]);
    spyOn(Emotions.Repos.PatternsRepository, "findInWeekForUser").mockResolvedValue([]);
    spyOn(Emotions.Repos.AlarmRepository, "findInWeekForUser").mockResolvedValue([]);
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    await testcases.assertPolicyError(response, Emotions.Policies.WeeklyReviewIsCompleted);
  });

  test("validation - RequesterOwnsWeeklyReview", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    spyOn(Emotions.Repos.WeeklyReviewRepository, "getById").mockResolvedValue(mocks.weeklyReview);
    spyOn(Emotions.Repos.EntryRepository, "findInWeekForUser").mockResolvedValue([]);
    spyOn(Emotions.Repos.PatternsRepository, "findInWeekForUser").mockResolvedValue([]);
    spyOn(Emotions.Repos.AlarmRepository, "findInWeekForUser").mockResolvedValue([]);
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    await testcases.assertPolicyError(response, Emotions.Policies.RequesterOwnsWeeklyReview);
  });

  test("happy path", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Emotions.Repos.WeeklyReviewRepository, "getById").mockResolvedValue(mocks.weeklyReview);
    spyOn(Emotions.Repos.EntryRepository, "findInWeekForUser").mockResolvedValue([]);
    spyOn(Emotions.Repos.PatternsRepository, "findInWeekForUser").mockResolvedValue([]);
    spyOn(Emotions.Repos.AlarmRepository, "findInWeekForUser").mockResolvedValue([]);
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.weeklyReviewExportId);

    const response = await server.request(
      url,
      { method: "GET", headers: new Headers({ "x-correlation-id": mocks.correlationId }) },
      mocks.ip,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toEqual("application/pdf");
    expect(response.headers.get("Content-Disposition")).toEqual(
      `attachment; filename="weekly-review-export-${mocks.week.toIsoId()}.pdf"`,
    );

    const file = Buffer.from(await response.arrayBuffer());

    expect(file).toEqual(mocks.PDF);
  });
});
