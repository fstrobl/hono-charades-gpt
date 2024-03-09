import { Hono } from "hono";
import { logger } from "hono/logger";
import { streamText } from "hono/streaming";
import { CharadesAi } from "./CharadesAi";

const charadesAi = new CharadesAi();

const app = new Hono().basePath("/api");

app.use(logger());

app.get("/recommendations", async (c) => {
  return streamText(c, async (stream) => {
    for await (const recommendation of charadesAi.getRecommendationsStream()) {
      await stream.write(recommendation);
    }
  });
});

export default app;
