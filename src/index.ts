import { Hono } from "hono";
import { logger } from "hono/logger";
import { streamText } from "hono/streaming";
import { CharadesAi } from "./CharadesAi";

const charadesAi = new CharadesAi();

const app = new Hono().basePath("/api");

app.use(logger());

app.post("/keywords", async (c) => {
  const body = await c.req.json();

  if (typeof body.userInput !== "string") {
    return c.text("Invalid input", 400);
  }
  return streamText(c, async (stream) => {
    const keywordGenerator = charadesAi.getKeywordsStream(body.userInput);
    for await (const keyword of keywordGenerator) {
      await stream.write(keyword);
    }
  });
});

app.get("/recommendations", async (c) => {
  return streamText(c, async (stream) => {
    for await (const recommendation of charadesAi.getRecommendationsStream()) {
      await stream.write(recommendation);
    }
  });
});

export default app;
