import { z } from "zod/v4";

export const UserId = z.uuid();

export type UserIdType = z.infer<typeof UserId>;
