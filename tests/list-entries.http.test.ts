import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/entry/list";
const today = tools.Day.fromTimestamp(mocks.T0);
const lastWeekStart = today.getEnd().subtract(tools.Duration.Weeks(1));
const lastMonthStart = today.getEnd().subtract(tools.Duration.Days(30));
const lastWeek = new tools.DateRange(lastWeekStart, today.getEnd());
const lastMonth = new tools.DateRange(lastMonthStart, today.getEnd());
const allTime = new tools.DateRange(tools.Timestamp.fromNumber(0), today.getEnd());
const emptyQuery = "";
const limit = tools.Int.positive(20);

describe(`QUERY ${url}`, async () => {
  const di = await bootstrap();
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "QUERY", body: JSON.stringify({}) }, mocks.ip);
    await testcases.assertAuthResponse(response);
  });

  test("validation - incorrect cursor", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "QUERY", body: JSON.stringify({ cursor: "abc" }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "entry.list.cursor.invalid" });
  });

  test("validation - incorrect cursor startedAt", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "QUERY", body: JSON.stringify({ cursor: { startedAt: "abc", id: mocks.entryId } }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "timestamp.type" });
  });

  test("validation - incorrect cursor id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "QUERY", body: JSON.stringify({ cursor: { startedAt: mocks.T0.ms, id: "abc" } }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type" });
  });

  test("happy path - default - last_week", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using entrySnapshot = spyOn(di.Adapters.Emotions.EntrySnapshot, "getFormatted").mockResolvedValue(
      mocks.entryList,
    );

    const response = await server.request(url, { method: "QUERY", body: JSON.stringify({}) }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      data: { entries: [mocks.fullEntryWithAlarmsFormatted], next: null },
      count: 1,
    });
    expect(entrySnapshot).toHaveBeenCalledWith(mocks.user.id, lastWeek, emptyQuery, {
      cursor: undefined,
      limit,
    });
  });

  test("happy path - today", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using entrySnapshot = spyOn(di.Adapters.Emotions.EntrySnapshot, "getFormatted").mockResolvedValue(
      mocks.entryList,
    );

    const response = await server.request(
      url,
      {
        method: "QUERY",
        body: JSON.stringify({ filter: Emotions.VO.EntryListFilterOptions.today }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      data: { entries: [mocks.fullEntryWithAlarmsFormatted], next: null },
      count: 1,
    });
    expect(entrySnapshot).toHaveBeenCalledWith(mocks.user.id, today, emptyQuery, {
      cursor: undefined,
      limit,
    });
  });

  test("happy path - last_month", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using entrySnapshot = spyOn(di.Adapters.Emotions.EntrySnapshot, "getFormatted").mockResolvedValue(
      mocks.entryList,
    );

    const response = await server.request(
      url,
      {
        method: "QUERY",
        body: JSON.stringify({ filter: Emotions.VO.EntryListFilterOptions.last_month }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      data: { entries: [mocks.fullEntryWithAlarmsFormatted], next: null },
      count: 1,
    });
    expect(entrySnapshot).toHaveBeenCalledWith(mocks.user.id, lastMonth, emptyQuery, {
      cursor: undefined,
      limit,
    });
  });

  test("happy path - all_time", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using entrySnapshot = spyOn(di.Adapters.Emotions.EntrySnapshot, "getFormatted").mockResolvedValue(
      mocks.entryList,
    );

    const response = await server.request(
      url,
      {
        method: "QUERY",
        body: JSON.stringify({ filter: Emotions.VO.EntryListFilterOptions.all_time, query: "abc" }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      data: { entries: [mocks.fullEntryWithAlarmsFormatted], next: null },
      count: 1,
    });
    expect(entrySnapshot).toHaveBeenCalledWith(mocks.user.id, allTime, "abc", {
      cursor: undefined,
      limit,
    });
  });

  test("happy path - cursor", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using entrySnapshot = spyOn(di.Adapters.Emotions.EntrySnapshot, "getFormatted").mockResolvedValue({
      data: { entries: [mocks.fullEntryWithAlarms], next: mocks.entryListCursor },
      count: tools.Int.nonNegative(21),
    });

    const response = await server.request(
      url,
      { method: "QUERY", body: JSON.stringify({ cursor: mocks.entryListCursor }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      data: { entries: [mocks.fullEntryWithAlarmsFormatted], next: mocks.entryListCursor },
      count: 21,
    });
    expect(entrySnapshot).toHaveBeenCalledWith(mocks.user.id, lastWeek, emptyQuery, {
      cursor: mocks.entryListCursor,
      limit,
    });
  });
});
