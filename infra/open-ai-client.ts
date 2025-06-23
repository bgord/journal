import OpenAI from "openai";

import { Env } from "./env";

export const AiClient = new OpenAI({ apiKey: Env.OPEN_AI_API_KEY });
