import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { EntrySnapshot } from "+infra/adapters/emotions";
import { auth } from "+infra/auth";
import { server } from "../server";
import * as mocks from "./mocks";

const url = "/api/entry/list";

const today = tools.Day.fromTimestamp(mocks.T0);

const endOfToday = today.getEnd();

const lastWeekStart = tools.Timestamp.parse(today.getEnd() - tools.Duration.Days(7).ms);
const lastMonthStart = tools.Timestamp.parse(today.getEnd() - tools.Duration.Days(30).ms);
const allTimeStart = tools.Timestamp.parse(0);

describe(`GET ${url}`, () => {
  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toBe(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("happy path - default - today", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const entrySnapshot = spyOn(EntrySnapshot, "getByDateRangeForUser").mockResolvedValue([mocks.fullEntry]);

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual([mocks.fullEntry]);
    expect(entrySnapshot).toHaveBeenCalledWith(mocks.user.id, today);
  });

  test("happy path - last_week", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const entrySnapshot = spyOn(EntrySnapshot, "getByDateRangeForUser").mockResolvedValue([mocks.fullEntry]);

    const response = await server.request(
      `${url}?filter=${Emotions.VO.EntryFilterOptions.last_week}`,
      { method: "GET" },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual([mocks.fullEntry]);
    expect(entrySnapshot).toHaveBeenCalledWith(mocks.user.id, new tools.DateRange(lastWeekStart, endOfToday));
  });

  test("happy path - last_month", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const entrySnapshot = spyOn(EntrySnapshot, "getByDateRangeForUser").mockResolvedValue([mocks.fullEntry]);

    const response = await server.request(
      `${url}?filter=${Emotions.VO.EntryFilterOptions.last_month}`,
      { method: "GET" },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual([mocks.fullEntry]);
    expect(entrySnapshot).toHaveBeenCalledWith(
      mocks.user.id,
      new tools.DateRange(lastMonthStart, endOfToday),
    );
  });

  test("happy path - all_time", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const entrySnapshot = spyOn(EntrySnapshot, "getByDateRangeForUser").mockResolvedValue([mocks.fullEntry]);

    const response = await server.request(
      `${url}?filter=${Emotions.VO.EntryFilterOptions.all_time}`,
      { method: "GET" },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual([mocks.fullEntry]);
    expect(entrySnapshot).toHaveBeenCalledWith(mocks.user.id, new tools.DateRange(allTimeStart, endOfToday));
  });
});
