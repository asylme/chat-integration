import OpenAI from "openai";
import { env } from "../config/env.js";
import { httpError } from "../utils/httpError.js";

const client = new OpenAI({ apiKey: env.openAiApiKey });
const asciiOnlyRegex = /^[\x00-\x7F]+$/; // проверяем, что ключ состоит только из ASCII символов

function buildMockReply(message, reason) {
  return [
    "Демо-режим ответа (fallback без платной квоты OpenAI).",
    `Причина: ${reason}.`,
    "",
    `Ваше сообщение: "${message}"`,
    "Короткий ответ ассистента:",
    "Я понял ваш запрос, и связка backend/frontend работает корректно.",
  ].join("\n");
}

function isInvalidKeyFormat(key) {
  if (!key) return true;
  if (!asciiOnlyRegex.test(key)) return true;
  if (!key.startsWith("sk-")) return true;
  return false;
}

export async function askChatGpt(message) {
  if (env.aiForceMock) {
    return buildMockReply(message, "включен AI_FORCE_MOCK");
  }

  if (isInvalidKeyFormat(env.openAiApiKey)) {
    if (env.aiFallbackOnError) {
      return buildMockReply(
        message,
        "OPENAI_API_KEY отсутствует или имеет некорректный формат"
      );
    }
    throw httpError(500, "OPENAI_API_KEY отсутствует или имеет некорректный формат");
  }

  try {
    const completion = await client.chat.completions.create({
      model: env.openAiModel,
      messages: [{ role: "user", content: message }],
    });
    const content = completion.choices?.[0]?.message?.content?.trim() ?? "";
    if (!content) {
      return "Модель не вернула ответ. Попробуйте переформулировать запрос.";
    }
    return content;
  } catch (error) {
    const status = error?.status;
    if (env.aiFallbackOnError && (status === 401 || status === 429)) {
      return buildMockReply(message, `OpenAI API вернул статус ${status}`);
    }
    if (status === 401) {
      throw httpError(401, "Ошибка авторизации в AI-сервисе. Проверьте API-ключ.");
    }

    if (status === 429) {
      throw httpError(
        429,
        "Превышен лимит запросов к AI-сервису. Попробуйте снова немного позже."
      );
    }

    throw httpError(
      502,
      "Временный сбой AI-сервиса или сети. Попробуйте снова через минуту."
    );
  }
}
