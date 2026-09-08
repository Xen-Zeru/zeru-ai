import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weatherRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Body parser
app.use(
  express.json({
    limit: '15mb',
  })
);

// Request logging
app.use((req, res, next) => {
  console.log(
    `[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`
  );
  next();
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Zeru AI API',
    weatherConfigured: Boolean(
      process.env.OPENWEATHER_API_KEY &&
      process.env.OPENWEATHER_API_KEY !== 'YOUR_OPENWEATHER_API_KEY'
    ),
    geminiConfigured: Boolean(
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY'
    ),
    timestamp: new Date().toISOString(),
  });
});

// Weather API
app.use('/api/weather', weatherRoutes);

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('===================================================');
  console.log(`🚀 Zeru AI Backend running on port ${PORT}`);
  console.log(`🌐 Port: ${PORT}`);
  console.log('===================================================');
});
