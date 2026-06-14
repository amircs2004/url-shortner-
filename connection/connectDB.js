
const mongoose = require('mongoose');

// This variable will persist across multiple function calls in Vercel
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { 
    conn: null,
     promise: null };
}

const connectDB = async () => {
  // If connection already exists, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, //  CRITICAL: Stop Mongoose from hanging if not connected
    };

    cached.promise = mongoose.connect(process.env.MONGO_URL, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  // Await the promise and store the connection
  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;