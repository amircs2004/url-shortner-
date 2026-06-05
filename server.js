require('dotenv').config()
const express = require('express'); 
const connectDB = require('./connection/connectDB'); 
const cors = require('cors') 
const urlRoutes = require('./routes/url.route')
const authRoutes = require('./routes/auth.route')
const cookieParser = require('cookie-parser');
const app = express()

const allowedOrigins = [
  'http://localhost:3000', // For local Next.js testing
  //'https://your-frontend-deployment-url.vercel.app' // Your classmate's Next.js production URL ,
  'https://front-end-shortner.vercel.app'
]; 

// Global Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // 🔥 This matches your frontend 'credentials: include'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())
app.use(cookieParser());
// Routes
app.use('/api' , urlRoutes)
app.use('/api/auth' , authRoutes)


// Connect to MongoDB asynchronously without blocking the server bootup
const startServer = async () => {

  if(process.env.MONGO_URL){
  try{
    await connectDB(process.env.NODE_ENV)
    console.log(' Database Connected Successfully');  

  }catch(error){
    console.error('Error connecting to database:', error);
  }
}else{
  console.error(' CRITICAL: MONGO_URL environment variable is missing!');
}

}
startServer()
// ONLY run app.listen locally. Vercel handles its own serverless ports.
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(` Server is running locally on port ${PORT}`);
    });
}

// REQUIRED FOR VERCEL: Export the app instance
module.exports = app;