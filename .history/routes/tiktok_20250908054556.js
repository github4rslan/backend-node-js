const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/download", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "TikTok URL is required" });

    const response = await axios.get(
      "https://tiktok-video-no-watermark2.p.rapidapi.com/get_tiktok_video_info",
      {
        params: { url }, // TikTok video link
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "tiktok-video-no-watermark2.p.rapidapi.com",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("TikTok API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch TikTok video" });
  }
});

module.exports = router;
