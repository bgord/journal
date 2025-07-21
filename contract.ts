import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const emotions = c.router({
  deleteEntry: {
    method: "DELETE",
    path: "/entry/:entryId/delete",
    pathParams: z.object({ entryId: z.string() }),
    headers: z.object({
      cookie: z.string(),
      "if-match": z.string(),
    }),
    responses: { 204: c.type<null>() },
  },
});

export const contract = c.router({ emotions });
