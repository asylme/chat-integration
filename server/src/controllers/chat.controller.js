import { askChatGpt } from "../services/chat.service.js";
import { httpError } from "../utils/httpError.js";

export async function chatController(req, res, next) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      throw httpError(400, "Message is required");
    }

    const reply = await askChatGpt(message.trim());
    res.json({ reply });
  } catch (error) {
    next(error);
  }
}
