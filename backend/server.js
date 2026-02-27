require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const templateRoutes = require('./routes/templateRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─── Connect to MongoDB ───────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────

// Enable CORS for all origins (lock down in production as needed)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json({ limit: '10mb' })); // Allow large HTML payloads

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Routes ───────────────────────────────────────────────────

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Email Preview API is running' });
});

// Mount template routes under /api/templates
app.use('/api/templates', templateRoutes);

// ─── 404 Handler ──────────────────────────────────────────────
// Catches any request that doesn't match defined routes
app.use((req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

// ─── Global Error Handler ─────────────────────────────────────
// Must be after all routes and other middleware
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
