import OAI from "openai";

import { Env } from "./env";

export const OpenAI = new OAI({ apiKey: Env.OPEN_AI_API_KEY });
