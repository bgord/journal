import * as Auth from "+auth";
import * as VO from "+publishing/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const CREATE_SHAREABLE_LINK_COMMAND = "CREATE_SHAREABLE_LINK_COMMAND";

export const CreateShareableLinkCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(CREATE_SHAREABLE_LINK_COMMAND),
  revision: z.instanceof(tools.Revision),
  payload: z.object({
    shareableLinkId: VO.ShareableLinkId,
    requesterId: Auth.VO.UserId,
    publicationSpecification: VO.PublicationSpecification,
    dateRange: z.instanceof(tools.DateRange),
    duration: z.instanceof(tools.TimeResult),
  }),
});

export type CreateShareableLinkCommandType = z.infer<typeof CreateShareableLinkCommand>;
