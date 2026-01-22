// Load environment variables from .env file
require('dotenv').config(); 

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Import all your routes
const productRoutes = require('./routes/product.routes');
const userRoutes = require('./routes/user.routes');
const cartRoutes = require('./routes/cart.routes');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(cors());         // To allow cross-origin requests

// Database Connection - with better error handling
let mongoConnected = false;

if (process.env.DB_URI) {
  mongoose.connect(process.env.DB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 5000,
    retryWrites: false,
  })
    .then(() => {
      mongoConnected = true;
      console.log("MongoDB connected successfully.");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      mongoConnected = false;
    });
} else {
  console.error("DB_URI environment variable not set");
}

// --- API Routes ---

// Make the 'upload/images' folder public at the '/images' URL
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

// Health check endpoint - doesn't require MongoDB
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', dbConnected: mongoConnected });
});

// When a request comes to /api/products, use the productRoutes
app.use('/api', productRoutes);

// When a request comes to /api/users, use the userRoutes
app.use('/api', userRoutes);

// When a request comes to /api/cart, use the cartRoutes
app.use('/api', cartRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// --- Server Startup ---

// Root endpoint
app.get("/", (req, res) => {
    res.send("E-Commerce Express Server is Running");
});

// Handle uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port);
    } else {
        console.log("Error: " + error);
    }
});