require('dotenv').config()
const express = require('express'); 
const connectDB = require('./connection/connectDB'); 
const cors = require('cors') 
const urlRoutes = require('./routes/url.route')
const app = express()

// Global Middleware
app.use(cors()) 
app.use(express.json())

// Routes
app.use('/api' , urlRoutes)

// Connect to MongoDB asynchronously without blocking the server bootup
if (process.env.MONGO_URL) {
  connectDB(process.env.MONGO_URL)
    .then(() => console.log('💾 Database Connected Successfully'))
    .catch((err) => console.error('❌ Database connection error:', err.message));
} else {
  console.error('❌ CRITICAL: MONGO_URL environment variable is missing!');
}

// ONLY run app.listen locally. Vercel handles its own serverless ports.
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`🚀 Server is running locally on port ${PORT}`);
    });
}

// REQUIRED FOR VERCEL: Export the app instance
module.exports = app;