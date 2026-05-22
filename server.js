require('dotenv').config()
const express = require('express'); 
const connectDB = require('./connection/connectDB'); 
const cors = require('cors') 
const urlRoutes = require('./routes/url.route')
const app = express()


app.use(cors()) 
app.use(express.json())

app.use('/api' , urlRoutes)


const startServer = async () => {
    try {
      await connectDB(process.env.MONGO_URL);
      console.log('dataBase Connected') ;
      app.listen (process.env.PORT , () => {
        console.log(`Server is running on port ${process.env.PORT}`);
      })
      
    }catch(error) {
        console.error('Error starting the server:', error);
        process.exit(1);
    }
}

startServer()