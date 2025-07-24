import { z } from "zod/v4";

import { PatternNameOption } from "./pattern-name-option";

export const PatternName = z.enum(PatternNameOption);
