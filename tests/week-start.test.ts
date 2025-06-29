import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import { WeekStart } from "../modules/emotions/value-objects/week-start";

describe("WeekStart", () => {
  test("fromTimestamp", () => {
    const now = 1751142498768;
    expect(WeekStart.fromTimestamp(now).get()).toEqual(tools.Timestamp.parse(1750636800000));
  });
});
