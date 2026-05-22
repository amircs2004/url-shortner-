const mongoose = require('mongoose');
const Url = require('../models/url');

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
            createdBy: userId 
        });

        // FIX: Changed res.send().json to res.status().json and added return
        return res.status(200).json({
            success: true, 
            data: newUrl,
            shortUrl: `http://localhost:5001/redirect/${randomId}`
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

module.exports = {
    shortenUrl,
    redirectToUrl
};