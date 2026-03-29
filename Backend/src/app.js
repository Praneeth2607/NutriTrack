import express from "express";
import cors from "cors";
import foodRoutes from "./modules/food/food.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/foods", foodRoutes);
app.use("/auth", authRoutes);

export default app;
