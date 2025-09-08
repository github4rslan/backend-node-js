const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/download", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "TikTok URL is required" });

    const options = {
      method: "GET",
      url: "https://tiktok-video-no-watermark2.p.rapidapi.com/",
      params: { url, hd: "1" },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "tiktok-video-no-watermark2.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    const data = response.data?.data;

    if (!data) return res.status(404).json({ error: "No video found" });

    // Extract only what frontend needs
    res.json({
      title: data.title,
      cover: data.cover,
      video_no_watermark: data.play,
      video_with_watermark: data.wmplay,
      video_hd: data.hdplay,
    });
  } catch (err) {
    console.error("TikTok API error:", err.message);
    res.status(500).json({ error: "Failed to fetch TikTok video" });
  }
});

module.exports = router;
