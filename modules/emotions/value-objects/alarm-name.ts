import * as v from "valibot";
import { AlarmNameOption } from "./alarm-name-option";

export const AlarmName = v.enum(AlarmNameOption);

export type AlarmNameType = v.InferOutput<typeof AlarmName>;
