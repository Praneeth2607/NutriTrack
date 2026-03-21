import { Router } from "express";
import { addFoodLog, getLogsForDate, deleteLog, getWeeklyLogs } from "./food_logs.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authenticate, addFoodLog);
router.get("/weekly", authenticate, getWeeklyLogs);
router.get("/", authenticate, getLogsForDate);
router.delete("/:id", authenticate, deleteLog);

export default router;
