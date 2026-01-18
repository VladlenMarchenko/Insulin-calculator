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

const start = async () => {
  await initDB();

  app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
  });
};

start();
