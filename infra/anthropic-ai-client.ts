import Anthropic from "@anthropic-ai/sdk";
import { AiClient, AiClientResponseType } from "../modules/emotions/services/ai-client";
import { EmotionalAdvicePromptType } from "../modules/emotions/services/emotional-advice-prompt";
import { Env } from "./env";

const ai = new Anthropic({ apiKey: Env.ANTHROPIC_AI_API_KEY });

export class AnthropicAiClient implements AiClient {
  async request(prompt: EmotionalAdvicePromptType): Promise<AiClientResponseType> {
    const message = await ai.messages.create({
      max_tokens: 1024,
      messages: [prompt[1]],
      system: prompt[0].content,
      model: "claude-3-5-sonnet-latest",
    });

    return message.content.toString();
  }
}
