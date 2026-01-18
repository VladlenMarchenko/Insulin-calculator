import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/auth", require("./routes/authRoutes"));
app.use("/calc", require("./routes/calculationRoutes"));
app.use("/profile", require("./routes/profileRoutes"));

const PORT = process.env.PORT || 5000;

await initDB();

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
