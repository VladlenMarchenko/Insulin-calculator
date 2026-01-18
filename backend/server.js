require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { initDB } = require("./db");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/auth", require("./routes/authRoutes"));
app.use("/calc", require("./routes/calculationRoutes"));
app.use("/profile", require("./routes/profileRoutes"));

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log("Server running on port", PORT);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
