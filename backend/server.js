const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

/*
 * Environment
 */

const PORT = process.env.PORT || 5000;

/*
 * CORS
 *
 * Local development:
 * - http://localhost:3000
 * - http://127.0.0.1:3000
 *
 * Production:
 * - Set CLIENT_URL in Render
 */

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      // Allow configured frontend origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow localhost development ports
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/*
 * Middleware
 */

app.use(
  express.json({
    limit: "15mb",
  })
);

app.use(cookieParser());

/*
 * Request Logging
 */

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
  );

  next();
});

/*
 * Routes
 */

// Authentication
app.use("/api/auth", authRoutes);

// AI Chat
app.use("/api/chat", chatRoutes);

// Chat History
app.use("/api/chats", chatRoutes);

/*
 * Health Check
 */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Zeru AI Backend",
    message: "Zeru AI backend is running.",
    environment: process.env.NODE_ENV || "development",
    geminiConfigured: Boolean(
      process.env.GEMINI_API_KEY &&
        process.env.GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY"
    ),
    mongodbConfigured: Boolean(process.env.MONGODB_URI),
    timestamp: new Date().toISOString(),
  });
});

/*
 * 404 Handler
 */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/*
 * Global Error Handler
 */

app.use((error, req, res, next) => {
  console.error("Server Error:", error);

  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS: Origin not allowed.",
    });
  }

  res.status(error.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error."
        : error.message || "Internal server error.",
  });
});

/*
 * MongoDB + Server Startup
 *
 * Connect to MongoDB first.
 * Only start the HTTP server after MongoDB is connected.
 */

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("==============================================");
    console.log("✅ MongoDB connected");
    console.log("🤖 Zeru AI backend initialized");
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log("==============================================");

    app.listen(PORT, "0.0.0.0", () => {
      console.log("==============================================");
      console.log(`🚀 Zeru AI backend running on port ${PORT}`);
      console.log(`🌐 Local: http://localhost:${PORT}`);
      console.log(`❤️ Health: /api/health`);
      console.log("==============================================");
    });
  })
  .catch((error) => {
    console.error("==============================================");
    console.error("❌ MongoDB connection failed");
    console.error(error.message);
    console.error("==============================================");

    process.exit(1);
  });
