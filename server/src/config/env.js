import dotenv from "dotenv";
import path from "path";

dotenv.config();
if (!process.env.OPENAI_API_KEY) {
  dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
}

export const env = {
  port: process.env.PORT || 4000,
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  openAiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
  aiForceMock: process.env.AI_FORCE_MOCK === "true",
  aiFallbackOnError: process.env.AI_FALLBACK_ON_ERROR !== "false",
};

export function validateEnvOnStartup() {
  const hasOpenAiApiKey = Boolean(env.openAiApiKey);
  const canRunWithoutKey = env.aiForceMock || env.aiFallbackOnError;

  if (!hasOpenAiApiKey && !canRunWithoutKey) {
    throw new Error(
      "Invalid env config: OPENAI_API_KEY is required when AI_FORCE_MOCK=false and AI_FALLBACK_ON_ERROR=false."
    );
  }
}
