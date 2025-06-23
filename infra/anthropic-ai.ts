import Anthropic from "@anthropic-ai/sdk";
import { Env } from "./env";

export const AnthropicAI = new Anthropic({ apiKey: Env.ANTHROPIC_AI_API_KEY });
