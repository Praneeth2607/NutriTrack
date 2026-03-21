import { Router } from "express";
import { handleMessage } from "./chatbot.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/message", authenticate, handleMessage);

export default router;
