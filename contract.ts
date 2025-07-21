import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const emotionsContract = c.router({
  deleteEntry: {
    method: "DELETE",
    path: "/entry/:entryId/delete",
    pathParams: z.object({ entryId: z.string() }),
    responses: { 204: c.type<null>() },
  },
});

export const appContract = c.router({
  emotions: emotionsContract,
});
