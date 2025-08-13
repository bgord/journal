import { z } from "zod/v4";
import { AlarmNameOption } from "./alarm-name-option";

export const AlarmName = z.enum(AlarmNameOption);

export type AlarmNameType = z.infer<typeof AlarmName>;
