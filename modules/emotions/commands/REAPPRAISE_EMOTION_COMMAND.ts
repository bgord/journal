import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as Entities from "+emotions/entities";
import * as VO from "+emotions/value-objects";

// Stryker disable all
export const REAPPRAISE_EMOTION_COMMAND = "REAPPRAISE_EMOTION_COMMAND";
// Stryker restore all

export const ReappraiseEmotionCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(REAPPRAISE_EMOTION_COMMAND),
  revision: v.instance(tools.Revision),
  payload: v.object({
    entryId: VO.EntryId,
    newEmotion: v.instance(Entities.Emotion),
    userId: Auth.VO.UserId,
  }),
});

export type ReappraiseEmotionCommandType = v.InferOutput<typeof ReappraiseEmotionCommand>;
