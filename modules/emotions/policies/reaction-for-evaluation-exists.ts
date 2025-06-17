import * as bg from "@bgord/bun";

import * as Entities from "../entities";

class ReactionForEvaluationExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ReactionForEvaluationExistsError.prototype);
  }
}

type ReactionForEvaluationExistsConfigType = {
  reaction?: Entities.Reaction;
};

class ReactionForEvaluationExistsFactory extends bg.Policy<ReactionForEvaluationExistsConfigType> {
  fails(config: ReactionForEvaluationExistsConfigType) {
    return config.reaction === undefined;
  }

  message = "reaction.for.evaluation.exists.error";

  error = ReactionForEvaluationExistsError;
}

export const ReactionForEvaluationExists = new ReactionForEvaluationExistsFactory();
