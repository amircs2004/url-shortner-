const mongoose = require('mongoose');
const Url = require('../models/url');
const connectDB = require('../connection/connectDB');

const shortenUrl = async (req, res) => {
    try {
        const { longUrl, userId } = req.body; 
        
        if (!longUrl || !userId) {
            // FIX: Changed res.send().json to res.status().json
            return res.status(400).json({
                error: "User ID and the URL are required to create a link" 
            });
        }

        const randomId = Math.random().toString(36).substring(7);
        
        // FIX: Adjusted properties to match your Mongoose schema fields (urlId & createdBy)
        const newUrl = await Url.create({
            urlId: randomId, // This allows findOne to lookup by ID later!
            longUrl: longUrl,
            createdBy: userId  ,
            shortUrl: `https://urlshortner-sand.vercel.app/redirect/${randomId}`  

        });

        // FIX: Changed res.send().json to res.status().json and added return
        return res.status(200).json({
            success: true, 
            data: newUrl,
         shortUrl: `https://urlshortner-sand.vercel.app/redirect/${randomId}`        
        });

    } catch (error) {
        console.error("Creation Error: ", error);
        // FIX: Changed res.send().json to res.status().json
        return res.status(500).json({
            error: "An error occurred while creating the shortened URL"
         });
    }
}

const redirectToUrl = async (req, res) => {
    try {
        // FIX: Switched back to req.params because the ID is part of the URL route path
        const { id } = req.params; 
        if(!id) {
              return res.status(400).json({msg : 'make sure to enter id '})
        }
        const urlRecord = await Url.findOne({ urlId: id });
        
        if (urlRecord) {
            return res.redirect(urlRecord.longUrl);
        } else {
            return res.status(404).json({ error: "Link not found" });
        }
    } catch (error) {
        console.error("Redirect Error: ", error);
        return res.status(500).json({ error: "An error occurred while redirecting the URL" });
    }
}


const testing = async (req, res) => {
  try {
    // FORCE Vercel to wait for the connection handshake to finish
    console.log("VERCEL STRING CHECK:", process.env.MONGO_URL);
    if (mongoose.connection.readyState !== 1) {
      console.log("Database not ready yet. Awaiting connection...");
      await connectDB(); 
    }

    // Now check the status AFTER the await has completed
    const dbStatus = mongoose.connection.readyState;

    if (dbStatus === 1) {
      return res.status(200).json({ msg: 'connected' });
    } else {
      return res.status(503).json({
        success: false, 
        msg: 'Database is not connected',
        readyState: dbStatus
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      msg: 'error', 
      error: error.message 
    });
  }
};

module.exports = {
    shortenUrl,
    redirectToUrl , 
    testing
};