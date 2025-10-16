import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+publishing/value-objects";

export const CREATE_SHAREABLE_LINK_COMMAND = "CREATE_SHAREABLE_LINK_COMMAND";

export const CreateShareableLinkCommand = z.object({
  ...bg.CommandEnvelopeSchema,
  name: z.literal(CREATE_SHAREABLE_LINK_COMMAND),
  payload: z.object({
    shareableLinkId: VO.ShareableLinkId,
    requesterId: Auth.VO.UserId,
    publicationSpecification: VO.PublicationSpecification,
    dateRange: z.instanceof(tools.DateRange),
    durationMs: tools.DurationMs,
  }),
});

export type CreateShareableLinkCommandType = z.infer<typeof CreateShareableLinkCommand>;
