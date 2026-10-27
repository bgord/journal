import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Emotions from "+emotions";
import * as mocks from "./mocks";

describe("EntryListCursor", () => {
  test("happy path", () => {
    expect(
      v.safeParse(Emotions.VO.EntryListCursor, { startedAt: mocks.T0.ms, id: mocks.entryId }).success,
    ).toEqual(true);
  });

  test("rejects non-object", () => {
    expect(() => v.parse(Emotions.VO.EntryListCursor, "cursor")).toThrow("entry.list.cursor.invalid");
  });

  test("rejects missing startedAt", () => {
    expect(() => v.parse(Emotions.VO.EntryListCursor, { id: mocks.entryId })).toThrow(
      "entry.list.cursor.invalid",
    );
  });

  test("rejects missing id", () => {
    expect(() => v.parse(Emotions.VO.EntryListCursor, { startedAt: mocks.T0.ms })).toThrow(
      "entry.list.cursor.invalid",
    );
  });

  test("rejects invalid startedAt", () => {
    expect(() =>
      v.parse(Emotions.VO.EntryListCursor, { startedAt: "2025-01-01", id: mocks.entryId }),
    ).toThrow("timestamp.type");
  });

  test("rejects invalid id", () => {
    expect(() => v.parse(Emotions.VO.EntryListCursor, { startedAt: mocks.T0.ms, id: "invalid" })).toThrow(
      "uuid.type",
    );
  });
});
