import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { getProfile } from "./user.controller.js";

const router = Router();

/**
 * GET /user/profile
 * Protected
 */
router.get("/profile", authenticate, getProfile);

export default router;
