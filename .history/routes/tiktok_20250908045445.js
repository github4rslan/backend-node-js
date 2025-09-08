// routes/tiktok.js
const express = require("express");
const axios = require("axios");

const router = express.Router();

// TikTok downloader endpoint
router.post("/download", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "TikTok URL is required" });

    const options = {
      method: 'GET',
      url: 'https://tiktok-video-downloader-api.p.rapidapi.com/download',
      params: { url }, // send TikTok video URL
      headers: {
        'X-RapidAPI-Host': 'tiktok-video-downloader-api.p.rapidapi.com',
        'X-RapidAPI-Key': 'fb3c937032msha8d3baa4c628999p10e786jsn266a890b10de' // replace with your own key
      }
    };

    const response = await axios.request(options);

    // Return the video URL from API
    res.json(response.data);
  } catch (err) {
    console.error("❌ TikTok API error:", err.message);
    res.status(500).json({ error: "Failed to fetch TikTok video" });
  }
});

module.exports = router;
