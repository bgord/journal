import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import * as Adapters from "+infra/adapters";
import { EventStore } from "+infra/event-store";
import { auth } from "../infra/auth";
import { server } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/weekly-review/${mocks.weeklyReviewId}/export/email`;

describe(`POST ${url}`, () => {
  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toBe(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("validation - incorrect id", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request("/api/weekly-review/id/export/email", { method: "POST" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - WeeklyReviewExists - no weekly review", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Adapters.Emotions.WeeklyReviewSnapshot, "getById").mockResolvedValue(null);
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    await testcases.assertInvariantError(response, Emotions.Invariants.WeeklyReviewExists);
  });

  test("validation - WeeklyReviewExists - repo failure", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Adapters.Emotions.WeeklyReviewSnapshot, "getById").mockRejectedValue(new Error("Failure"));
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    expect(response.status).toBe(500);
  });

  test("validation - WeeklyReviewIsCompleted", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Adapters.Emotions.WeeklyReviewSnapshot, "getById").mockResolvedValue(mocks.weeklyReviewSkipped);
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    await testcases.assertInvariantError(response, Emotions.Invariants.WeeklyReviewIsCompleted);
  });

  test("validation - RequesterOwnsWeeklyReview", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    spyOn(Adapters.Emotions.WeeklyReviewSnapshot, "getById").mockResolvedValue(mocks.weeklyReview);
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    await testcases.assertInvariantError(response, Emotions.Invariants.RequesterOwnsWeeklyReview);
  });

  test("happy path", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.weeklyReviewExportId]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Adapters.Emotions.WeeklyReviewSnapshot, "getById").mockResolvedValue(mocks.weeklyReview);
    spyOn(Adapters.IdProvider, "generate").mockReturnValue(ids.generate() as any);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.correlationIdHeaders },
      mocks.ip,
    );
    expect(response.status).toBe(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailRequestedEvent]);
  });
});
