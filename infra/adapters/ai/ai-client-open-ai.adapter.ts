import OAI from "openai";
import * as AI from "+ai";

export class AiClientOpenAiAdapter implements AI.AiClientPort {
  readonly OpenAI: OAI;

  constructor(OPEN_AI_API_KEY: string) {
    this.OpenAI = new OAI({ apiKey: OPEN_AI_API_KEY });
  }

  async request(prompt: AI.Prompt) {
    const response = await this.OpenAI.responses.create({
      model: "gpt-4o",
      instructions: prompt.read()[0].content,
      input: prompt.read()[1].content,
      max_output_tokens: AI.AiClientPort.maxLength,
    });

    return new AI.Advice(response.output_text);
  }
}
