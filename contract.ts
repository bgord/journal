import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {ReactionDescriptionSchema} from "./modules/emotions/value-objects/reaction-description";
import {ReactionTypeSchema} from "./modules/emotions/value-objects/reaction-type";

const c = initContract();

const headers = z.object({ cookie: z.string(), "if-match": z.string() });

const emotions = c.router({
  deleteEntry: {
    method: "DELETE",
    path: "/entry/:entryId/delete",
    pathParams: z.object({ entryId: z.string() }),
    headers,
    responses: { 204: c.type<null>() },
  },
  evaluateReaction: {
    method: "POST",
    path: "/entry/:entryId/evaluate-reaction",
    pathParams: z.object({ entryId: z.string() }),
    body: z.object({
      description: ReactionDescriptionSchema,
      type: ReactionTypeSchema
      effectiveness: z.coerce.number(),
    }),
    headers,
    responses: { 204: c.type<null>() },
  },
});

export const contract = c.router({ emotions });
