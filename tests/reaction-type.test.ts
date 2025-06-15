import { describe, expect, test } from "bun:test";

import {
  GrossEmotionRegulationStrategy,
  ReactionType,
} from "../modules/emotions/value-objects/reaction-type";

describe("ReactionType", () => {
  test("constructor - creates all correct emotion regulation strategy", () => {
    const options = Object.keys(GrossEmotionRegulationStrategy);

    options.forEach((option) =>
      // @ts-expect-error
      expect(new ReactionType(option).get()).toEqual(option),
    );
  });

  test("constructor - throws on unknown emotion regulation strategy", () => {
    // @ts-expect-error
    expect(() => new ReactionType("something_else")).toThrow(ReactionType.Errors.invalid);
  });

  test("isAdaptive - true", () => {
    [
      GrossEmotionRegulationStrategy.reappraisal,
      GrossEmotionRegulationStrategy.expression,
      GrossEmotionRegulationStrategy.acceptance,
      GrossEmotionRegulationStrategy.problem_solving,
      GrossEmotionRegulationStrategy.humor,
    ].forEach((strategy) => expect(new ReactionType(strategy).isAdaptive()).toEqual(true));
  });

  test("isAdaptive - false", () => {
    [
      GrossEmotionRegulationStrategy.avoidance,
      GrossEmotionRegulationStrategy.confrontation,
      GrossEmotionRegulationStrategy.distraction,
      GrossEmotionRegulationStrategy.rumination,
      GrossEmotionRegulationStrategy.suppression,
    ].forEach((strategy) => expect(new ReactionType(strategy).isAdaptive()).toEqual(false));
  });

  test("isMaladaptive - true", () => {
    [
      GrossEmotionRegulationStrategy.avoidance,
      GrossEmotionRegulationStrategy.rumination,
      GrossEmotionRegulationStrategy.suppression,
    ].forEach((strategy) => expect(new ReactionType(strategy).isMaladaptive()).toEqual(true));
  });

  test("isMaladaptive - false", () => {
    [
      GrossEmotionRegulationStrategy.confrontation,
      GrossEmotionRegulationStrategy.distraction,
      GrossEmotionRegulationStrategy.reappraisal,
      GrossEmotionRegulationStrategy.expression,
      GrossEmotionRegulationStrategy.acceptance,
      GrossEmotionRegulationStrategy.humor,
      GrossEmotionRegulationStrategy.problem_solving,
    ].forEach((strategy) => expect(new ReactionType(strategy).isMaladaptive()).toEqual(false));
  });

  test("isContextual - true", () => {
    [GrossEmotionRegulationStrategy.confrontation, GrossEmotionRegulationStrategy.distraction].forEach(
      (strategy) => expect(new ReactionType(strategy).isContextual()).toEqual(true),
    );
  });

  test("isContextual - false", () => {
    [
      GrossEmotionRegulationStrategy.avoidance,
      GrossEmotionRegulationStrategy.rumination,
      GrossEmotionRegulationStrategy.reappraisal,
      GrossEmotionRegulationStrategy.suppression,
      GrossEmotionRegulationStrategy.expression,
      GrossEmotionRegulationStrategy.acceptance,
      GrossEmotionRegulationStrategy.humor,
      GrossEmotionRegulationStrategy.problem_solving,
    ].forEach((strategy) => expect(new ReactionType(strategy).isContextual()).toEqual(false));
  });

  test("compare - true", () => {
    const acceptance = new ReactionType(GrossEmotionRegulationStrategy.acceptance);
    const anotherAcceptance = new ReactionType(GrossEmotionRegulationStrategy.acceptance);

    expect(acceptance.equals(anotherAcceptance)).toEqual(true);
  });

  test("compare - false", () => {
    const acceptance = new ReactionType(GrossEmotionRegulationStrategy.acceptance);
    const avoidance = new ReactionType(GrossEmotionRegulationStrategy.avoidance);

    expect(acceptance.equals(avoidance)).toEqual(false);
  });

  test("all - returns all options", () => {
    // @ts-expect-error
    expect(ReactionType.all()).toEqual(Object.keys(GrossEmotionRegulationStrategy));
  });

  test("toString", () => {
    expect(new ReactionType(GrossEmotionRegulationStrategy.acceptance).toString()).toEqual(
      GrossEmotionRegulationStrategy.acceptance,
    );
  });

  test("toJSON", () => {
    expect(new ReactionType(GrossEmotionRegulationStrategy.acceptance).toJSON()).toEqual(
      GrossEmotionRegulationStrategy.acceptance,
    );
  });
});
