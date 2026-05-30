const mongoose = require('mongoose')

const connectDB = async () => {
    try {
     await mongoose.connect(process.env.MONGO_URL , {
        serverSelectionTimeoutMS: 5000, 
            socketTimeoutMS: 45000,
     })
     console.log('Connected to MongoDB successfully');
    }catch (error) {
        console.error('Error connecting to MongoDB:', error); 
    throw error;
    }
}
module.exports = connectDB