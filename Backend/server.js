import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./src/modules/auth/auth.routes.js";
import userRoutes from "./src/modules/user/user.routes.js";
import profileRoutes from "./src/modules/profile/profile.routes.js";
import foodLogsRoutes from "./src/modules/food_logs/food_logs.routes.js";
import chatbotRoutes from "./src/modules/chatbot/chatbot.routes.js";
import foodRoutes from "./src/modules/food/food.routes.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/profile", profileRoutes);
app.use("/food-logs", foodLogsRoutes);
app.use("/chatbot", chatbotRoutes);
app.use("/food", foodRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
