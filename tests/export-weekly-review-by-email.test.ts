import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { auth } from "../infra/auth";
import * as Emotions from "../modules/emotions";
import { server } from "../server";
import * as mocks from "./mocks";

const url = `/weekly-review/${mocks.weeklyReviewId}/export/email`;

describe(`POST ${url}`, () => {
  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toBe(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("validation - incorrect id", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request("/weekly-review/id/export/email", { method: "POST" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - WeeklyReviewExists - no weekly review", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Emotions.Repos.WeeklyReviewRepository, "getById").mockResolvedValue(undefined);
    const response = await server.request(url, { method: "POST" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(Emotions.Policies.WeeklyReviewExists.code);
    expect(json).toEqual({ message: Emotions.Policies.WeeklyReviewExists.message, _known: true });
  });

  test("validation - WeeklyReviewExists - repo failure", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Emotions.Repos.WeeklyReviewRepository, "getById").mockImplementation(() => {
      throw new Error("Failure");
    });
    const response = await server.request(url, { method: "POST" }, mocks.ip);

    expect(response.status).toBe(500);
  });

  test("validation - WeeklyReviewIsCompleted", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Emotions.Repos.WeeklyReviewRepository, "getById").mockResolvedValue(mocks.weeklyReviewSkipped);
    const response = await server.request(url, { method: "POST" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(Emotions.Policies.WeeklyReviewIsCompleted.code);
    expect(json).toEqual({ message: Emotions.Policies.WeeklyReviewIsCompleted.message, _known: true });
  });

  test("validation - RequesterOwnsWeeklyReview", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    spyOn(Emotions.Repos.WeeklyReviewRepository, "getById").mockResolvedValue(mocks.weeklyReview);
    const response = await server.request(url, { method: "POST" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(Emotions.Policies.RequesterOwnsWeeklyReview.code);
    expect(json).toEqual({ message: Emotions.Policies.RequesterOwnsWeeklyReview.message, _known: true });
  });

  test("happy path", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Emotions.Repos.WeeklyReviewRepository, "getById").mockResolvedValue(mocks.weeklyReview);
    const response = await server.request(url, { method: "POST" }, mocks.ip);

    expect(response.status).toBe(200);
  });
});
