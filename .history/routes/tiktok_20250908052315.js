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
      params: { url },
      headers: {
        "X-RapidAPI-Host": "tiktok-video-no-watermark2.p.rapidapi.com",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY, // use your new key
      },
    };

    const response = await axios.request(options);

    res.json({
      videoUrl: response.data?.data?.play || response.data?.data?.wmplay,
    });
  } catch (err) {
    console.error("❌ TikTok API error:", err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data || "Failed to fetch TikTok video",
    });
  }
});

module.exports = router;
