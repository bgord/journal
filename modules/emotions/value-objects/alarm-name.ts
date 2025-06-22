import { z } from "zod/v4";

export const AlarmName = z.string().min(1);
export type AlarmNameType = z.infer<typeof AlarmName>;
