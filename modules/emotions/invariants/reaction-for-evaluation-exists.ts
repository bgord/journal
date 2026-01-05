import * as bg from "@bgord/bun";
import type * as Emotions from "+emotions";

class ReactionForEvaluationExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ReactionForEvaluationExistsError.prototype);
  }
}

type ReactionForEvaluationExistsConfigType = { reaction?: Emotions.Entities.Reaction };

class ReactionForEvaluationExistsFactory extends bg.Invariant<ReactionForEvaluationExistsConfigType> {
  passes(config: ReactionForEvaluationExistsConfigType) {
    if (!config.reaction) return false;
    return true;
  }

  message = "reaction.for.evaluation.exists.error";
  error = ReactionForEvaluationExistsError;
  kind = bg.InvariantFailureKind.precondition;
}

export const ReactionForEvaluationExists = new ReactionForEvaluationExistsFactory();
