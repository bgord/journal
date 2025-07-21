import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const emotionsContract = c.router({
  deleteEntry: {
    method: "DELETE",
    path: "/entry/:entryId/delete",
    pathParams: z.object({ entryId: z.uuid() }),
    responses: { 204: c.type<null>() },
  },
});
