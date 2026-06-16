import dotenv from "dotenv";

import express from "express";

import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
dotenv.config();
const app = express();
connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
