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

// Database Connection
mongoose.connect(process.env.DB_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- API Routes ---

// Make the 'upload/images' folder public at the '/images' URL
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

// When a request comes to /api/products, use the productRoutes
app.use('/api', productRoutes);

// When a request comes to /api/users, use the userRoutes
app.use('/api', userRoutes);

// When a request comes to /api/cart, use the cartRoutes
app.use('/api', cartRoutes);


// --- Server Startup ---

// Root endpoint
app.get("/", (req, res) => {
    res.send("E-Commerce Express Server is Running");
});

app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port);
    } else {
        console.log("Error: " + error);
    }
});