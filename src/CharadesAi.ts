import { OpenAI } from "openai";

const OPENAI_MODEL = "gpt-3.5-turbo";

export class CharadesAi {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async *getRecommendationsStream() {
    const stream = await this.openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "user",
          content:
            "Give me a list of topic recommendations for a game of charades",
        },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      yield chunk.choices[0]?.delta?.content || "";
    }
  }
  async *getKeywordsStream(userInput: string) {
    const stream = await this.openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "user",
          content: `Create a list of keywords used for a game of charades. The keywords should be related to this topic: ${userInput}`,
        },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      yield chunk.choices[0]?.delta?.content || "";
    }
  }
}
