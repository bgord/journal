import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+publishing/value-objects";

// Stryker disable next-line StringLiteral
export const CREATE_SHAREABLE_LINK_COMMAND = "CREATE_SHAREABLE_LINK_COMMAND";

export const CreateShareableLinkCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(CREATE_SHAREABLE_LINK_COMMAND),
  payload: v.object({
    shareableLinkId: VO.ShareableLinkId,
    requesterId: Auth.VO.UserId,
    publicationSpecification: VO.PublicationSpecification,
    dateRange: v.instance(tools.DateRange),
    durationMs: tools.DurationMs,
  }),
});

export type CreateShareableLinkCommandType = v.InferOutput<typeof CreateShareableLinkCommand>;
