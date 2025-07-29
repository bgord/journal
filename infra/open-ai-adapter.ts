import * as Ports from "+emotions/ports";
import * as VO from "+emotions/value-objects";
import { Env } from "+infra/env";
import OAI from "openai";

/** @public */
export const OpenAI = new OAI({ apiKey: Env.OPEN_AI_API_KEY });

export class OpenAiAdapter implements Ports.AiClientPort {
  async request(prompt: VO.Prompt): Promise<VO.Advice> {
    const response = await OpenAI.responses.create({
      model: "gpt-4o",
      instructions: prompt.read()[0].content,
      input: prompt.read()[1].content,
      max_output_tokens: Ports.AiClientPort.maxLength,
    });

    return new VO.Advice(response.output_text);
  }
}
