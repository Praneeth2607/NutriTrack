import * as chatbotService from "./chatbot.service.js";

export async function handleMessage(req, res, next) {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    
    const response = await chatbotService.getChatbotResponse(message);
    res.json(response);
  } catch (err) {
    next(err);
  }
}
