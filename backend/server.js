const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "15mb",
  })
);

app.use(cookieParser());

/*
 * Routes
 */

app.use("/api/auth", authRoutes);

app.use("/api/chat", chatRoutes);
app.use("/api/chats", chatRoutes);

/*
 * Health check
 */

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Zeru AI backend is running.",
  });
});

/*
 * Start Express Server
 */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

/*
 * MongoDB
 */

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });