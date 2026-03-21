import { Router } from "express";
import { getProfile, updateProfile } from "./profile.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getProfile);
router.put("/", authenticate, updateProfile);

export default router;
