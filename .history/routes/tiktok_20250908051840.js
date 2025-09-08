const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/download", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "TikTok URL is required" });

    const options = {
      method: "GET",
      url: "https://tiktok-video-downloader-api.p.rapidapi.com/vid/index",
      params: { url },
      headers: {
        "X-RapidAPI-Host": "tiktok-video-downloader-api.p.rapidapi.com",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY, // ✅ from .env
      },
    };

    const response = await axios.request(options);

    res.json({
      videoUrl: response.data.video?.url || response.data.url, // return clean videoUrl
    });
  } catch (err) {
    console.error("❌ TikTok API error:", err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data || "Failed to fetch TikTok video",
    });
  }
});

module.exports = router;
