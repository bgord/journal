import * as Emotions from "+emotions";
import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class ReactionForEvaluationExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ReactionForEvaluationExistsError.prototype);
  }
}

type ReactionForEvaluationExistsConfigType = { reaction?: Emotions.Entities.Reaction };

class ReactionForEvaluationExistsFactory extends bg.Policy<ReactionForEvaluationExistsConfigType> {
  fails(config: ReactionForEvaluationExistsConfigType) {
    return config.reaction === undefined;
  }

  message = "reaction.for.evaluation.exists.error";

  error = ReactionForEvaluationExistsError;

  code = 400 as ContentfulStatusCode;
}

export const ReactionForEvaluationExists = new ReactionForEvaluationExistsFactory();
