import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";

const url = "/api/entry/list";

const today = tools.Day.fromTimestamp(mocks.T0);

const lastWeekStart = today.getEnd().subtract(tools.Duration.Weeks(1));
const lastMonthStart = today.getEnd().subtract(tools.Duration.Days(30));

const lastWeek = new tools.DateRange(lastWeekStart, today.getEnd());
const lastMonth = new tools.DateRange(lastMonthStart, today.getEnd());
const allTime = new tools.DateRange(tools.Timestamp.fromNumber(0), today.getEnd());

const emptyQuery = "";

describe(`GET ${url}`, async () => {
  const di = await bootstrap(mocks.Env);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("happy path - default - last_week", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    const entrySnapshot = spyOn(di.Adapters.Emotions.EntrySnapshot, "getFormatted").mockResolvedValue([
      mocks.fullEntryWithAlarms,
    ]);

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual([mocks.fullEntryWithAlarmsFormatted]);
    expect(entrySnapshot).toHaveBeenCalledWith(mocks.user.id, lastWeek, emptyQuery);
  });

  test("happy path - today", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    const entrySnapshot = spyOn(di.Adapters.Emotions.EntrySnapshot, "getFormatted").mockResolvedValue([
      mocks.fullEntryWithAlarms,
    ]);

    const response = await server.request(
      `${url}?filter=${Emotions.VO.EntryListFilterOptions.today}`,
      { method: "GET" },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual([mocks.fullEntryWithAlarmsFormatted]);
    expect(entrySnapshot).toHaveBeenCalledWith(mocks.user.id, today, emptyQuery);
  });

  test("happy path - last_month", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    const entrySnapshot = spyOn(di.Adapters.Emotions.EntrySnapshot, "getFormatted").mockResolvedValue([
      mocks.fullEntryWithAlarms,
    ]);

    const response = await server.request(
      `${url}?filter=${Emotions.VO.EntryListFilterOptions.last_month}`,
      { method: "GET" },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual([mocks.fullEntryWithAlarmsFormatted]);
    expect(entrySnapshot).toHaveBeenCalledWith(mocks.user.id, lastMonth, emptyQuery);
  });

  test("happy path - all_time", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    const entrySnapshot = spyOn(di.Adapters.Emotions.EntrySnapshot, "getFormatted").mockResolvedValue([
      mocks.fullEntryWithAlarms,
    ]);

    const response = await server.request(
      `${url}?filter=${Emotions.VO.EntryListFilterOptions.all_time}&query=abc`,
      { method: "GET" },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual([mocks.fullEntryWithAlarmsFormatted]);
    expect(entrySnapshot).toHaveBeenCalledWith(mocks.user.id, allTime, "abc");
  });
});
